module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review_drop = new Review(req.body.review);
    review_drop.user = req.user._id;
    campground.review.push(review_drop);
    await review_drop.save();
    await campground.save();
    req.flash('success','Successfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteReview = async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Campground.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}