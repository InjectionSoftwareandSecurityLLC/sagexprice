const apiKey     = 'AIzaSyD97_O89-D8OkqrG66ogYcLHdP0okZQZ7E';
const playlistId = 'PLomcT89a70M5gF1ZvZbcKUgcW1cwdCnGa';

async function fetchVideos() {
  // 1) Grab up to 50 items from the playlist
  const resp = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems`
    + `?part=snippet`
    + `&maxResults=50`
    + `&playlistId=${playlistId}`
    + `&key=${apiKey}`
  );
  const data = await resp.json();

  // 2) Map into the shape your UI expects **and** pull out the publish date
  const videos = data.items.map(item => ({
    id: { videoId: item.snippet.resourceId.videoId },
    snippet: {
      title:       item.snippet.title,
      thumbnails:  item.snippet.thumbnails,
      publishedAt: item.snippet.publishedAt    // <— when it was added to the playlist
    }
  }));

  // 3) Sort descending by that date
  videos.sort((a, b) => 
    new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
  );

  return videos;
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
    document.getElementById('main-video').src =
      `https://www.youtube.com/embed/${video.id.videoId}`;
    document.querySelectorAll('.playlist-thumb')
      .forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });

  col.appendChild(thumb);
  return col;
}

async function init() {
  const loader = document.getElementById('video-loader');
  try {
    const videos = await fetchVideos();
    if (videos.length) {
      document.getElementById('main-video').src =
        `https://www.youtube.com/embed/${videos[0].id.videoId}`;
      const playlist = document.getElementById('video-playlist');
      videos.forEach(v => playlist.appendChild(createPlaylistItem(v)));
    }
  } catch (err) {
    console.error('Error fetching playlist:', err);
  } finally {
    loader?.remove();
  }
}

window.addEventListener('load', init);