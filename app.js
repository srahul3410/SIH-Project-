const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user.js")
const path = require('path');
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const adminEmail = process.env.ADMIN_EMAIL || "admin@vidyasetu.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
const mongo_url = 'mongodb://127.0.0.1:27017/VidyaSetu';

app.use(session({
    secret: "vidyasetu-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongo_url,
        collectionName: "sessions",
        ttl: 60 * 60 * 24 * 30
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    }
}));

main()
    .then(() => {
        console.log("DB connected !!")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));      //now it will extract data from url
app.use(express.static(path.join(__dirname, "public")));   //ab public ke file automatic Acess
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});


app.get("/", (req, res) => {
    res.render("home.ejs")
})
app.get("/learn-More", (req, res)=>{
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


// app.post("/signup", async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log(req.body);
//     const newUser = new User({
//         name,
//         email,
//         password
//     });
//     await newUser.save();
//     req.session.userId = newUser._id;
//     res.redirect("/dashboard");
// });

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

        await new Promise((resolve, reject) => {
            req.session.save((err) => err ? reject(err) : resolve());
        });

        res.redirect("/dashboard");
    } catch (err) {
        console.log("SIGNUP ERROR:", err);
        res.status(500).send("Signup failed");
    }
});


// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.redirect("/login?error=signup");
//     }
//     if (user.password !== password) {
//         return res.redirect("/login?error=wrongpassword");
//     }
//     req.session.userId = user._id;
//     res.redirect("/dashboard");
// });

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail === adminEmail.toLowerCase() && password === adminPassword) {
            req.session.isAdmin = true;
            return res.redirect("/dashboard");
        }

        console.log("LOGIN EMAIL:", normalizedEmail);
        const user = await User.findOne({ email: normalizedEmail });
        console.log("FOUND USER:", user);
        if (!user) {
            return res.redirect("/login?error=signup");
        }
        if (user.password !== password) {
            return res.redirect("/login?error=wrongpassword");
        }
        req.session.isAdmin = false;
        req.session.userId = user._id;
        console.log("LOGIN SUCCESS:", user._id);
        res.redirect("/dashboard");
    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).send("Login failed");
    }
});

app.get("/dashboard", async (req, res) => {
    if (req.session.isAdmin) {
        return res.render("dashboard", {
            user: { name: "Admin", email: adminEmail }
        });
    }

    if (!req.session.userId) {
        return res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
        req.session.destroy();
        return res.redirect("/login");
    }
    res.render("dashboard", { user });
});

app.get("/profile", (req, res)=>{
    res.render("profile");
});
app.get("/edit", (req, res)=>{
    res.render("edit");
});
app.get("/skillmatch", (req, res)=>{
    res.render("skillmatch");
});
app.get("/learning", (req, res)=>{
    res.render("learning");
});
app.get("/internship", (req, res)=>{
    res.render("internship");
});
app.get("/placement", (req, res)=>{
    res.render("placement");
});
app.get("/portfolio", (req, res)=>{
    res.render("portfolio");
});
app.get("/setting", (req, res)=>{
    res.render("setting");
});
app.get("/help", (req, res)=>{
    res.render("help");
});
app.get("/test", (req, res)=>{
    res.render("test");
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});



app.listen(8080, (req, res) => {
    console.log("server is running !!")
})

