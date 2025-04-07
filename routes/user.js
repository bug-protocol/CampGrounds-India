const express = require('express');
const router = express.Router();
const User = require('../model/user');

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
module.exports = router;