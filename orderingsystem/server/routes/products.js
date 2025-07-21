const express = require('express');
const router = express.Router();
const db = require('../db');

// GET 所有商品
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.json(rows);
});

module.exports = router;
