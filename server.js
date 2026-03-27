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

// Admin routes
app.post('/api/admin/product', fileUpload.single('image'), (req, res) => {
  const { pass, name, price, description } = req.body;
  if (pass !== 'admin123') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  if (!req.file || !name || !price || !description) {
    return res.json({ success: false, error: 'Missing fields or image' });
  }
  const productsFile = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    description,
    image: '/uploads/' + req.file.filename
  };
  products.push(newProduct);
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.json({ success: true, message: 'Product added with image!' });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Tinapa server running at http://localhost:${PORT}`);
});
