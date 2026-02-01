require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const bodyParser = require("body-parser");
const requestLogger = require("./requestLogger");
const authMiddleware = require("./authMiddleware");
const path = require("path");
const app = express();


app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/me", authMiddleware, async (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

app.use(express.static(path.join(__dirname, "dashboard/build")));
app.get(/^\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard", "build", "index.html"));
});

app.use(requestLogger);
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


app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", regLimiter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
module.exports = app;
