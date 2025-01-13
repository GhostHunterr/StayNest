const Listing = require("../models/listing");
const opencage = require('opencage-api-client');

module.exports.index = async (req, res) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested Doesn't Exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.createListings = async (req, res, next) => {
    //sending data as a key-value pair.
    const { path: url, filename } = req.file;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = { url, filename };

    //Saving the coordinates
    let ans = await opencage
        .geocode({ q: `${newListing.location}, ${newListing.country}` });
    let { lat, lng } = ans.results[0].geometry;
    newListing.geometry = {
        type: "Point",
        coordinates: [lng, lat]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested Doesn't Exist");
        res.redirect("/listings");
    } else {
        let originalImgUrl = listing.image.url;
        originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_300,w_300");
        res.render("listings/edit.ejs", { listing, originalImgUrl });
    }
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};