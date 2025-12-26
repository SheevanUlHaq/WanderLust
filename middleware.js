const Listing=require("./models/listings");
const Review=require("./models/review");
const {listingSchema , reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

// Vadidating listing schema in server site
module.exports.validateListing= (req,res,next)=>{
  const {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,errMsg);
  }
  else{
    next();
  }
}

// Vadidating review schema in server site
module.exports.validateReview= (req,res,next)=>{
  const {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,errMsg);
  }
  else{
    next();
  }
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      // GET requests → safe to redirect back
      if (req.method === "GET") {
        req.session.redirectUrl = req.originalUrl;
      }
      // POST / PUT / DELETE → redirect to previous page
      else {
        req.session.redirectUrl = req.headers.referer || "/listings";
      }
      req.flash("error","You must be logged in !");
      return res.redirect("/login");
    }
    
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    const list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}