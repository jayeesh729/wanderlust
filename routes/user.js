const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", async(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const existingUser = await User.findOne({ username });
        if(existingUser){
            req.flash("error", "Username already exists");
            return res.redirect("/signup");
        }
        const newUser = new User({username, email, password});
        await newUser.save();
        req.login(newUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome !!");
            res.redirect("/listings");
        });
        
    }
    catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

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
    saveRedirectUrl,
    passport.authenticate("local", { 
        failureRedirect: "/login",
        failureFlash: true 
    }),
    async (req, res) => {
        req.flash("success", "Welcome Back !!");
        res.redirect( res.locals.redirectUrl || "/listings");  // Redirect to listings, not send text
        // res.redirect("/listings");
    }
);

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });        
    
});


module.exports = router;


