//Packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

//MiddleWares and View Settings.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);

const sessionOptions = {
    secret: "SuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Connect DB
main()
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch((err) => {
        console.log(`Error connecting: ${err}`);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/demouser", wrapAsync(async (req, res) => {
    let fakeUser = new User({
        email: "farhan@gmail.com",
        username: "Farhan"
    });

    const registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
}));

//Listings
app.use("/listings", listingRouter);

//Reviews
app.use("/listings/:id/reviews", reviewRouter);

//User
app.use("/", userRouter);

//404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found."));
});

//Error MiddleWare
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong." } = err;
    res.status(statusCode).render("error.ejs", { err: { statusCode, message } });
});

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});