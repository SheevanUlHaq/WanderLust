const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users");

//for signup
router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup))

//for login
router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl,passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}),wrapAsync(userController.login))

//for logout
router.get("/logout",userController.logout);

module.exports=router;