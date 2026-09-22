(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuBtn = document.getElementById('menuBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  const year = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem('delposh-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  themeToggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('delposh-theme', next);
    themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
  }

  menuBtn.addEventListener('click', () => {
    const open = !mobilePanel.classList.contains('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    mobilePanel.classList.toggle('open', open);
    mobilePanel.setAttribute('aria-hidden', String(!open));
  });

  mobilePanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // Hero video fallback: keep the poster/image alive if the remote video is unavailable.
  const heroVideo = document.querySelector('.hero-video');
  const fallback = document.querySelector('.hero-image-fallback');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
    });
  }

  // Web3Forms submission. The form intentionally contains a placeholder key until the owner supplies theirs.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const accessKey = form.querySelector('[name="access_key"]').value.trim();
    if (!accessKey || accessKey.includes('YOUR_WEB3FORMS')) {
      formStatus.textContent = 'Your Web3Forms access key is still a placeholder. Add it in index.html before launch.';
      return;
    }

    formStatus.textContent = 'Sending your enquiry…';
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();
      if (response.ok && result.success) {
        form.reset();
        formStatus.textContent = 'Thank you — your enquiry has been sent.';
      } else {
        throw new Error(result.message || 'Unable to send');
      }
    } catch (error) {
      formStatus.textContent = 'We could not send the form right now. Please use WhatsApp instead.';
    }
  });

  // Cinematic testimonial ratings: animate from zero to the displayed 5 value.
  const ratingBlocks = document.querySelectorAll('.rating-block');
  function animateRating(block) {
    const number = block.querySelector('.rating-number');
    const fill = block.querySelector('.stars-fill');
    if (!number || !fill || block.dataset.animated === 'true') return;
    block.dataset.animated = 'true';
    const target = Number(number.dataset.target || block.dataset.rating || 5);
    const start = performance.now();
    const duration = 1500;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      number.textContent = value.toFixed(1);
      fill.style.width = `${(value / 5) * 100}%`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const ratingObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateRating(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    ratingBlocks.forEach((block) => ratingObserver.observe(block));
  } else {
    ratingBlocks.forEach(animateRating);
  }

  // Subtle pointer-reactive glow on premium surfaces. It is disabled naturally on touch devices.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.experience-card, .quote-panel, .gallery-item, .gallery-social, .testimonial-card, .detail-card, .contact-form').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });

    document.querySelectorAll('.section').forEach((section) => {
      section.addEventListener('pointermove', (event) => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
        section.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
      });
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.nav-inner', { y: -20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero .reveal-up', { y: 34, opacity: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out', delay: 0.35 });

    document.querySelectorAll('.reveal-up').forEach((el) => {
      if (el.closest('.hero')) return;
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    document.querySelectorAll('.reveal-left').forEach((el) => {
      gsap.fromTo(el,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
      );
    });

    document.querySelectorAll('.reveal-right').forEach((el) => {
      gsap.fromTo(el,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
      );
    });

    gsap.to('.hero-video', {
      scale: 1.08,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }
})();
