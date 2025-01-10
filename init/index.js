const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

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
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "67807afb07ecdd93a5fbe8a0" }));
        await Listing.insertMany(initData.data);
        console.log("Data Initialized Successfully.");
        mongoose.disconnect();
    } catch (err) {
        console.log(`Error Initializing Data: ${err}`);
    }
}

initDB();
