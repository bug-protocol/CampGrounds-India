const express = require('express');
const app = express();
const path = require('path');

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
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