require("dotenv").config();
const express = require("express");
const db = require("./db");
const authRoutes = require("./auth");

const app = express();
app.use(express.json());

// simple health check
app.get("/", (req, res) => res.json({ status: "ok" }));

// mount auth routes under /api
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});