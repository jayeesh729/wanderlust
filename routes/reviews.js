const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams : true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Review Route create  
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor ,wrapAsync( reviewController.destroyReview ));

module.exports = router;