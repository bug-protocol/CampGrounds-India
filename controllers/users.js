module.exports.registerForm = (req,res)=>{
    res.render('users/register.ejs');
}
module.exports.register = async(req,res)=>{
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
}
module.exports.renderLogin = (req,res)=>{
    res.render('users/login.ejs');
}
module.exports.login = (req,res)=>{
    req.flash('success',"Welcome Back!!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.renderLogout = (req,res)=>{
    req.logout();
    req.flash('success',"See you later!")
    res.redirect('/campgrounds');
}
module.exports.logout = (req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      req.flash('success', "See you later!");
      res.redirect('/campgrounds');
    });
  }