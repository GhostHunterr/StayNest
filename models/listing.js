const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("./review.js")
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1714466330772-097c1f9c43cb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:
            (v) => v === "" ?
                "https://images.unsplash.com/photo-1714466330772-097c1f9c43cb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;