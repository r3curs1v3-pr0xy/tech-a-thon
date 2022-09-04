require("dotenv").config();
const mongoose = require("mongoose");

const connection = process.env.MongoDB_URI;

const connectDB = async () => {
    await mongoose
        .connect(connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log(err));
};

module.exports = connectDB;
