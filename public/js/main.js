// Common script for all pages
document.addEventListener('DOMContentLoaded', function() {
  function isUserLoggedIn() {
    return localStorage.getItem('user_logged_in') === '1';
  }

  function redirectToUserLogin(targetUrl) {
    const loginUrl = `user-login.html?redirect=${encodeURIComponent(targetUrl)}`;
    window.location.href = loginUrl;
  }

  // Products page: fetch and display products
  const productsGrid = document.getElementById('products-grid');
  const productsLoading = document.getElementById('products-loading');
  if (productsGrid && productsLoading) {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        productsLoading.style.display = 'none';
        products.forEach(product => {
          const div = document.createElement('div');
          div.className = 'ecommerce-product';
          div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
              <div class="product-rating">
                ★★★★☆
                <span class="rating-num">(4.5)</span>
              </div>
              <div class="product-name">${product.name}</div>
              <div class="product-price">${product.price}</div>
              <div class="product-description">${product.description || 'Freshly prepared premium smoked product.'}</div>
              <button class="add-to-cart" data-product-id="${product.id}" data-product-name="${encodeURIComponent(product.name)}" data-product-price="${encodeURIComponent(product.price)}">Add to Cart</button>
            </div>
          `;
          productsGrid.appendChild(div);
        });
      })
      .catch(err => {
        productsLoading.textContent = 'Error loading products.';
        console.error(err);
      });
    // Add to Cart button logic: redirect to payment page with product info
    if (productsGrid) {
      productsGrid.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-to-cart');
        if (btn) {
          const name = btn.getAttribute('data-product-name');
          const price = btn.getAttribute('data-product-price');
          const paymentUrl = `payment.html?product=${name}&price=${price}`;

          if (!isUserLoggedIn()) {
            redirectToUserLogin(paymentUrl);
            return;
          }

          window.location.href = paymentUrl;
        }
      });
    }
  }

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      const btn = document.getElementById('contact-submit-btn');
      const btnText = document.getElementById('contact-btn-text');
      const btnSpinner = document.getElementById('contact-btn-spinner');
      btn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btnText.style.display = '';
        btnSpinner.style.display = 'none';
        if (data.success) {
          formMessage.textContent = data.message;
          formMessage.className = 'form-message success';
          contactForm.reset();
        } else {
          formMessage.textContent = 'Error sending message.';
          formMessage.className = 'form-message error';
        }
      })
      .catch(err => {
        btn.disabled = false;
        btnText.style.display = '';
        btnSpinner.style.display = 'none';
        formMessage.textContent = 'Error. Try again.';
        formMessage.className = 'form-message error';
        console.error(err);
      });
    });
  }
});
