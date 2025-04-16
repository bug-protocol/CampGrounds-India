const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const Campground = require('../model/campground');
const {isloggedIn} = require('../middleware');
router.use(express.urlencoded({extended:true}));
router.use(methodOverride('-method'));
router.get('/makecampground',async(req,res)=>{
    const camp = new Campground({title:'My College',price:'100 Rupees', description: 'It is my dorm room, where I live!', location: 'Sector-F, Jankipuram, Lucknow, 226021'});
    await camp.save();
    res.send(camp);
})
router.get('/',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/camp_index.ejs',{campgrounds});
})
// This time we'll be creating a form to add a new campground and it should be 
// post request
router.get('/new',isloggedIn,(req,res)=>{
    res.render('campground/new.ejs');
})
// This will include the post request we're getting from new file
router.post('/',async(req,res)=>{
    console.log(req.body);
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
    // It won't parse it inside until we use body-useNewUrlParser

})
// We are gonna create a show route which will show the details of the campground
router.get('/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('review').populate('user');
    console.log(campground);
    res.render('campground/show.ejs',{campground});
})
// Edit Router
router.get('/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit.ejs',{campground});
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})
// Delete Route
router.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!');
    // This will delete the campground and redirect to the campgrounds page
    res.redirect('/campgrounds');
})
module.exports = router;