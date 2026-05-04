const Campground = require('../model/campground');
const maptilerClient = require("@maptiler/client");
const { getAssetPath } = require('../utils/viteAssets');

function getMapTilerClient() {
  if (!process.env.MAPTILER_API_KEY) {
    throw new Error("MapTiler API key missing in backend");
  }
  maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
  return maptilerClient;
}

module.exports.view_page = async (req, res) => {
  const campgrounds = await Campground.find({
    geometry: {
      $exists: true,
      $ne: null
    }
  });
  res.render('campground/camp_index', {
    campgrounds,
    mapScript: getAssetPath('src/clusterMap.js', 'src/clusterMap.js')
  });
};

module.exports.new_camp = (req,res)=>{
    res.render('campground/new.ejs');
}
module.exports.createCampground = async (req, res) => {
//   console.log("REQ.USER...", req.user);

  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  const client = getMapTilerClient();

  const geoData = await client.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );

  if (!geoData.features || geoData.features.length === 0) {
    req.flash("error", "Invalid location");
    return res.redirect("/campgrounds/new");
  }

  const camp = new Campground(req.body.campground);
  camp.geometry = geoData.features[0].geometry;

  if (req.files && req.files.length > 0) {
    camp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
  } else {
    camp.image = [];
  }

  camp.user = req.user._id;

  await camp.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};


module.exports.showCamps = async(req,res)=>{

    const campground = await Campground.findById(req.params.id).populate({
        path : 'review',
        populate :{
            path : 'user'
        }
    }).populate('user');
    if(!campground){
        req.flash('error','No camp exists!!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    console.log(campground.user.username);
    res.render('campground/show.ejs',{
        campground,
        mapScript: getAssetPath('src/showPageMap.js', 'src/showPageMap.js')
    });
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
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error','No camp exists!!');
        return res.redirect('/campgrounds');
    }

    camp.set(req.body.campground);
    const client = getMapTilerClient();
    const geoData = await client.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features || geoData.features.length === 0) {
        req.flash("error", "Invalid location");
        return res.redirect(`/campgrounds/${id}/edit`);
    }
    camp.geometry = geoData.features[0].geometry;
    if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map(file => ({ url: file.path, filename: file.filename }));
        camp.image.push(...uploadedImages);
    }
    await camp.save();
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteCampgrounds = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!');
    // This will delete the campground and redirect to the campgrounds page
    res.redirect('/campgrounds');
}
