const { coordinates } = require('@maptiler/client');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Used for creating Schema for campground
const CampgroundSchema = new Schema({
    title: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: String,
    description: String,
    location: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// PopUp MarkUp Cluster Map 
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href = "/campgrounds/${this._id}">${this.title}</a>`
});
// This is the data for the map we are going to add for the Campground
module.exports = mongoose.model('Campground',CampgroundSchema);
// This is the model for the Campground
// Keeping it capital is a convention, where we keep the first letter of the model as capital
// while checking in database using mongosh..we use db.campgrounds.find() to find the data in the database
// db.campgrounds.find() is used to find the data in the database.