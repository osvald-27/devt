const express = require("express");
<<<<<<< HEAD
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password required" });

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hash],
    err => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.json({ message: "Registered" });
    }
  );
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email], async (err, users) => {
=======
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db"); // your database connection
const authMiddleware = require("./authMiddleware");

// --- REGISTER ---
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password required" });
  }

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(400).json({ error: "User exists" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert into DB
    db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) return res.status(500).json({ error: "Database insert error" });
        res.json({ message: "Registered" });
      }
    );
  });
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email], async (err, users) => {
    if (err) return res.status(500).json({ error: "Database error" });
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

<<<<<<< HEAD
    const accessToken = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    db.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))", [user.id, refreshToken]);
=======
    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET
    );

    // Optional: save refresh token in DB for logout/rotation
    db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [refreshToken, user.id], (err) => {
      if (err) console.error("Failed to save refresh token:", err);
    });
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf

    res.json({ accessToken, refreshToken });
  });
});

<<<<<<< HEAD
/* REFRESH TOKEN */
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(403);

  db.query("SELECT * FROM refresh_tokens WHERE token = ?", [refreshToken], (err, tokens) => {
    if (!tokens.length) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const newAccess = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccess });
    });
  });
});

/* CURRENT USER */
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  db.query("DELETE FROM refresh_tokens WHERE token = ?", [req.body.refreshToken]);
  res.json({ message: "Logged out" });
});

/* SOFT DELETE */
router.delete("/delete", authMiddleware, (req, res) => {
  db.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [req.user.id]);
  res.json({ message: "Account deleted" });
});
=======
// --- REFRESH TOKEN ---
router.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Refresh token required" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: "Invalid refresh token" });

    const accessToken = jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken });
  });
});

// --- SOFT DELETE USER ---
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User soft deleted" });
  });
});

// -- LOGOUT---
router.post("/logout", authMiddleware, (req,res) => {
  res.json({ message: "Logged out" });
})
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf

module.exports = router;