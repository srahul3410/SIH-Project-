require('dotenv').config(); // 1. Added dotenv at top
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user.js");
const path = require('path');
const session = require("express-session");
const MongoStore = require("connect-mongo"); // 2. Fixed import (removed curly braces)

const adminEmail = process.env.ADMIN_EMAIL || "admin@vidyasetu.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUrl) {
    console.error("FATAL ERROR: Neither MONGODB_URI nor MONGO_URI is set in environment variables!");
    process.exit(1);
}

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "vidyasetu-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 30
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    }
}));

async function main() {
    await mongoose.connect(mongoUrl);
    console.log("DB connected successfully to Atlas!");
    
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} !!`);
    });
}

main().catch(err => {
    console.error("DB connection failed:", err);
    process.exitCode = 1;
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added for parsing json requests safely
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

async function requireLogin(req, res, next) {
    try {
        if (req.session.isAdmin) {
            req.user = { name: "Admin", email: adminEmail };
        } else {
            if (!req.session.userId) {
                return res.redirect("/login");
            }

            req.user = await User.findById(req.session.userId);
            if (!req.user) {
                req.session.destroy(() => res.redirect("/login"));
                return;
            }
        }
        next();
    } catch (err) {
        next(err);
    }
}

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/learn-More", (req, res) => {
    res.render("learnM");
});

app.get("/login", (req, res) => {
    res.render("login", {
        error: req.query.error
    });
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const normalizedName = (name || "").trim();
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).send("Name, email and password are required.");
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.send("Email already registered. Please login.");
        }

        const newUser = new User({
            name: normalizedName,
            email: normalizedEmail,
            password
        });
        await newUser.save();

        req.session.isAdmin = false;
        req.session.userId = newUser._id;

        req.session.save((err) => {
            if (err) {
                console.error("Session Save Error:", err);
                return res.status(500).send("Session error");
            }
            res.redirect("/dashboard");
        });
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).send("Signup failed: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = (email || "").trim().toLowerCase();

        if (normalizedEmail === adminEmail.toLowerCase() && password === adminPassword) {
            req.session.isAdmin = true;
            return res.redirect("/dashboard");
        }

        console.log("LOGIN EMAIL:", normalizedEmail);
        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            return res.redirect("/login?error=signup");
        }
        if (user.password !== password) {
            return res.redirect("/login?error=wrongpassword");
        }

        req.session.isAdmin = false;
        req.session.userId = user._id;

        req.session.save((err) => {
            if (err) {
                console.error("Session Save Error:", err);
                return res.status(500).send("Session error");
            }
            console.log("LOGIN SUCCESS:", user._id);
            res.redirect("/dashboard");
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).send("Login failed: " + err.message);
    }
});

app.get("/dashboard", requireLogin, (req, res) => {
    res.render("dashboard", { user: req.user });
});

app.get("/profile", requireLogin, (req, res) => {
    res.render("profile", { user: req.user });
});
app.get("/edit", requireLogin, (req, res) => {
    res.render("edit", { user: req.user });
});
app.get("/skillmatch", requireLogin, (req, res) => {
    res.render("skillmatch", { user: req.user });
});
app.get("/learning", requireLogin, (req, res) => {
    res.render("learning", { user: req.user });
});
app.get("/internship", requireLogin, (req, res) => {
    res.render("internship", { user: req.user });
});
app.get("/placement", requireLogin, (req, res) => {
    res.render("placement", { user: req.user });
});
app.get("/portfolio", requireLogin, (req, res) => {
    res.render("portfolio", { user: req.user });
});
app.get("/setting", requireLogin, (req, res) => {
    res.render("setting", { user: req.user });
});
app.get("/help", requireLogin, (req, res) => {
    res.render("help", { user: req.user });
});
app.get("/test", requireLogin, (req, res) => {
    res.render("test", { user: req.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});