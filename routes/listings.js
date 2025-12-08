const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//HOME ROUTE
router.get("/", wrapAsync( async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//new route get /lisitings/new ->form ->submit
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
router.post("/", validateListing, wrapAsync( async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    const list = new Listing (req.body.listing); 
    await list.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id",validateListing, wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited !")
    res.redirect(`/listings/${id}`);
}));

//DELETE 
router.delete("/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","New Listing Deleted !")
    res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

module.exports = router;