const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
  fs.appendFileSync(path.join(__dirname, 'contacts.txt'), `${new Date().toISOString()}: ${name} (${email}): ${message}\\n`);
  res.json({ success: true, message: 'Thank you! We\'ll get back to you soon.' });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Tinapa server running at http://localhost:${PORT}`);
});
