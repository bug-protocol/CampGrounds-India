const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const users = require('../controllers/users.js');

router.get('/register',users.registerForm);

router.post('/register',users.register);

router.get('/login',users.renderLogin);

router.post('/login', passport.authenticate('local',{failureFlash: true ,failureRedirect: '/login'}),users.login);

router.get('/logout',users.renderLogout);

router.post('/logout', users.logout);
  
module.exports = router;