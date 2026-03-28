// Modern Admin Dashboard JS
document.addEventListener('DOMContentLoaded', function() {
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
          list.innerHTML = '<div style="text-align:center;color:#aaa;">No products yet.</div>';
          legend.textContent = '';
          return;
        }
        products.forEach(prod => {
          const isLowStock = prod.stock !== undefined && prod.stock <= 5;
          if (isLowStock) lowStockCount++;
          const div = document.createElement('div');
          div.className = 'admin-product-item';
          div.innerHTML = `
            <img src="${prod.image || '/uploads/no-image.png'}" class="admin-product-img" alt="${prod.name}">
            <div class="admin-product-info">
              <div class="admin-product-name">${prod.name}</div>
              <div class="admin-product-price">₱${prod.price}</div>
              <div style="color:#718096;font-size:0.95em;">${prod.description || ''}</div>
              <div style="margin-top:0.5em;font-size:0.98em;${isLowStock ? 'color:#e11d48;font-weight:600;' : 'color:#059669;'}">
                Stock: ${prod.stock !== undefined ? prod.stock : 'N/A'}
                ${isLowStock ? ' <span style="margin-left:0.5em;">Low stock!</span>' : ''}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <button class="admin-edit-btn" data-id="${prod.id}" style="background:#fbbf24;color:#fff;border:none;border-radius:6px;padding:0.3rem 0.8rem;font-size:0.95em;cursor:pointer;">Edit</button>
              <button class="admin-delete-btn" data-id="${prod.id}" style="background:#e11d48;color:#fff;border:none;border-radius:6px;padding:0.3rem 0.8rem;font-size:0.95em;cursor:pointer;">Delete</button>
            </div>
          `;
          list.appendChild(div);
        });
        legend.textContent = lowStockCount > 0 ? `Warning: ${lowStockCount} product(s) are low on stock (≤ 5).` : '';
        // Attach edit/delete listeners
        document.querySelectorAll('.admin-edit-btn').forEach(btn => btn.addEventListener('click', handleEditProduct));
        document.querySelectorAll('.admin-delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteProduct));
      });
  }
      document.querySelectorAll('.admin-edit-btn').forEach(btn => btn.addEventListener('click', handleEditProduct));
      document.querySelectorAll('.admin-delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteProduct));
    });
}
let editingProductId = null;

function handleEditProduct(e) {
  const id = e.target.getAttribute('data-id');
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      const prod = products.find(p => String(p.id) === String(id));
      if (!prod) return;
      document.getElementById('prod-name').value = prod.name;
      document.getElementById('prod-price').value = prod.price;
      document.getElementById('prod-desc').value = prod.description;
      document.getElementById('prod-stock').value = prod.stock !== undefined ? prod.stock : 10;
      editingProductId = prod.id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function handleDeleteProduct(e) {
  const id = e.target.getAttribute('data-id');
  if (!confirm('Delete this product?')) return;
  fetch('/api/admin/delete-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(data => {
      const msg = document.getElementById('admin-message');
      if (data.success) {
        msg.textContent = 'Product deleted!';
        msg.className = 'admin-message success';
        loadProducts();
      } else {
        msg.textContent = data.error || 'Error deleting product.';
        msg.className = 'admin-message error';
      }
    })
    .catch(() => {
      const msg = document.getElementById('admin-message');
      msg.textContent = 'Error deleting product.';
      msg.className = 'admin-message error';
    });
}

function handleAddProduct(e) {
  e.preventDefault();
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);
  const msg = document.getElementById('admin-message');
  msg.textContent = editingProductId ? 'Saving...' : 'Uploading...';
  msg.className = 'admin-message';
  if (editingProductId) {
    formData.append('id', editingProductId);
    fetch('/api/admin/edit-product', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          msg.textContent = 'Product updated!';
          msg.className = 'admin-message success';
          form.reset();
          editingProductId = null;
          loadProducts();
        } else {
          msg.textContent = data.error || 'Error updating product.';
          msg.className = 'admin-message error';
        }
      })
      .catch(() => {
        msg.textContent = 'Error updating product.';
        msg.className = 'admin-message error';
      });
  } else {
    fetch('/api/admin/add-product', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          msg.textContent = 'Product added!';
          msg.className = 'admin-message success';
          form.reset();
          loadProducts();
        } else {
          msg.textContent = data.error || 'Error adding product.';
          msg.className = 'admin-message error';
        }
      })
      .catch(() => {
        msg.textContent = 'Error uploading product.';
        msg.className = 'admin-message error';
      });
  }
}

