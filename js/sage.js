const collapseEl = document.getElementById('navbarNav');
    const toggleBtn  = document.getElementById('navToggleBtn');

    collapseEl.addEventListener('shown.bs.collapse', () => toggleBtn.classList.add('open'));
    collapseEl.addEventListener('hidden.bs.collapse', () => toggleBtn.classList.remove('open'));

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      navbar.style.transform = st > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
      lastScrollTop = st <= 0 ? 0 : st;
    });

    window.addEventListener("load", () => {
      setTimeout(() => document.getElementById("overlay")?.remove(), 4500);
    });