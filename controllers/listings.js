const Listing=require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
  const allListing = await Listing.find();
  res.render("listings/index.ejs", { allListing });
}

module.exports.newListingForm=(req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path: "author",
      } })
    .populate("owner");
  if(!list){
    req.flash("error", "Listing does not exist !");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
}

module.exports.addListing= async (req, res) => {
  let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send()
  // req.body.listing will give an object of listing
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}

module.exports.editListingForm=async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if(!list){
    req.flash("error", "Listing does not exist !");
    return res.redirect("/listings");
  }
  let originalImageUrl= list.image.url;
  originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { list , originalImageUrl });
}

module.exports.updateListing=async (req, res) => {
  const { id } = req.params;
  const list = req.body.listing;
  let updatedListing= await Listing.findByIdAndUpdate(id, list);
  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
}