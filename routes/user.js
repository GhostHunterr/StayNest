const express = require('express');
const router = express.Router();
const passport = require("passport")
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/users");

router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));

router.get("/logout", userController.logout);

router
    .route("/")
    .get((req, res) => {
        res.redirect("/listings");
    });

module.exports = router;