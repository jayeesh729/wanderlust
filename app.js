const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

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

//HOME ROUTE
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});


//new route get /lisitings/new ->form ->submit
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    const list = new Listing (req.body.listing); 
    await list.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//UPDATE ROUTE
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//DELETE 
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
});