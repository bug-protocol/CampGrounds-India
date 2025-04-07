module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You should be logged in first!');
        return res.redirect('/login');
    }
    next();
}