const mongoose = require("mongoose");
const opencage = require('opencage-api-client');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";
const MONGO_URL = process.env.ATLASDB_URL;

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

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        //assigning owner.
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "6785831b37cf476625092981" }));
        //Storing Coordinates.
        for (listing of initData.data) {
            let ans = await opencage
                .geocode({ q: `${listing.location}, ${listing.country}` });
            let { lat, lng } = ans.results[0].geometry;
            listing.geometry = {
                type: "Point",
                coordinates: [lng, lat]
            };
        }
        await Listing.insertMany(initData.data);
        console.log("Data Initialized Successfully.");
        mongoose.disconnect();
    } catch (err) {
        console.log(`Error Initializing Data: ${err}`);
    }
}

initDB();
