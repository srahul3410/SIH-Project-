const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require("./models/user.js")
const path = require('path');
const session = require("express-session");

app.use(session({
    secret: "vidyasetu-secret",
    resave: false,
    saveUninitialized: false
}));

const mongo_url = 'mongodb://127.0.0.1:27017/VidyaSetu'

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

app.get("/", (req, res) => {
    res.render("home.ejs")
})

app.get("/login", (req, res) => {
    res.render("login", {
        error: req.query.error
    });
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;

    console.log(req.body);

    const newUser = new User({
        name,
        email,
        password
    });

    await newUser.save();

    req.session.userId = newUser._id;

    res.redirect("/dashboard");
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.redirect("/login?error=signup");
    }

    if (user.password !== password) {
        return res.redirect("/login?error=wrongpassword");
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
    const user = await User.findById(req.session.userId);

    res.render("dashboard", { user });
});

app.listen(8080, (req, res) => {
    console.log("server is running !!")
})

