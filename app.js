const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

main()
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch((err) => {
        console.log(`Error connecting: ${err}`);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Root is working.");
});

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});