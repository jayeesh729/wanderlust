const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const listingController = require("../controllers/listings.js");


//HOME ROUTE or Index Route
router.get("/", wrapAsync(listingController.index));


//new route get /lisitings/new ->form ->submit
router.get("/new",isLoggedIn, listingController.renderNewForm );

//Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.CreateListing ));

//Edit Route
router.get("/:id/edit" ,isLoggedIn , wrapAsync(listingController.renderEditForm ));

//UPDATE ROUTE
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing ));

//DELETE 
router.delete("/:id",isLoggedIn , isOwner, wrapAsync( listingController.destroyListings ));

//show route
router.get("/:id", wrapAsync( listingController.ShowListing));

module.exports = router;