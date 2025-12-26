const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage })

const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const listingController= require("../controllers/listings.js");

// Show all listing ; after creating , add the lsiting
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.addListing))

// Create new listing
router.get("/new",isLoggedIn, listingController.newListingForm);

// Show particular listing ; update listing ; delete listing
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

// Edit listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListingForm));




module.exports=router;