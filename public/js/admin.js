function checkPassword() {
  const password = document.getElementById('admin-password').value;
  if (password === 'admin123') {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
  } else {
    alert('Wrong password!');
  }
}

document.getElementById('add-product-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('pass', document.getElementById('admin-password').value);
  formData.append('name', document.getElementById('prod-name').value);
  formData.append('price', document.getElementById('prod-price').value);
  formData.append('image', document.getElementById('prod-image').files[0]);
  formData.append('description', document.getElementById('prod-desc').value);
  fetch('/api/admin/product', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    const msg = document.getElementById('admin-message');
    if (data.success) {
      msg.textContent = 'Product added!';
      msg.style.color = 'green';
      document.getElementById('add-product-form').reset();
    } else {
      msg.textContent = data.error || 'Error adding product.';
      msg.style.color = 'red';
    }
  })
  .catch(err => {
    document.getElementById('admin-message').textContent = 'Error.';
    console.error(err);
  });
});
