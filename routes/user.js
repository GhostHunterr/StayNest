const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayNest!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    req.session.redirectUrl = "";
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "Welcome Back to StayNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out.");
        res.redirect("/listings");
    });
});

module.exports = router;