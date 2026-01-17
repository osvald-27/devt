const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

/* ================== SAFETY CHECK ================== */
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error("❌ Missing JWT ENV variables");
}

/* ================== GOOGLE STRATEGY ================== */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {

    if (!profile.emails || !profile.emails.length)
        return done(null, false);

    const email = profile.emails[0].value;
    const name = profile.displayName || "Google User";

    db.query(
        "SELECT * FROM users WHERE email=? AND deleted_at IS NULL",
        [email],
        (err, users) => {

            if (err) return done(err, null);

            if (users.length)
                return done(null, users[0]);

            db.query(
                "INSERT INTO users (name,email,password_hash) VALUES (?,?,?)",
                [name, email, "GOOGLE_AUTH"],
                (err) => {
                    if (err) return done(err, null);
                    done(null, { email, name });
                }
            );
        }
    );
}));

/* ================== REGISTER ================== */
router.post("/register", async (req, res) => {
try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error:"All fields required" });

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "SELECT id FROM users WHERE email=?",
        [email],
        (err, users) => {

            if (err)
                return res.status(500).json({ error:"DB error" });

            if (users.length)
                return res.status(400).json({ error:"User exists" });

            db.query(
                "INSERT INTO users (name,email,password_hash) VALUES (?,?,?)",
                [name,email,hash],
                err => {

                    if (err)
                        return res.status(500).json({ error:"Insert failed" });

                    res.json({ message:"Registered successfully" });
                }
            );
        }
    );
} catch {
    res.status(500).json({ error:"Server crash" });
}
});

/* ================== LOGIN ================== */
router.post("/login", (req, res) => {

const { email, password } = req.body;

if (!email || !password)
    return res.status(400).json({ error:"Email & password required" });

db.query(
"SELECT * FROM users WHERE email=? AND deleted_at IS NULL",
[email],
async (err, users) => {

    if (err)
        return res.status(500).json({ error:"DB error" });

    if (!users.length)
        return res.status(401).json({ error:"Invalid credentials" });

    const user = users[0];

    if (user.password_hash === "GOOGLE_AUTH")
        return res.status(400).json({ error:"Use Google login" });

    const valid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!valid)
        return res.status(401).json({ error:"Invalid credentials" });

    const accessToken = jwt.sign(
        { id:user.id },
        process.env.JWT_SECRET,
        { expiresIn:"1h" }
    );

    const refreshToken = jwt.sign(
        { id:user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn:"7d" }
    );

    res.json({ accessToken, refreshToken });
});
});

/* ================== REFRESH TOKEN ================== */
router.post("/refresh", (req, res) => {

const { refreshToken } = req.body;

if (!refreshToken)
    return res.status(401).json({ error:"Token required" });

jwt.verify(
refreshToken,
process.env.JWT_REFRESH_SECRET,
(err, decoded) => {

    if (err)
        return res.status(403).json({ error:"Invalid token" });

    const newAccess = jwt.sign(
        { id:decoded.id },
        process.env.JWT_SECRET,
        { expiresIn:"1h" }
    );

    res.json({ accessToken:newAccess });
});
});

/* ================== LOGOUT ================== */
router.post("/logout", (req, res) => {
res.json({ message:"Logged out" });
});

/* ================== SOFT DELETE ACCOUNT ================== */
router.post("/delete", (req,res)=>{

const { userId } = req.body;

db.query(
"UPDATE users SET deleted_at=NOW() WHERE id=?",
[userId],
err=>{
    if(err)
        return res.status(500).json({ error:"Delete failed" });

    res.json({ message:"Account deactivated" });
});
});

/* ================== GOOGLE ================== */
router.get("/google",
passport.authenticate("google",{ scope:["profile","email"] })
);

router.get("/google/callback",
passport.authenticate("google",{ session:false }),
(req,res)=>{

    if(!req.user)
        return res.redirect("/login.html");

    const accessToken = jwt.sign(
        { email:req.user.email },
        process.env.JWT_SECRET,
        { expiresIn:"1h" }
    );

    const refreshToken = jwt.sign(
        { email:req.user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn:"7d" }
    );

    res.redirect(
`https://your-frontend-url.com/dashboard.html?token=${accessToken}&refresh=${refreshToken}`
);
});

module.exports = router;
