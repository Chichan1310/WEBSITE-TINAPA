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
    const data = await res.json();
    if (data.success === false) return;
    products = data;
    filteredProducts = [...products];
    displayProducts();
  } catch (err) {
    console.error('Load products error:', err);
  }
}

function checkPassword() {
  const password = document.getElementById('admin-password').value;
  if (password === ADMIN_PASS) {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadProducts();
  } else {
    showMessage('Wrong password!', 'error');
  }
}

function showMessage(message, type = 'info') {
  const msgEl = document.getElementById('admin-message');
  msgEl.textContent = message;
  msgEl.className = `message ${type}`;
  setTimeout(() => msgEl.className = 'message', 5000);
}

function displayProducts() {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  currentPage = Math.min(currentPage, totalPages);
  
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, end);
  
  const tbody = document.querySelector('.table-body');
  tbody.innerHTML = pageProducts.map(product => `
    <div class="table-row">
      <img src="${product.image}" alt="${product.name}" class="product-thumb">
      <div class="product-name-table">${product.name}</div>
      <div class="product-price-table">${product.price}</div>
      <div style="max-width: 150px;">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</div>
      <span class="status-badge status-active">Active</span>
      <div>
        <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>
  `).join('');
  
  updatePagination(totalPages);
}

function updatePagination(totalPages) {
  const pagination = document.querySelector('.pagination');
  let pagesHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    pagesHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  pagination.innerHTML = `
    <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
    ${pagesHtml}
    <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;
}

function changePage(delta) {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    displayProducts();
  }
}

function goToPage(page) {
  currentPage = page;
  displayProducts();
}

function filterProducts() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const filter = document.getElementById('filter-select').value;
  
  filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search) || 
                         product.description.toLowerCase().includes(search);
    const matchesFilter = filter === '' || (product.category && product.category.toLowerCase() === filter);
    return matchesSearch && matchesFilter;
  });
  
  currentPage = 1;
  displayProducts();
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('pass', ADMIN_PASS);
  formData.append('name', document.getElementById('prod-name').value);
  formData.append('price', document.getElementById('prod-price').value);
  formData.append('description', document.getElementById('prod-desc').value);
  const imageFile = document.getElementById('prod-image').files[0];
  if (imageFile) formData.append('image', imageFile);
  
  try {
    const url = isEditing ? `/api/admin/product/${editingId}?pass=${ADMIN_PASS}` : '/api/admin/product';
    const method = isEditing ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      body: formData
    });
    const data = await res.json();
    
    if (data.success) {
      showMessage(isEditing ? 'Product updated!' : 'Product added!');
      resetForm();
      loadProducts();
      closeModal();
    } else {
      showMessage(data.error || 'Error occurred', 'error');
    }
  } catch (err) {
    showMessage('Network error', 'error');
    console.error(err);
  }
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  isEditing = true;
  editingId = id;
  
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-desc').value = product.description;
  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('add-product-btn').textContent = 'Update Product';
  
  openModal();
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const res = await fetch(`/api/admin/product/${id}?pass=${ADMIN_PASS}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    
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

