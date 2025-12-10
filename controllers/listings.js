const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.ShowListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.CreateListing = async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    const list = new Listing (req.body.listing); 
    list.owner = req.user._id; 
    await list.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited !")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","New Listing Deleted !")
    res.redirect("/listings");
}