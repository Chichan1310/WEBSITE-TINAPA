// Advanced Admin Dashboard JS
let products = [];
let filteredProducts = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 8;
let isEditing = false;
let editingId = null;
const ADMIN_PASS = 'admin123';

document.addEventListener('DOMContentLoaded', function() {
  // Load products
  loadProducts();
  
  // Event listeners
  document.getElementById('admin-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
  });
  
  document.getElementById('search-input').addEventListener('input', filterProducts);
  document.getElementById('filter-select').addEventListener('change', filterProducts);
  
  document.getElementById('add-product-form').addEventListener('submit', handleFormSubmit);
  
  // Mobile sidebar toggle
  document.querySelector('.toggle-sidebar')?.addEventListener('click', toggleSidebar);
});

async function loadProducts() {
  try {
    const res = await fetch(`/api/admin/products?pass=${ADMIN_PASS}`);

    
    if (data.success) {
      showMessage('Product deleted!');
      loadProducts();
    } else {
      showMessage(data.error || 'Delete failed', 'error');
    }
  } catch (err) {
    showMessage('Delete error', 'error');
  }
}

function resetForm() {
  document.getElementById('add-product-form').reset();
  isEditing = false;
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add New Product';
  document.getElementById('add-product-btn').textContent = 'Add Product';
}

function openModal() {
  document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
  resetForm();
}

function toggleSidebar() {
  document.querySelector('.admin-sidebar').classList.toggle('sidebar-open');
}

// Close modal on outside click
document.getElementById('product-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Add product button
document.getElementById('add-product-btn').addEventListener('click', openModal);

// Message styles
const style = document.createElement('style');
style.textContent = `
  .message {
    opacity: 0;
    transition: opacity 0.3s;
  }
  .message.error { color: #ef4444; }
  .message.success { color: #10b981; }
`;
document.head.appendChild(style);

// Dashboard statistics updater
function updateDashboardStats() {
  fetch('/api/admin/products?pass=admin123')
    .then(res => res.json())
    .then(products => {
      document.getElementById('stat-total-products').textContent = products.length;
      let totalStock = 0, lowStock = 0;
      products.forEach(p => {
        const stock = parseInt(p.stock || 0, 10);
        totalStock += stock;
        if (stock <= 5) lowStock++;
      });
      document.getElementById('stat-total-stock').textContent = totalStock;
      document.getElementById('stat-low-stock').textContent = lowStock;
    });
}

document.addEventListener('DOMContentLoaded', updateDashboardStats);

