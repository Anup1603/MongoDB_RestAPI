const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB = process.env.MONGODB_URI;

const mongoDB = () => {
    mongoose.connect(MONGODB).then(() => {
        console.log("MONGO_DB is connected");
    }).catch((err) => {
        console.log(`DB not connected ${err.message}`);
    })
}

module.exports = mongoDB;