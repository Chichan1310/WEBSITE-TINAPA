// Show/hide password toggle
const toggleBtn = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener('click', function () {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    toggleBtn.classList.toggle('active', !isVisible);
    toggleBtn.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
  });
}
