document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('page-ready');

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
