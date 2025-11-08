// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

db.init();

// GET /api/products
app.get('/api/products', (req, res) => {
  db.getAllProducts((err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// POST /api/cart  (body: { productId, qty })
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty <= 0) return res.status(400).json({ error: 'productId and qty required' });
  const item = { id: uuidv4(), productId, qty };
  db.addToCart(item, (err) => {
    if (err) return res.status(500).json({ error: 'DB insert failed' });
    res.status(201).json({ message: 'Added', item });
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.removeCartItem(id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'DB delete failed' });
    if (changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Removed' });
  });
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  db.getCart((err, data) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(data);
  });
});

// POST /api/checkout  (body: { name, email, cartItems? })
app.post('/api/checkout', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  // For simplicity: read cart from DB and return a mock receipt
  db.getCart((err, data) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    const receipt = {
      id: uuidv4(),
      customer: { name, email },
      total: data.total,
      items: data.items,
      timestamp: new Date().toISOString()
    };
    // clear cart after checkout
    db.clearCart((cerr) => {
      if (cerr) console.error('Failed to clear cart', cerr);
      res.json({ receipt });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
