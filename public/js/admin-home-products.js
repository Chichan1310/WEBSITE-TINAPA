document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('homepage-products-list');
  if (!list) return;

  // Load products from API
  fetch('/api/home-products')
    .then(res => res.json())
    .then(products => {
      renderList(products);
    });

  function renderList(products) {
    list.innerHTML = '';
    products.forEach((prod, idx) => {
      const div = document.createElement('div');
      div.className = 'admin-home-product';
      div.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:1rem;" onerror="this.onerror=null;this.src='https://via.placeholder.com/60?text=No+Image';">
        <strong>${prod.name}</strong> <span style="color:#888;">${prod.price}</span>
        <span style="margin-left:1rem;">${prod.description}</span>
        <button class="action-btn edit-btn edit-home-prod" data-idx="${idx}">Edit</button>
        <button class="action-btn delete-btn delete-home-prod" data-idx="${idx}">Delete</button>
      `;
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.marginBottom = '1rem';
      list.appendChild(div);
    });
  }

  // Edit button logic
  list.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-home-prod')) {
      const idx = e.target.getAttribute('data-idx');
      fetch('/api/home-products')
        .then(res => res.json())
        .then(products => {
          const prod = products[idx];
          document.getElementById('edit-home-prod-name').value = prod.name;
          document.getElementById('edit-home-prod-price').value = prod.price;
          document.getElementById('edit-home-prod-image').value = prod.image;
          document.getElementById('edit-home-prod-desc').value = prod.description;
          document.getElementById('edit-home-prod-idx').value = idx;
          document.getElementById('edit-home-prod-modal').style.display = 'block';
        });
    }
  });

  // Save changes (now with backend persistence)
  document.getElementById('edit-home-prod-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('edit-home-prod-idx').value, 10);
    const updated = {
      name: document.getElementById('edit-home-prod-name').value,
      price: document.getElementById('edit-home-prod-price').value,
      image: document.getElementById('edit-home-prod-image').value,
      description: document.getElementById('edit-home-prod-desc').value
    };
    fetch('/api/home-products')
      .then(res => res.json())
      .then(products => {
        products[idx] = updated;
        fetch('/api/home-products?pass=admin123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            document.getElementById('edit-home-prod-modal').style.display = 'none';
            renderList(products);
            alert('Product updated!');
          } else {
            alert('Failed to save: ' + (result.error || 'Unknown error'));
          }
        });
      });
  });

  // Show add modal
  document.getElementById('add-home-product-btn').onclick = function () {
    document.getElementById('add-home-prod-form').reset();
    document.getElementById('add-home-prod-modal').style.display = 'block';
  };

  // Add product logic
  document.getElementById('add-home-prod-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const newProd = {
      name: document.getElementById('add-home-prod-name').value,
      price: document.getElementById('add-home-prod-price').value,
      image: document.getElementById('add-home-prod-image').value,
      description: document.getElementById('add-home-prod-desc').value
    };
    fetch('/api/home-products')
      .then(res => res.json())
      .then(products => {
        products.push(newProd);
        fetch('/api/home-products?pass=admin123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            document.getElementById('add-home-prod-modal').style.display = 'none';
            renderList(products);
            alert('Product added!');
          } else {
            alert('Failed to add: ' + (result.error || 'Unknown error'));
          }
        });
      });
  });

  // Fix: Also open edit modal when clicking the section title
  document.querySelector('.homepage-products-admin h2').onclick = function () {
    // If there are products, open the first for edit
    fetch('/api/home-products')
      .then(res => res.json())
      .then(products => {
        if (products.length > 0) {
          const prod = products[0];
          document.getElementById('edit-home-prod-name').value = prod.name;
          document.getElementById('edit-home-prod-price').value = prod.price;
          document.getElementById('edit-home-prod-image').value = prod.image;
          document.getElementById('edit-home-prod-desc').value = prod.description;
          document.getElementById('edit-home-prod-idx').value = 0;
          document.getElementById('edit-home-prod-modal').style.display = 'block';
        }
      });
  };
});
