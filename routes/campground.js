const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const Campground = require('../model/campground');
const campgrounds = require('../controllers/campgrounds');
const {isloggedIn,isUserAuthorised} = require('../middleware');
// The multer use
const multer = require('multer');
const upload = multer({dest : 'uploads/'})
// const campground = require('../model/campground');
router.use(express.urlencoded({extended:true}));
router.use(methodOverride('-method'));
router.get('/makecampground',async(req,res)=>{
    const camp = new Campground({title:'My College',price:'100 Rupees', description: 'It is my dorm room, where I live!', location: 'Sector-F, Jankipuram, Lucknow, 226021'});
    await camp.save();
    res.send(camp);
})
router.get('/',campgrounds.view_page);
// This time we'll be creating a form to add a new campground and it should be 
// post request
// This will include the post request we're getting from new file
// router.post('/',isloggedIn,campgrounds.createCampground);
router.post('/',upload.array('image'),(req,res)=>{
    console.log(req.body,req.files); // file for upload.single and files for upload.array
    res.send('Check it!!')
})
router.get('/new',isloggedIn,campgrounds.new_camp);
// We are gonna create a show route which will show the details of the campground
router.get('/:id',isloggedIn, campgrounds.showCamps);
// Edit Router
router.get('/:id/edit',isloggedIn,isUserAuthorised,campgrounds.editCampgrounds);
router.put('/:id',isloggedIn,isUserAuthorised,campgrounds.updateCampgrounds);
// Delete Route
router.delete('/:id',isloggedIn,isUserAuthorised,campgrounds.deleteCampgrounds);
module.exports = router;