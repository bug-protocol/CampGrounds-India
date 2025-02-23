const mongoose = require('mongoose');
const Campground = require('../model/campground');
mongoose.connect('mongodb://localhost:27017/Grounds-Database');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error Connecting to the Database"));
db.once('open',()=>{
    console.log("Database Connected!!");
});
const seedDB = async()=>{
    await Campground.deleteMany({});
    const camp = new Campground({title:'My College',price:'100 Rupees', description: 'It is my dorm room, where I live!', location: 'Sector-F, Jankipuram, Lucknow, 226021'});
    await camp.save();
}
seedDB(); // This is the seed file for the database