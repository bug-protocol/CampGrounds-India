const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../model/campground');
const Review = require('../model/review');
const {isloggedIn,isUserAuthorised,isReviewAuthorised} = require('../middleware');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const reviews = require('../controllers/reviews.js');
router.use(methodOverride('-method'));
// Adding a post request for review form
router.post('/',isloggedIn, reviews.createReview);

// Delete reviews
router.delete('/:reviewId',isloggedIn,isReviewAuthorised,reviews.deleteReview);
module.exports = router;