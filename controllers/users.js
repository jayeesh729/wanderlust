const User = require("../models/users.js");

module.exports.renderSignupForm = async(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
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
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginFunction = async (req, res) => {
    req.flash("success", "Welcome Back !!");
    res.redirect( res.locals.redirectUrl || "/listings");  // Redirect to listings, not send text
    // res.redirect("/listings");
};

module.exports.logoutFunction = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });        
    
}