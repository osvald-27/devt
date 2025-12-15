const express = require("express");
const app = express();
require("dotenv").config();
const authRoutes = require("./auth");

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
