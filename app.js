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

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");


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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

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
