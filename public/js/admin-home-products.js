
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
