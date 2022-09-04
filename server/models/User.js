const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema

const userSchema = mongoose.Schema({
    full_name: { type: String },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 20, //Username must be less than 20 characters to prevent from Buffer Overflow
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100, //Email must be less than 100 characters to prevent from Buffer Overflow
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50, //Password must be less than 50 characters to prevent from Buffer Overflow
    },
});

// Hash password before saving to database

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 8);
    next();
});
module.exports = mongoose.model("user", userSchema);
