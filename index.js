const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./model/campground');
const Review = require('./model/review');

// Fixating routes
const campgrounds = require('./routes/campground.js');
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
// Route connections
app.use('/campgrounds',campgrounds);
// This is the static file connection
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

// Adding a post request for review form
app.post('/campgrounds/:id/reviews',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review_drop = new Review(req.body.review);
    campground.review.push(review_drop);
    await review_drop.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// Delete reviews
app.delete('/campgrounds/:id/reviews/:reviewId',async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Campground.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
})