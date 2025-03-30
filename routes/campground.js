const express = require('express');
const router = express.Router();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('../model/campground');
// const Review = require('../model/review');
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
router.get('/new',(req,res)=>{
    res.render('campground/new.ejs');
})
// This will include the post request we're getting from new file
router.post('/campgrounds',async(req,res)=>{
    console.log(req.body);
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/${camp._id}`);
    // It won't parse it inside until we use body-useNewUrlParser

})
// We are gonna create a show route which will show the details of the campground
router.get('/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('review');;
    res.render('campground/show.ejs',{campground});
})
// Edit Route
router.get('/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit.ejs',{campground});
})
router.put('/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/${campground._id}`);
})
// Delete Route
router.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

module.exports = router;
