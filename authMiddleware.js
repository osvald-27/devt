// authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("./db");

async function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.query(
      "SELECT id, name, email FROM users WHERE id = ? AND deleted = 0",
      [decoded.id]
    );

    if (!user.length) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user[0]; //  attach identity to request
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
