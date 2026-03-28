document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('page-ready');

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  const hero = document.getElementById('hero');
  const heroImage = document.querySelector('.hero-image');

  if (!hero || !heroImage) {
    return;
  }

  window.addEventListener('scroll', function () {
    const y = window.scrollY;

    if (y < 900) {
      hero.style.backgroundPosition = `center, center, center, center ${Math.round(y * 0.18)}px`;
      heroImage.style.transform = `translateY(${Math.round(y * -0.06)}px)`;
    }
  }, { passive: true });
});
