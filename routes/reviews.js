const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../model/campground');
const Review = require('../model/review');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
router.use(methodOverride('-method'));
// Adding a post request for review form
router.post('/',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review_drop = new Review(req.body.review);
    campground.review.push(review_drop);
    await review_drop.save();
    await campground.save();
    req.flash('success','Successfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
})

// Delete reviews
router.delete('/:reviewId',async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Campground.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
})
module.exports = router;