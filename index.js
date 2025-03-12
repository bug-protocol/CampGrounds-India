const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./model/campground');
// Connecting to the database
mongoose.connect('mongodb://localhost:27017/Grounds-Database');

// Not inserting few conditions like useNewUrlParser, useUnifiedTopology,
// useCreateIndex, useFindAndModify
// This is the default connection
const db = mongoose.connection;
// It retrieves the default connection object created by Mongoose.
// This allows you to listen for database-related events (like connection errors, successful connections, or disconnections).

db.on('error', console.error.bind(console,"Error Connecting to the Database"));
// This notifies if any error occurs while connecting to the database
db.once('open',()=>{
    console.log("Database Connected!!"); // It checks if connection is successful.
})
const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
// Body Parser 
app.use(express.urlencoded({extended:true}));
//Method Override
app.use(methodOverride('-method'));
// Constructing the server port
app.listen('4000',()=>{
    console.log("Starting the Server");
})
// This is the default route
app.get ('/',(req,res)=>{
    res.send("This is the Default output!!");
    // res.render('home');
})

// This is the home route
app.get('/home',(req,res)=>{
    res.render('home');
})
app.get('/makecampground',async(req,res)=>{
    const camp = new Campground({title:'My College',price:'100 Rupees', description: 'It is my dorm room, where I live!', location: 'Sector-F, Jankipuram, Lucknow, 226021'});
    await camp.save();
    res.send(camp);
})
app.get('/campgrounds',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/camp_index.ejs',{campgrounds});
})
// This time we'll be creating a form to add a new campground and it should be 
// post request
app.get('/campgrounds/new',(req,res)=>{
    res.render('campground/new.ejs');
})
// This will include the post request we're getting from new file
app.post('/campgrounds',async(req,res)=>{
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
    // It won't parse it inside until we use body-useNewUrlParser

})
// We are gonna create a show route which will show the details of the campground
app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show.ejs',{campground});
})
// Edit Route
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit.ejs',{campground});
})
app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

// Delete Route
app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})