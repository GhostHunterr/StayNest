const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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

//Root
app.get("/", (req, res) => {
    res.send("Root is working.");
});


//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//Index Route
app.get("/listings", async (req, res) => {
    try {
        const data = await Listing.find({});
        res.render("listings/index.ejs", { data });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});


//Show Route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

//Create Route
app.post("/listings", async (req, res) => {
    
    //sending data as a key-value pair.
    const newListing = new Listing(req.body.listing);
    try {
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        res.send(err);
    }
});


app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});