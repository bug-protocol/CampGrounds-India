if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// console.log("SECRET:", process.env.SECRET);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./model/campground');
const Review = require('./model/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local'); 
const User = require('./model/user');
// Fixating routes
const userRoutes = require('./routes/user.js');
const campgrounds = require('./routes/campground.js');
const reviews = require('./routes/reviews.js');
// Connecting to the database
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/campgrounds';

const app = express();
const port = process.env.PORT || 4000;

const db = mongoose.connection;
db.on('error', (err) => {
    console.error("Error Connecting to the Database", err);
});

//Method Override
app.use(methodOverride('-method'));
// Express Sessions
const sessionConfig = {
    secret: process.env.SECRET || 'devsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

//Authentication related
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   
app.use(express.static(path.join(__dirname,'public')));

// For maptiler
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// This is the middleware for flash messages
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// Body Parser 
app.use(express.urlencoded({extended:true}));
// Route connections
app.use('/',userRoutes);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
// This is the static file connection
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));


// This is the home route
app.get('/home',(req,res)=>{
    res.render('home.ejs');
})

// This is the default route
app.get ('/',(req,res)=>{
    res.redirect('/home');
})

async function startServer() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Database Connected!!");
        app.listen(port,()=>{
            console.log(`Starting the Server on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start app because database connection failed.");
        console.error(err.message);
        process.exit(1);
    }
}

startServer();
