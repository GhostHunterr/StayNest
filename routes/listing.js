const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const router = express.Router();

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMssg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMssg);
    } else {
        next();
    }
};

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
}));

//New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested Doesn't Exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
}));

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    //sending data as a key-value pair.
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested Doesn't Exist");
        res.redirect("/listings");
    } else {
        res.render("listings/edit.ejs", { listing });
    }
}));

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}));

module.exports = router;