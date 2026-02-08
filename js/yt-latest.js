const apiKey     = 'AIzaSyD97_O89-D8OkqrG66ogYcLHdP0okZQZ7E';
const playlistId = 'PLomcT89a70M5gF1ZvZbcKUgcW1cwdCnGa';

async function loadLatestVideo() {
  try {
    const resp = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems`
      + `?part=snippet`
      + `&maxResults=1`
      + `&playlistId=${playlistId}`
      + `&key=${apiKey}`
    );

    const data = await resp.json();
    if (!data.items || !data.items.length) return;

    // Sort by date added to playlist (newest first)
    const latest = data.items.sort(
      (a, b) =>
        new Date(b.snippet.publishedAt) -
        new Date(a.snippet.publishedAt)
    )[0];

    const videoId = latest.snippet.resourceId.videoId;

    document.getElementById('main-video').src =
      `https://www.youtube.com/embed/${videoId}`;

  } catch (err) {
    console.error('Error loading latest video:', err);
  }
}

window.addEventListener('load', loadLatestVideo);

