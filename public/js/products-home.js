document.addEventListener('DOMContentLoaded', function () {
  fetch('data/products-home.json')
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.product-cards');
      if (!container) return;
      container.innerHTML = '';
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">${product.price}</p>
          <p>${product.description}</p>
        `;
        container.appendChild(card);
      });
    });
});
