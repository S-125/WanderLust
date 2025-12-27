const express= require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn,isOwner,validateListing}= require('../middleware.js');
const multer = require('multer');

const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });
const listingController= require("../controllers/listings.js");
const Listing=require("../models/listings.js")

router.route("/search")
.get(wrapAsync(async(req,res)=>{
    const{location}=req.query;
    let allListings;
    if(location && location.trim()!==""){
        allListings = await Listing.find({
          location: { $regex: location, $options: "i" },
        });
    }else {
        allListings = await Listing.find({});
      }

      res.render("listings/index.ejs", { allListings });
}))

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createListing));


//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, 
    isOwner,
     upload.single('listing[image]'),
     validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync( listingController.destroyListing));








module.exports=router;