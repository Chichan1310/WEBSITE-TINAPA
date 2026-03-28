
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = 'public/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileUpload = multer({ storage: upload });

const app = express();
const PORT = 3000;

// Admin: Get all products (for dashboard)
app.get('/api/admin/products', (req, res) => {
  const pass = req.query.pass;
  if (!pass || pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const productsData = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
    res.json(JSON.parse(productsData));
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin: Add new product with image upload
app.post('/api/admin/add-product', fileUpload.single('image'), (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    if (!name || !price || !description || !req.file || stock === undefined) {
      return res.json({ success: false, error: 'All fields are required.' });
    }
    const productsPath = path.join(__dirname, 'data', 'products.json');
    let products = [];
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    }
    const newProduct = {
      id: Date.now(),
      name,
      price,
      description,
      image: '/uploads/' + req.file.filename,
      stock: parseInt(stock, 10)
    };
    products.push(newProduct);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.json({ success: false, error: 'Server error.' });
  }
});

// Admin: Edit product
app.post('/api/admin/edit-product', fileUpload.single('image'), (req, res) => {
  try {
    const { id, name, price, description, stock } = req.body;
    if (!id || !name || !price || !description || stock === undefined) {
      return res.json({ success: false, error: 'All fields are required.' });
    }
    const productsPath = path.join(__dirname, 'data', 'products.json');
    let products = [];
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    }
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return res.json({ success: false, error: 'Product not found.' });
    products[idx].name = name;
    products[idx].price = price;
    products[idx].description = description;
    products[idx].stock = parseInt(stock, 10);
    if (req.file) {
      products[idx].image = '/uploads/' + req.file.filename;
    }
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ success: true, product: products[idx] });
  } catch (err) {
    res.json({ success: false, error: 'Server error.' });
  }
});

// Admin: Delete product
app.post('/api/admin/delete-product', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, error: 'Product id required.' });
    const productsPath = path.join(__dirname, 'data', 'products.json');
    let products = [];
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    }
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return res.json({ success: false, error: 'Product not found.' });
    products.splice(idx, 1);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: 'Server error.' });
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sample products data
app.get('/api/products', (req, res) => {
  const productsData = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
  res.json(JSON.parse(productsData));
});

// Analytics summary for dashboard charts
app.get('/api/analytics', (req, res) => {
  try {
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const analyticsPath = path.join(__dirname, 'data', 'sales.json');

    const products = fs.existsSync(productsPath)
      ? JSON.parse(fs.readFileSync(productsPath, 'utf8'))
      : [];

    const analyticsData = fs.existsSync(analyticsPath)
      ? JSON.parse(fs.readFileSync(analyticsPath, 'utf8'))
      : {};

    const monthlySales = Array.isArray(analyticsData.monthlySales)
      ? analyticsData.monthlySales
      : [];

    let topProducts = Array.isArray(analyticsData.topProducts)
      ? analyticsData.topProducts
      : [];

    if (!topProducts.length) {
      topProducts = products.map((product) => {
        const stock = Number(product.stock);
        const stockValue = Number.isFinite(stock) ? stock : 0;
        const price = Number(String(product.price).replace(/[^\d.]/g, '')) || 0;
        const unitsSold = Math.max(5, 120 - (stockValue * 4));

        return {
          name: product.name,
          unitsSold,
          revenue: unitsSold * price
        };
      });
    }

    topProducts = topProducts
      .sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0))
      .slice(0, 5);

    const lowStockTrend = products.map((product) => {
      const stock = Number(product.stock);
      const stockValue = Number.isFinite(stock) ? stock : 0;
      return {
        name: product.name,
        stock: stockValue,
        isLow: stockValue <= 5
      };
    });

    const totalRevenue = topProducts.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
    const totalOrders = monthlySales.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);

    res.json({
      success: true,
      monthlySales,
      topProducts,
      lowStockTrend,
      summary: {
        totalRevenue,
        totalOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Analytics server error' });
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('New contact:', { name, email, message });
  // Simulate save to file or email
  fs.appendFileSync(path.join(__dirname, 'contacts.txt'), `${new Date().toISOString()}: ${name} (${email}): ${message}\n`);
  res.json({ success: true, message: "Thank you! We'll get back to you soon." });
});


// --- Homepage Products API ---
// Get homepage products
app.get('/api/home-products', (req, res) => {
  const file = path.join(__dirname, 'data', 'products-home.json');
  try {
    const data = fs.readFileSync(file, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
// Update homepage products (replace all)
app.put('/api/home-products', (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const file = path.join(__dirname, 'data', 'products-home.json');
  try {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
// --- End Homepage Products API ---

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Tinapa server running at http://localhost:${PORT}`);
  });
}
