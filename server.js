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

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('New contact:', { name, email, message });
  // Simulate save to file or email
  fs.appendFileSync(path.join(__dirname, 'contacts.txt'), `${new Date().toISOString()}: ${name} (${email}): ${message}\n`);
  res.json({ success: true, message: "Thank you! We'll get back to you soon." });
});

// Admin routes - full CRUD
// GET all products for admin
app.get('/api/admin/products', (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const productsData = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
    res.json(JSON.parse(productsData));
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add product
app.post('/api/admin/product', fileUpload.single('image'), (req, res) => {
  const { pass, name, price, description } = req.body;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  if (!req.file || !name || !price || !description) {
    return res.json({ success: false, error: 'Missing fields or image' });
  }
  try {
    const productsFile = path.join(__dirname, 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const newProduct = {
      id: Date.now(), // Better ID
      name: name.trim(),
      price: price.trim(),
      description: description.trim(),
      image: '/uploads/' + req.file.filename
    };
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete product
app.delete('/api/admin/product/:id', (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const id = parseInt(req.params.id);
  try {
    const productsFile = path.join(__dirname, 'data', 'products.json');
    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length === initialLength) {
      return res.json({ success: false, error: 'Product not found' });
    }
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update product
app.put('/api/admin/product/:id', fileUpload.single('image'), (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const id = parseInt(req.params.id);
  const { name, price, description } = req.body;
  try {
    const productsFile = path.join(__dirname, 'data', 'products.json');
    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.json({ success: false, error: 'Product not found' });
    }
    products[productIndex].name = name ? name.trim() : products[productIndex].name;
    products[productIndex].price = price ? price.trim() : products[productIndex].price;
    products[productIndex].description = description ? description.trim() : products[productIndex].description;
    if (req.file) {
      products[productIndex].image = '/uploads/' + req.file.filename;
    }
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.json({ success: true, product: products[productIndex] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
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
