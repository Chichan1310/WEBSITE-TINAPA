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

// Simple front-end login validation and redirect
const loginForm = document.querySelector('.login-card');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (email === 'admin@ptl-tinapa.ph' && password === 'admin123') {
      window.location.href = 'admin-dashboard.html';
    } else {
      alert('Invalid email or password.');
    }
  });
}
