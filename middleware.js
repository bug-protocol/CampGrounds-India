module.exports.isloggedIn = (req,res,next)=>{
    console.log("REQ.USER...",req.user);
    if(!req.isAuthenticated()){
        req.flash('error', 'You should be logged in first!');
        return res.redirect('/login');
    }
    next();
}