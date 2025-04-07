const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render('users/register.ejs');
})
router.post('/register',async(req,res)=>{
    try{
        const{username,email,password} = req.body;
    const user = new User ({email,username});
    const registeredUser = await User.register(user,password);
    // console.log(registeredUser);
    req.flash('Welcome to CampGrounds');
    res.redirect('/campgrounds');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
})
router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
})
router.post('/login', passport.authenticate('local',{failureFlash: true ,failureRedirect: '/login'}),(req,res)=>{
    req.flash('success',"Welcome Back!!");
    res.redirect('/campgrounds')
})
module.exports = router;