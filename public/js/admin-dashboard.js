let editingProductId = null;
let allProducts = [];
let pendingDeleteId = null;
let salesTrendChart = null;
let topProductsChart = null;
let lowStockChart = null;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseStock(value) {
  const stock = Number(value);
  if (Number.isNaN(stock)) return null;
  return stock;
}

function updateCounters(products) {
  const total = products.length;
  const lowStock = products.filter((product) => {
    const stock = parseStock(product.stock);
    return stock !== null && stock <= 5;
  }).length;

  const productCount = document.getElementById('product-count');
  const lowStockCount = document.getElementById('low-stock-count');

  if (productCount) productCount.textContent = String(total);
  if (lowStockCount) lowStockCount.textContent = String(lowStock);
}

function formatPeso(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH')}`;
}

function destroyChart(chartRef) {
  if (chartRef && typeof chartRef.destroy === 'function') {
    chartRef.destroy();
  }
}

function renderAnalyticsCharts(data) {
  if (typeof Chart === 'undefined') {
    return;
  }

  const monthlySales = Array.isArray(data.monthlySales) ? data.monthlySales : [];
  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : [];
  const lowStockTrend = Array.isArray(data.lowStockTrend) ? data.lowStockTrend : [];

  const salesCtx = document.getElementById('sales-trend-chart');
  const topCtx = document.getElementById('top-products-chart');
  const lowCtx = document.getElementById('low-stock-chart');

  if (!salesCtx || !topCtx || !lowCtx) {
    return;
  }

  destroyChart(salesTrendChart);
  destroyChart(topProductsChart);
  destroyChart(lowStockChart);

  salesTrendChart = new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: monthlySales.map((entry) => entry.month),
      datasets: [
        {
          label: 'Sales',
          data: monthlySales.map((entry) => Number(entry.sales) || 0),
          tension: 0.35,
          borderWidth: 3,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#ea580c'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return formatPeso(ctx.raw);
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return `PHP ${Number(value).toLocaleString('en-PH')}`;
            }
          }
        }
      }
    }
  });

  topProductsChart = new Chart(topCtx, {
    type: 'bar',
    data: {
      labels: topProducts.map((entry) => entry.name),
      datasets: [
        {
          label: 'Revenue',
          data: topProducts.map((entry) => Number(entry.revenue) || 0),
          backgroundColor: ['#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return formatPeso(ctx.raw);
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return `PHP ${Number(value).toLocaleString('en-PH')}`;
            }
          }
        }
      }
    }
  });

  lowStockChart = new Chart(lowCtx, {
    type: 'bar',
    data: {
      labels: lowStockTrend.map((entry) => entry.name),
      datasets: [
        {
          label: 'Current Stock',
          data: lowStockTrend.map((entry) => Number(entry.stock) || 0),
          backgroundColor: lowStockTrend.map((entry) => (entry.isLow ? '#ef4444' : '#22c55e'))
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function loadAnalytics() {
  fetch('/api/analytics')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success) {
        renderAnalyticsCharts(data);
      }
    })
    .catch(() => {
      // Keep dashboard usable even if analytics fails.
    });
}

function getStockBadge(product) {
  const stock = parseStock(product.stock);
  if (stock === null) {
    return '<span class="stock-badge low-stock">Stock: N/A</span>';
  }
  if (stock <= 5) {
    return `<span class="stock-badge low-stock">Low Stock: ${stock}</span>`;
  }
  return `<span class="stock-badge in-stock">In Stock: ${stock}</span>`;
}

function createProductCard(product) {
  const name = escapeHtml(product.name);
  const price = escapeHtml(product.price);
  const description = escapeHtml(product.description);
  const image = escapeHtml(product.image || '');
  const stockBadge = getStockBadge(product);

  return `
    <article class="admin-product-item">
      <img src="${image}" class="admin-product-img" alt="${name}" onerror="this.style.display='none'">
      <div class="admin-product-body">
        <h3 class="admin-product-name">${name}</h3>
        <p class="admin-product-price">PHP ${price}</p>
        <p class="admin-product-desc">${description}</p>
        ${stockBadge}
        <div class="admin-actions">
          <button class="admin-action-btn edit" data-action="edit" data-id="${product.id}" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20H21"/><path d="M16.5 3.5A2.1 2.1 0 0 1 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"/></svg>
            Edit
          </button>
          <button class="admin-action-btn delete" data-action="delete" data-id="${product.id}" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6H21"/><path d="M8 6V4H16V6"/><path d="M19 6L18 20H6L5 6"/></svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(products) {
  const list = document.getElementById('admin-products-list');
  const legend = document.getElementById('admin-stock-legend');
  if (!list) return;

  if (!products.length) {
    list.innerHTML = '<div style="padding:1rem;color:#6b7280;">No matching products found.</div>';
    if (legend) legend.textContent = '';
    return;
  }

  list.innerHTML = products.map(createProductCard).join('');

  const lowStockCount = products.filter((product) => {
    const stock = parseStock(product.stock);
    return stock !== null && stock <= 5;
  }).length;

  if (legend) {
    legend.textContent = lowStockCount > 0
      ? `Warning: ${lowStockCount} product(s) are low on stock (<= 5).`
      : '';
  }
}

function applyProductFilter() {
  const search = document.getElementById('product-search');
  if (!search) return;

  const term = search.value.trim().toLowerCase();
  if (!term) {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter((product) => {
    const name = String(product.name || '').toLowerCase();
    const description = String(product.description || '').toLowerCase();
    return name.includes(term) || description.includes(term);
  });

  renderProducts(filtered);
}

function loadProducts() {
  fetch('/api/products')
    .then((res) => res.json())
    .then((products) => {
      allProducts = Array.isArray(products) ? products : [];
      updateCounters(allProducts);
      applyProductFilter();
      loadAnalytics();
    })
    .catch(() => {
      const list = document.getElementById('admin-products-list');
      if (list) {
        list.innerHTML = '<div style="padding:1rem;color:#b91c1c;">Error loading products.</div>';
      }
    });
}

function setFormMode(isEditing) {
  const heading = document.getElementById('form-heading');
  const submitLabel = document.querySelector('#submit-form-btn .btn-label');
  const imageInput = document.getElementById('prod-image');

  if (heading) heading.textContent = isEditing ? 'Edit Product' : 'Add Product';
  if (submitLabel) submitLabel.textContent = isEditing ? 'Save Changes' : 'Add Product';

  if (imageInput) {
    if (isEditing) {
      imageInput.removeAttribute('required');
    } else {
      imageInput.setAttribute('required', '');
    }
  }
}

function renderImagePreviewFromUrl(url) {
  const preview = document.getElementById('image-preview');
  if (!preview) return;

  if (!url) {
    preview.innerHTML = 'No image selected';
    return;
  }

  preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Selected preview">`;
}

function handleEditProduct(id) {
  const product = allProducts.find((item) => String(item.id) === String(id));
  if (!product) return;

  document.getElementById('prod-name').value = product.name || '';
  document.getElementById('prod-price').value = product.price || '';
  document.getElementById('prod-desc').value = product.description || '';
  document.getElementById('prod-stock').value = product.stock ?? 0;

  editingProductId = product.id;
  setFormMode(true);
  renderImagePreviewFromUrl(product.image || '');

  const formSection = document.getElementById('orders-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openDeleteModal(id) {
  pendingDeleteId = id;
  const backdrop = document.getElementById('confirm-modal-backdrop');
  if (backdrop) backdrop.classList.add('active');
}

function closeDeleteModal() {
  pendingDeleteId = null;
  const backdrop = document.getElementById('confirm-modal-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

function handleDeleteConfirmed() {
  if (!pendingDeleteId) return;

  fetch('/api/admin/delete-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: pendingDeleteId })
  })
    .then((res) => res.json())
    .then((data) => {
      const message = document.getElementById('admin-message');
      if (data.success) {
        if (message) {
          message.textContent = 'Product deleted successfully.';
          message.className = 'admin-message success';
        }
        loadProducts();
      } else if (message) {
        message.textContent = data.error || 'Error deleting product.';
        message.className = 'admin-message error';
      }
    })
    .catch(() => {
      const message = document.getElementById('admin-message');
      if (message) {
        message.textContent = 'Error deleting product.';
        message.className = 'admin-message error';
      }
    })
    .finally(closeDeleteModal);
}

function resetForm() {
  const form = document.getElementById('add-product-form');
  if (form) form.reset();

  editingProductId = null;
  setFormMode(false);
  renderImagePreviewFromUrl('');

  const message = document.getElementById('admin-message');
  if (message) {
    message.textContent = '';
    message.className = 'admin-message';
  }
}

function setSubmitLoading(isLoading) {
  const submitButton = document.getElementById('submit-form-btn');
  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('add-product-form');
  const message = document.getElementById('admin-message');
  if (!form) return;

  const formData = new FormData(form);
  const endpoint = editingProductId ? '/api/admin/edit-product' : '/api/admin/add-product';

  if (editingProductId) {
    formData.append('id', editingProductId);
  }

  if (message) {
    message.textContent = editingProductId ? 'Saving changes...' : 'Adding product...';
    message.className = 'admin-message';
  }

  setSubmitLoading(true);

  fetch(endpoint, {
    method: 'POST',
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        if (message) {
          message.textContent = editingProductId
            ? 'Product updated successfully.'
            : 'Product added successfully.';
          message.className = 'admin-message success';
        }
        resetForm();
        loadProducts();
      } else if (message) {
        message.textContent = data.error || 'Unable to save product.';
        message.className = 'admin-message error';
      }
    })
    .catch(() => {
      if (message) {
        message.textContent = 'Network error. Please try again.';
        message.className = 'admin-message error';
      }
    })
    .finally(() => {
      setSubmitLoading(false);
    });
}

function handleProductActions(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;

  const action = actionButton.getAttribute('data-action');
  const id = actionButton.getAttribute('data-id');

  if (action === 'edit') {
    handleEditProduct(id);
    return;
  }

  if (action === 'delete') {
    openDeleteModal(id);
  }
}

function setupImagePreview() {
  const imageInput = document.getElementById('prod-image');
  if (!imageInput) return;

  imageInput.addEventListener('change', function () {
    const file = imageInput.files && imageInput.files[0];
    if (!file) {
      renderImagePreviewFromUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    renderImagePreviewFromUrl(objectUrl);
  });
}

function logout() {
  localStorage.removeItem('admin_logged_in');
  window.location.href = 'admin-login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('admin_logged_in') !== '1') {
    window.location.href = 'admin-login.html';
    return;
  }

  const form = document.getElementById('add-product-form');
  const resetButton = document.getElementById('reset-form-btn');
  const searchInput = document.getElementById('product-search');
  const list = document.getElementById('admin-products-list');
  const logoutButton = document.getElementById('logout-btn');
  const sidebarLogoutButton = document.getElementById('sidebar-logout-btn');

  if (form) form.addEventListener('submit', handleFormSubmit);
  if (resetButton) resetButton.addEventListener('click', resetForm);
  if (searchInput) searchInput.addEventListener('input', applyProductFilter);
  if (list) list.addEventListener('click', handleProductActions);
  if (logoutButton) logoutButton.addEventListener('click', logout);
  if (sidebarLogoutButton) sidebarLogoutButton.addEventListener('click', logout);

  const backdrop = document.getElementById('confirm-modal-backdrop');
  const cancelDelete = document.getElementById('cancel-delete-btn');
  const confirmDelete = document.getElementById('confirm-delete-btn');
  if (cancelDelete) cancelDelete.addEventListener('click', closeDeleteModal);
  if (confirmDelete) confirmDelete.addEventListener('click', handleDeleteConfirmed);
  if (backdrop) {
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) {
        closeDeleteModal();
      }
    });
  }

  setupImagePreview();
  setFormMode(false);
  loadProducts();
});
