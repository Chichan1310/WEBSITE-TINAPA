// Admin Dashboard JS
let editingProductId = null;

function loadProducts() {
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      const list = document.getElementById('admin-products-list');
      const legend = document.getElementById('admin-stock-legend');
      if (!list) return;
      list.innerHTML = '';
      let lowStockCount = 0;

      if (!products.length) {
        list.innerHTML = '<div style="text-align:center;color:#aaa;padding:1rem;">No products yet. Add one below.</div>';
        if (legend) legend.textContent = '';
        return;
      }

      products.forEach(prod => {
        const isLowStock = typeof prod.stock === 'number' && prod.stock <= 5;
        if (isLowStock) lowStockCount++;
        const div = document.createElement('div');
        div.className = 'admin-product-item';
        div.innerHTML = `
          <img src="${prod.image || ''}" class="admin-product-img" alt="${prod.name}"
            onerror="this.style.display='none'">
          <div class="admin-product-info">
            <div class="admin-product-name">${prod.name}</div>
            <div class="admin-product-price">?${prod.price}</div>
            <div style="color:#718096;font-size:0.95em;">${prod.description || ''}</div>
            <div style="margin-top:0.5em;font-size:0.98em;${isLowStock ? 'color:#e11d48;font-weight:600;' : 'color:#059669;'}">
              Stock: ${prod.stock !== undefined ? prod.stock : 'N/A'}
              ${isLowStock ? ' ? Low stock!' : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="admin-edit-btn" data-id="${prod.id}"
              style="background:#fbbf24;color:#fff;border:none;border-radius:6px;padding:0.4rem 1rem;font-size:0.95em;cursor:pointer;font-weight:600;">
              Edit
            </button>
            <button class="admin-delete-btn" data-id="${prod.id}"
              style="background:#e11d48;color:#fff;border:none;border-radius:6px;padding:0.4rem 1rem;font-size:0.95em;cursor:pointer;font-weight:600;">
              Delete
            </button>
          </div>
        `;
        list.appendChild(div);
      });

      if (legend) legend.textContent = lowStockCount > 0
        ? `Warning: ${lowStockCount} product(s) are low on stock (= 5).`
        : '';

      document.querySelectorAll('.admin-edit-btn').forEach(btn => btn.addEventListener('click', handleEditProduct));
      document.querySelectorAll('.admin-delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteProduct));
    })
    .catch(() => {
      const list = document.getElementById('admin-products-list');
      if (list) list.innerHTML = '<div style="color:#e11d48;text-align:center;">Error loading products.</div>';
    });
}

function handleEditProduct(e) {
  const id = e.target.getAttribute('data-id');
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      const prod = products.find(p => String(p.id) === String(id));
      if (!prod) return;

      document.getElementById('prod-name').value = prod.name;
      document.getElementById('prod-price').value = prod.price;
      document.getElementById('prod-desc').value = prod.description || '';
      document.getElementById('prod-stock').value = prod.stock !== undefined ? prod.stock : 10;
      editingProductId = prod.id;

      // Image not required when editing
      document.getElementById('prod-image').removeAttribute('required');

      document.getElementById('form-heading').textContent = 'Edit Product';
      const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
      if (submitBtn) submitBtn.textContent = 'Save Changes';

      document.getElementById('admin-message').textContent = '';

      const section = document.querySelector('.admin-section');
      const formHeading = document.getElementById('form-heading');
      if (section) {
        window.scrollTo({ top: formHeading.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      }
    });
}

function handleDeleteProduct(e) {
  const id = e.target.getAttribute('data-id');
  if (!confirm('Delete this product? It will be removed from the products page immediately.')) return;

  fetch('/api/admin/delete-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(data => {
      const msg = document.getElementById('admin-message');
      if (data.success) {
        msg.textContent = 'Product deleted! It has been removed from the products page.';
        msg.className = 'admin-message success';
        loadProducts();
      } else {
        msg.textContent = data.error || 'Error deleting product.';
        msg.className = 'admin-message error';
      }
    })
    .catch(() => {
      document.getElementById('admin-message').textContent = 'Error deleting product.';
      document.getElementById('admin-message').className = 'admin-message error';
    });
}

function resetForm() {
  document.getElementById('add-product-form').reset();
  editingProductId = null;
  document.getElementById('prod-image').setAttribute('required', '');
  document.getElementById('form-heading').textContent = 'Add New Product';
  const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Add Product';
  document.getElementById('admin-message').textContent = '';
}

document.addEventListener('DOMContentLoaded', function () {
  loadProducts();

  document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const msg = document.getElementById('admin-message');
    msg.textContent = editingProductId ? 'Saving changes...' : 'Adding product...';
    msg.className = 'admin-message';

    if (editingProductId) {
      formData.append('id', editingProductId);
      fetch('/api/admin/edit-product', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            msg.textContent = 'Product updated! Changes are now live on the products page.';
            msg.className = 'admin-message success';
            resetForm();
            loadProducts();
          } else {
            msg.textContent = data.error || 'Error updating product.';
            msg.className = 'admin-message error';
          }
        })
        .catch(() => {
          msg.textContent = 'Network error. Please try again.';
          msg.className = 'admin-message error';
        });
    } else {
      fetch('/api/admin/add-product', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            msg.textContent = 'Product added! It is now visible on the products page.';
            msg.className = 'admin-message success';
            resetForm();
            loadProducts();
          } else {
            msg.textContent = data.error || 'Error adding product.';
            msg.className = 'admin-message error';
          }
        })
        .catch(() => {
          msg.textContent = 'Network error. Please try again.';
          msg.className = 'admin-message error';
        });
    }
  });

  document.querySelector('#add-product-form button[type="reset"]').addEventListener('click', resetForm);

  document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('admin_logged_in');
    window.location.href = 'admin-login.html';
  });
});
