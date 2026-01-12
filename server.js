require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");

const app = express();
app.use(express.json());

const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});
const regLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({
    origin: "https://osvald-27.github.io/devt", 
    credentials: true
}));

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", regLimiter);


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

module.exports = app;
