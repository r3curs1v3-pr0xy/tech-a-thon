const mongoose = require("mongoose");

const likes = mongoose.Schema({
    username: { type: String },
    post_id: String,
});

module.exports = mongoose.model("likes", likes);
