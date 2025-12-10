const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
//signup
router.get("/signup", userController.renderSignupForm );

//signup adding in database
router.post("/signup",wrapAsync(userController.signup));

//login render
router.get("/login", userController.renderLoginForm );

function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");  // Redirect to login, not home
    }
}

router.post(
    "/login",
    saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login",failureFlash: true }),userController.loginFunction
);

router.get("/logout",userController.logoutFunction);


module.exports = router;


