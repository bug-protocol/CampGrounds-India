const mongoose = require('mongoose');
const lko = require('./campground_location_lucknow')
const Campground = require('../model/campground');
mongoose.connect('mongodb://localhost:27017/Grounds-Database');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error Connecting to the Database"));
db.once('open',()=>{
    console.log("Database Connected!!");
});
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let sel of lko){
        const camp = new Campground({
            user : '67f408ec4297911a5ca62e63',
            title: `${sel.name}`,
            image: sel.image,
            price : `${sel.price}`,
            description : `${sel.description}`,
            location : `${sel.location}`
        }); 
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
}) // This is the seed file for the database