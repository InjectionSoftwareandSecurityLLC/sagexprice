const channelId = 'UCFjMDuV2peRouWDbxNkD94A';
const apiKey = 'AIzaSyD97_O89-D8OkqrG66ogYcLHdP0okZQZ7E'; // Replace with your YouTube Data API key

async function fetchVideos() {
  const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`);
  const searchData = await searchResponse.json();

  const videoItems = searchData.items.filter(item => item.id.kind === 'youtube#video');
  const videoIds = videoItems.map(item => item.id.videoId).join(',');

  const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails`);
  const detailsData = await detailsResponse.json();

  const durationMap = {};
  detailsData.items.forEach(item => {
    const match = item.contentDetails.duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    const minutes = parseInt(match[1]) || 0;
    const seconds = parseInt(match[2]) || 0;
    const totalSeconds = (minutes * 60) + seconds;
    durationMap[item.id] = totalSeconds;
  });

  return videoItems.filter(item => durationMap[item.id.videoId] >= 60);
}

function createPlaylistItem(video) {
const col = document.createElement('div');
col.className = 'col-6 col-md-3 mb-4';

const thumb = document.createElement('img');
thumb.src = video.snippet.thumbnails.medium.url;
thumb.alt = video.snippet.title;
thumb.className = 'img-fluid rounded playlist-thumb';
thumb.dataset.videoId = video.id.videoId;

thumb.addEventListener('click', () => {
    // Update main video
    document.getElementById('main-video').src = `https://www.youtube.com/embed/${video.id.videoId}`;

    // Remove active class from all thumbs
    document.querySelectorAll('.playlist-thumb').forEach(t => t.classList.remove('active'));

    // Set active on clicked thumb
    thumb.classList.add('active');
  });

  col.appendChild(thumb);
  return col;
}

async function init() {
  const loader = document.getElementById('video-loader');
  try {
    const videos = await fetchVideos();
    if (videos.length > 0) {
      document.getElementById('main-video').src = `https://www.youtube.com/embed/${videos[0].id.videoId}`;
      const playlist = document.getElementById('video-playlist');
      videos.forEach(video => {
        playlist.appendChild(createPlaylistItem(video));
      });
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    loader?.remove(); // Remove loader whether it succeeds or fails
  }
}
init();