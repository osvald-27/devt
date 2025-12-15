const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkUser = "SELECT * FROM users WHERE email = ?";
  db.query(checkUser, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(409).json({ error: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertUser, [name, email, hashedPassword], (err2, results2) => {
      if (err2) return res.status(500).json({ error: "Database insert error" });
      res.status(201).json({ message: "User created successfully" });
    });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const findUser = "SELECT * FROM users WHERE email = ?";
  db.query(findUser, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
});

module.exports = router

// DB status endpoint for quick connection testing
router.get('/db-status', (req, res) => {
  const testSql = 'SELECT 1 + 1 AS result';
  db.query(testSql, (err, results) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    return res.json({ ok: true, result: results[0] });
  });
});