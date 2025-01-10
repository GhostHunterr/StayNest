const express = require('express');
const router = express.Router();
const passport = require("passport")
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/users");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLogInForm);

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;