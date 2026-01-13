const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const authMiddleware = require("./authMiddleware");
const router = express.Router();

// Helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

/* REGISTER */
router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;

  // reset output
  let output = "";

  // 1️⃣ Validate input
  if (!name || !email || !password) {
    output = "Name, email, and password required";
    return res.status(400).json({ output });
  }

  if (!validateEmail(email)) {
    output = "Invalid email format";
    return res.status(400).json({ output });
  }

  if (!validatePassword(password)) {
    output =
      "Password must be at least 8 characters, with uppercase, lowercase, and number";
    return res.status(400).json({ output });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) {
          output = "User exists";
          return res.status(400).json({ output });
        }
        res.json({ message: "Registered", output: "" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ output: "Server error" });
  }
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // reset output
  let output = "";

  if (!email || !password) {
    output = "Email and password required";
    return res.status(400).json({ output });
  }

  db.query(
    "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
    [email],
    async (err, users) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ output: "Server error" });
      }

      if (!users.length) {
        output = "Invalid credentials";
        return res.status(401).json({ output });
      }

      const user = users[0];
      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid) {
        output = "Invalid credentials";
        return res.status(401).json({ output });
      }

      // TODO: Generate JWT or session here
      res.json({ message: "Logged in", output: "" });
    }
  );
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