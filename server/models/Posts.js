const mongoose = require("mongoose");

const postData = mongoose.Schema({
    title: String,
    url: String,
    content: String,
    post_id: String,
    is_published: Boolean, //This is for the admin to publish/private the post
    keywords: [], //Helps in Search based upon keywords and title
    username: String,
    category: String,
    full_name: String,
    cover_img: String,
    like_count: { type: Number, default: 0 },
    time_to_read: Number,
    published_date: Date,
});

module.exports = mongoose.model("posts", postData);
