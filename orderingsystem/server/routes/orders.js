const express = require('express');
const router = express.Router();
const db = require('../db');

// 建立訂單
router.post('/', async (req, res) => {
  const { user_id, items } = req.body;
  try {
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, created_at) VALUES (?, NOW())',
      [user_id]
    );
    const orderId = orderResult.insertId;
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.product_id, item.quantity]
      );
    }
    res.status(201).json({ order_id: orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 查詢用戶所有訂單
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 查詢單一訂單明細
router.get('/:order_id', async (req, res) => {
  const { order_id } = req.params;
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order_id]);
    res.json({ order: order[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;