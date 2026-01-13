const express = require("express");
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
    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    db.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))", [user.id, refreshToken]);

    res.json({ accessToken, refreshToken });
    res.cookie("token", accessToken, { 
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
  });
});

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

/*Test of api*/
router.get("/test", (req, res) => {
   const h = "Niemann@gmail.com"

  db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [h], async (err, users) => {
    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "This works fam" });
    console.log("This works fam")
  });
});

module.exports = router;