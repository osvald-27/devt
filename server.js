require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");

const app = express();
app.use(cors({
    origin: "*"
}));
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
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", regLimiter);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port network`);

});


