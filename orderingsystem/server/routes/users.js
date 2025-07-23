const express = require('express');
const router = express.Router();
const db = require('../db');

// 註冊
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 登入
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ message: '登入成功', user: rows[0] });
    } else {
      res.status(401).json({ message: '帳號或密碼錯誤' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;