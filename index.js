const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./model/campground');
const Review = require('./model/review');
const session = require('express-session');
const flash = require('connect-flash');
// Fixating routes
const campgrounds = require('./routes/campground.js');
const reviews = require('./routes/reviews.js');
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

// Express Sessions
const sessionConfig = {
    secret:'tryingoutsession',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7, // 7 days
        maxAge: 1000*60*60*24*7
    } 
}
app.use(session(sessionConfig));
app.use(flash());

// This is the middleware for flash messages
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// Route connections
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
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
