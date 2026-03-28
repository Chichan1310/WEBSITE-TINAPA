document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('user-login-form');
  const message = document.getElementById('user-login-message');

  if (!form || !message) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect') || 'payment.html';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim().toLowerCase();
    const password = document.getElementById('user-password').value;

    if (!fullName || !email || password.length < 6) {
      message.textContent = 'Please provide valid login details.';
      message.className = 'user-login-message error';
      return;
    }

    // For this project we persist a lightweight client-side user session.
    localStorage.setItem('user_logged_in', '1');
    localStorage.setItem('user_name', fullName);
    localStorage.setItem('user_email', email);

    message.textContent = 'Login successful. Redirecting to checkout...';
    message.className = 'user-login-message success';

    setTimeout(function () {
      window.location.href = redirect;
    }, 700);
  });
});
