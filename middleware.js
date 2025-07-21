const Review = require('./model/review'); 
const Campground = require('./model/campground');
module.exports.isloggedIn = (req,res,next)=>{
    console.log("REQ.USER...",req.user);
    if(!req.isAuthenticated()){
        req.flash('error', 'You should be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isUserAuthorised= async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.user.equals(req.user._id)){
        req.flash('error', 'You are not authorised to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthorised= async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.user.equals(req.user._id)){
        req.flash('error', 'You are not authorised to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}