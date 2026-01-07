const express = require('express');
const authMiddleware = require('./authMiddleware');
const router = express.Router();
router.get("/status", (req, res) => {
  res.json({ api: "running" });
});


module.exports = router;