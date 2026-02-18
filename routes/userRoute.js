const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const asyncWrap = require('../utils/asyncWrap.js');
const passport = require("passport");



router.get('/signin',(req,res) => {
    res.render("signinForm.ejs");
});

router.post('/signin',asyncWrap(async(req,res,next) => {
    try{
    let {username,email,password} = req.body;
    let newUser = new User({username:username,email:email});
    let result = await User.register(newUser,password);
    console.log(result);
    }catch(err){
	console.log(err);
	req.flash("error",err.message);
	return res.redirect('/listings');
    }
    req.flash("success","Signed in successfully");
    res.redirect('/listings');

}));

router.get("/login",(req,res) => {
    res.render("loginForm.ejs");
});

router.post("/login",passport.authenticate('local',{
    keepSessionInfo:true,
    failureRedirect:"/login",
    failureFlash:true,
}),
    async(req,res) => {
	req.flash("success","Welcome to Airbnb!");
	res.redirect('/listings');
});



module.exports = router;
