const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"./public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});


app.get("/",(req,res)=>{
    res.send("connected");
});

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// app.get("/test",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Vile ",
//         description: "By the beach",
//         price: 1200,
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("saved ");
//     res.send("successful testing");
// });

//HOME ROUTE
app.get("/listings", wrapAsync( async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//new route get /lisitings/new ->form ->submit
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", validateListing, wrapAsync( async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    const list = new Listing (req.body.listing); 
    await list.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// Reviews route
// Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    console.log("id found");

    listing.reviews.push(newReview);

    await newReview.save();   
    await listing.save(); 

    console.log("new review saved");
    //res.send("new review saved");
    res.redirect(`/listings/${id}`);
}));

//Review Route 
//Delete Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}));

//UPDATE ROUTE
app.put("/listings/:id",validateListing, wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE 
app.delete("/listings/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//show route
app.get("/listings/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
}));




//ALL routes should be above 
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

//middleware
app.use((err,req,res,next)=>{
    let { statusCode , message } = err;
    res.render("Errors.ejs",{err});
    //res.status(statusCode).send(message);

});
