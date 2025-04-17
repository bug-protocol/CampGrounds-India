const Campground = require('../model/campground');
module.exports.view_page = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/camp_index.ejs',{campgrounds});
}
module.exports.new_camp = (req,res)=>{
    res.render('campground/new.ejs');
}
module.exports.createCampground = async(req,res)=>{
    console.log(req.body);
    const camp = new Campground(req.body.campground);
    console.log(req.user);
    camp.user = req.user._id;
    await camp.save();
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
    // It won't parse it inside until we use body-useNewUrlParser

}
module.exports.showCamps = async(req,res)=>{

    const campground = await Campground.findById(req.params.id).populate({
        path : 'review',
        populate :{
            path : 'user'
        }
    }).populate('user');
    console.log(campground);
    console.log(campground.user.username);
    res.render('campground/show.ejs',{campground});
}
module.exports.editCampgrounds = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','No camp exists!!');
        return res.redirect('/campgrounds');
    }
    res.render('campground/edit.ejs',{campground});
}
module.exports.updateCampgrounds = async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteCampgrounds = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!');
    // This will delete the campground and redirect to the campgrounds page
    res.redirect('/campgrounds');
}