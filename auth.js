const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db"); // Your MySQL connection

// --- GOOGLE STRATEGY SETUP ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const email = profile.emails[0].value;
        const name = profile.displayName;
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
          if (err) return done(err, null);

          if (users.length) {
            // User exists
            return done(null, users[0]);
          } else {
            // Create new user
            db.query(
              "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
              [name, email, null], // password null for Google users
              (err2, result) => {
                if (err2) return done(err2, null);
                return done(null, { name, email });
              }
            );
          }
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- ROUTES ---

// Standard Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email, and password required" });

  const hash = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hash],
    (err) => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.status(201).json({ message: "User registered" });
    }
  );
});

// Standard Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email], async (err, users) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];

    // Google users may not have a password
    if (!user.password_hash)
      return res.status(403).json({ error: "Use Google Login" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET);
    res.json({ accessToken, refreshToken });
  });
});

// Google Auth Trigger
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const accessToken = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ email: req.user.email }, process.env.JWT_REFRESH_SECRET);

    // Redirect to frontend with tokens
    res.redirect(`https://your-frontend-url.com/dashboard.html?token=${accessToken}&refresh=${refreshToken}`);
  }
);

// Refresh access token
router.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    try {
        // Verify refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Issue new access token
        const newAccessToken = jwt.sign({ email: payload.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired refresh token" });
    }
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


module.exports = router;