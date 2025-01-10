const Listing = require("../models/listing");

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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
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
        res.render("listings/edit.ejs", { listing });
    }
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};