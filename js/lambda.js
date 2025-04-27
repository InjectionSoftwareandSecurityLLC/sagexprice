const API_ENDPOINT = 'https://telxivq3o42mmq4zc4pkbwkvi40cycub.lambda-url.us-east-2.on.aws/';

    document.addEventListener('DOMContentLoaded', () => {
      const input      = document.getElementById('password-input');
      const submitBtn  = document.getElementById('password-submit');
      const loadingDiv = document.getElementById('password-loading');
      const errorDiv   = document.getElementById('password-error');
      const contentDiv = document.getElementById('about-content');

      submitBtn.addEventListener('click', async () => {
        const pw = input.value.trim();
        if (!pw) return;

        errorDiv.style.display   = 'none';
        loadingDiv.style.display = 'block';
        submitBtn.disabled       = true;

        try {
          const res = await fetch(`${API_ENDPOINT}?password=${encodeURIComponent(pw)}`);
          if (!res.ok) throw new Error('Unauthorized');
          const html = await res.text();
          contentDiv.innerHTML = html;
        } catch (err) {
          errorDiv.style.display = 'block';
        } finally {
          loadingDiv.style.display = 'none';
          submitBtn.disabled       = false;
        }
      });
    });