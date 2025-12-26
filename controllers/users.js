const User=require("../models/user");

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try {
        const{username, email, password}=req.body;
        const newUser=new User({username, email});
        await User.register(newUser,password);
        req.login(newUser, (err)=>{
            if(err){
                return nex(err);
            }
            req.flash("success", "Welcome to WanderLust !");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error" ,error.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success", "Welcome back to WanderLust");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings");
    });
}