const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

//MiddleWares and View Settings.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);


//Connect DB
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

//Listings
app.use("/listings", listings);

//Reviews
app.use("/listings/:id/reviews", reviews);

//404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found."));
});  

//Error MiddleWare
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong." } = err;
    res.status(statusCode).render("error.ejs", { err: { statusCode, message } });
});

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});