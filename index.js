const express = require('express');
const app = express();
app.listen('4000',()=>{
    console.log("Starting the Server");
})
app.get ('/',(req,res)=>{
    res.send("This is the Default output!!");
})