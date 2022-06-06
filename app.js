require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const User = require("./models/User");
const port = process.env.PORT || 3000
const bcrypt = require("bcryptjs");
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require("./middlewares/auth");

const app = express();
const database = 'mongodb://mongo:q03wO6MjGzqHEsSgWfrh@containers-us-west-34.railway.app:7234'
mongoose.connect(database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
});
mongoose.connection.on('connected', () =>{
    console.log(`DB ${database} Connected!`)
});

const initializePassport = require("./passport-config.js");
initializePassport(
    passport,
    async(email) => {
        const userFound = await User.findOne({ email });
        return userFound;
    },
    async(id) =>{
        const userFound = await User.findOne({ _id: id });
        return userFound;
    }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: false,
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register");
})

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login");
})

app.get("/biodata", (req, res) => {
    res.render("biodata");
})

app.get("/home", (req, res) => {
    res.render("home", { name: req.user.name });
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
})
);

app.post('/register', checkNotAuthenticated, async (req, res) => {
    const userFound = await User.findOne({ email:req.body.email });

    if (userFound) {
        req.flash('error', 'Email sudah terdaftar!');
        res.redirect('/register');
    } else {
        try {
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            await user.save();
            res.redirect("/login");
        } catch (error) {
            console.log(error);
            res.redirect("/register");
        }
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

/* Mongo DB Atlas Account
 *
 * mongodb+srv://yoriko:akashi0987@cluster0.ekkf7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
 *
 */
