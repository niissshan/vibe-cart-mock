// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

function init() {
  db.serialize(() => {
    // products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT
      )
    `);

    // cart table (each row represents a product in the cart)
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        productId TEXT,
        qty INTEGER,
        addedAt INTEGER
      )
    `);

    // orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        total REAL,
        timestamp TEXT
      )
    `);

    // order_items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT,
        productId TEXT,
        qty INTEGER,
        price REAL,
        name TEXT
      )
    `);

    // seed products if empty
    db.get(`SELECT COUNT(*) as cnt FROM products`, (err, row) => {
      if (err) return console.error(err);
      if (row && row.cnt === 0) {
        const insert = db.prepare(
          `INSERT INTO products (id, name, price, description) VALUES (?, ?, ?, ?)`
        );
        const sample = [
          ['p1','Vibe T-Shirt',299,'Comfortable cotton tee'],
          ['p2','Vibe Hoodie',799,'Warm hoodie with logo'],
          ['p3','Vibe Cap',199,'Adjustable cap'],
          ['p4','Vibe Mug',149,'Ceramic mug'],
          ['p5','Vibe Sticker Pack',99,'5 vinyl stickers'],
        ];
        sample.forEach(s => insert.run(...s));
        insert.finalize();
        console.log('Seeded products.');
      }
    });
  });
}

function getAllProducts(callback) {
  db.all(`SELECT * FROM products`, callback);
}

/**
 * Add to cart with upsert semantics:
 * - If the product already exists in the cart, increment qty
 * - Otherwise insert a new row
 */
function addToCart(item, callback) {
  db.run(
    `UPDATE cart SET qty = qty + ? WHERE productId = ?`,
    [item.qty, item.productId],
    function (err) {
      if (err) return callback(err);
      if (this.changes > 0) {
        return callback(null, { updated: true });
      }
      // not found → insert
      const stmt = db.prepare(
        `INSERT INTO cart (id, productId, qty, addedAt) VALUES (?, ?, ?, ?)`
      );
      stmt.run(item.id, item.productId, item.qty, Date.now(), function (err2) {
        stmt.finalize();
        callback(err2, { inserted: true });
      });
    }
  );
}

function removeCartItem(id, callback) {
  db.run(`DELETE FROM cart WHERE id = ?`, id, function (err) {
    callback(err, this.changes);
  });
}

function getCart(callback) {
  // join cart with products to include product details
  db.all(
    `
    SELECT c.id as cartId, c.productId, c.qty, p.name, p.price, p.description
    FROM cart c
    LEFT JOIN products p ON p.id = c.productId
  `,
    (err, rows) => {
      if (err) return callback(err);
      const total = rows.reduce((s, r) => s + (r.price || 0) * r.qty, 0);
      callback(null, { items: rows, total });
    }
  );
}

function clearCart(callback) {
  db.run(`DELETE FROM cart`, function (err) {
    callback(err);
  });
}

/**
 * Persist order and its items
 * payload: { customer_name, customer_email, total, items:[{productId, qty, price, name}] }
 */
function createOrder({ customer_name, customer_email, items, total }, callback) {
  const orderId = uuidv4();
  db.serialize(() => {
    const insertOrder = db.prepare(
      `INSERT INTO orders (id, customer_name, customer_email, total, timestamp)
       VALUES (?, ?, ?, ?, ?)`
    );
    insertOrder.run(
      orderId,
      customer_name,
      customer_email,
      total,
      new Date().toISOString(),
      (err) => {
        insertOrder.finalize();
        if (err) return callback(err);

        const insertItem = db.prepare(
          `INSERT INTO order_items (id, orderId, productId, qty, price, name)
           VALUES (?, ?, ?, ?, ?, ?)`
        );
        for (const it of items) {
          insertItem.run(
            uuidv4(),
            orderId,
            it.productId,
            it.qty,
            it.price || 0,
            it.name || '',
            (err2) => {
              if (err2) console.error('order item insert err', err2);
            }
          );
        }
        insertItem.finalize((err3) => {
          if (err3) return callback(err3);
          callback(null, { orderId });
        });
      }
    );
  });
}

function getOrder(orderId, callback) {
  db.get(`SELECT * FROM orders WHERE id = ?`, [orderId], (err, order) => {
    if (err) return callback(err);
    db.all(
      `SELECT * FROM order_items WHERE orderId = ?`,
      [orderId],
      (err2, items) => {
        if (err2) return callback(err2);
        callback(null, { order, items });
      }
    );
  });
}

module.exports = {
  init,
  getAllProducts,
  addToCart,
  removeCartItem,
  getCart,
  clearCart,
  createOrder,
  getOrder,
};
