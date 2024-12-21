const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js")

const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);

main()
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch((err) => {
        console.log(`Error connecting: ${err}`);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(req.body); 
    if (error) {
        let errMssg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMssg);
    } else {
        next();
    }
};

//Root
app.get("/", (req, res) => {
    res.send("Root is working.");
});


//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
}));


//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    //sending data as a key-value pair.
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found."));
});

//Error MiddleWare
app.use((err, req, res, next) => {
    // let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.render("error.ejs", { err });
});


app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});