const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authenticateToken = require('./auth');

const router = express.Router();

/* REGISTER */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, hash],
    err => {
      if (err) return res.status(400).json({ error: 'User exists' });
      res.json({ message: 'Registered successfully' });
    }
  );
});

/* LOGIN */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (!results.length) return res.status(401).json({ error: 'Invalid credentials' });

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    }
  );
});

/* PROTECTED */
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;