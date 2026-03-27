// Common script for all pages
document.addEventListener('DOMContentLoaded', function() {
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
              <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
          `;
          productsGrid.appendChild(div);
        });
      })
      .catch(err => {
        productsLoading.textContent = 'Error loading products.';
        console.error(err);
      });
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

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          formMessage.textContent = data.message;
          formMessage.style.color = 'green';
          contactForm.reset();
        } else {
          formMessage.textContent = 'Error sending message.';
          formMessage.style.color = 'red';
        }
      })
      .catch(err => {
        formMessage.textContent = 'Error. Try again.';
        formMessage.style.color = 'red';
        console.error(err);
      });
    });
  }
});
