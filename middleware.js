const Review = require('./model/review'); 
const Campground = require('./model/campground');
module.exports.isloggedIn = (req,res,next)=>{
    console.log("REQ.USER...",req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You should be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isUserAuthorised= async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'No camp exists!!');
        return res.redirect('/campgrounds');
    }
    if(!campground.user.equals(req.user._id)){
        req.flash('error', 'You are not authorised to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthorised= async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash('error', 'Review does not exist!');
        return res.redirect(`/campgrounds/${id}`);
    }
    if(!review.user.equals(req.user._id)){
        req.flash('error', 'You are not authorised to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
