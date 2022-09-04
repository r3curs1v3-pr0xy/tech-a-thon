require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const sanitize = require("mongo-sanitize");
const router = new express.Router();
const auth = require("../middleware/auth"); //midldleware to check authentication
const jwt = require("jsonwebtoken");
const Post = require("../models/Posts");
const crypto = require("crypto");
const User = require("../models/User");
const Likes = require("../models/Likes");
const { type } = require("os");

const JWT_SECRET = process.env.JWT_SECRET;

//Protects against spam by rate limiting the API

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many attempts!" });

//Decode JWT to get username
function decodeJWT(token) {
    const decoded_token = jwt.verify(token, JWT_SECRET);
    return decoded_token.username;
}

router.get("/user_details", auth, async (req, res) => {
    try {
        const username = decodeJWT(req.header("Authorization").split(" ")[1]);
        const user = await User.findOne({ username: username }).select({ password: 0, __v: 0, _id: 0 });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
});

//Get all posts

//No authentication required to view public posts

router.get("/blog", async (req, res) => {
    //Get list of all published posts. Personal/private posts are not shown

    try {
        const posts = await Post.find({ is_published: true }).select({ _id: 0, __v: 0 });

        res.status(200).send(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Something went wrong!" });
    }
});

//Show private posts to authorized users

router.get("/blog/private", auth, async (req, res) => {
    try {
        const username = decodeJWT(req.header("Authorization").split(" ")[1]);
        const posts = await Post.find({ is_published: false, username: username }).select({ _id: 0, __v: 0 });
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
});

//Show only my posts

router.get("/blog/my_posts", auth, async (req, res) => {
    try {
        const username = decodeJWT(req.header("Authorization").split(" ")[1]);
        const posts = await Post.find({ username: username }).select({ _id: 0, __v: 0 });
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
});

//----------------------- Logic to specific post content -----------------------------
// Get a specific post
// Send unique post id
// Look for the post in the database for same post id
// No authentication required to view public posts

router.get("/blog/:post_id/", async (req, res) => {
    let post_id = sanitize(req.params.post_id);

    if (post_id) {
        try {
            const username = decodeJWT(req.header("Authorization").split(" ")[1]);
            if (!username) {
                let post = await Post.findOne({ post_id: post_id, is_published: true }).select({ _id: 0, __v: 0 });
                if (post) {
                    res.status(200).send(post);
                } else {
                    res.status(404).send({ msg: "Post not found!" });
                }
            } else {
                let post = await Post.findOne({ username: username, post_id: post_id }).select({ _id: 0, __v: 0 });
                if (post) {
                    res.status(200).send(post);
                } else {
                    res.status(404).send({ msg: "Post not found!" });
                }
            }
        } catch (err) {
            return res.status(500).send({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).send({ msg: "Please provide a post url" });
    }
});

// Create Post
router.post("/blog", auth, async (req, res) => {
    let { title, content, keywords, category, cover_img, is_published } = sanitize(req.body); // Sanitize the data to prevent injection attacks

    if (title && content && keywords && category && cover_img) {
        // Create a new post

        try {
            let url = title.replace(/\s+/g, "-"); // Replace spaces with hyphens to form slug
            let post_id = crypto.randomBytes(8).toString("hex"); // Assign Unique post id to each post
            url = "/blog/" + post_id.toString() + "/" + url;
            let time_to_read = Math.round(content.split(" ").length / 200); // Calculate time to read the post

            let user_data = await User.findOne({ username: decodeJWT(req.header("Authorization").split(" ")[1]) }); // Get user details from the database

            //Save post to post collection
            await new Post({
                title: title,
                url: url,
                content: content,
                post_id: post_id,
                keywords: keywords,
                category: category,
                full_name: user_data.full_name,
                username: user_data.username,
                is_published: is_published,
                cover_img: cover_img,
                time_to_read: time_to_read,
                published_date: Date.now(),
            }).save((err) => {
                if (err) {
                    return res.status(400).json({ msg: "Something went wrong" });
                } else {
                    return res.status(200).json({ msg: "Post created successfully" });
                }
            });
        } catch (err) {
            return res.status(400).json({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).json({ msg: "Please provide a title, content, category, is_published and keywords!" });
    }
});

// Update Post

router.patch("/blog/:post_id", auth, async (req, res) => {
    let post_id = sanitize(req.params.post_id);
    let { title, content, keywords, category, is_published, cover_img } = sanitize(req.body);

    if (post_id && title && content && keywords && category) {
        try {
            let url = title.replace(/\s+/g, "-");
            url = "/blog/" + post_id.toString() + "/" + url;
            let time_to_read = Math.round(content.split(" ").length / 200);
            await Post.findOneAndUpdate(
                { post_id: post_id },
                {
                    title: title,
                    url: url,
                    content: content,
                    keywords: keywords,
                    category: category,
                    cover_img: cover_img,
                    is_published: is_published,
                    time_to_read: time_to_read,
                    published_date: Date.now(),
                }
            );
            return res.status(200).json({ msg: "Post updated successfully" });
        } catch (err) {
            return res.status(400).json({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).json({ msg: "Please provide a title, content, category and keywords!" });
    }
});

// ----------------------- Logic to delete post -----------------------------
//Check user authentication
// Validate authentication user is actual owner of the post
// Delete post from database identified by post id

router.delete("/blog/:post_id", auth, async (req, res) => {
    let post_id = sanitize(req.params.post_id); // Sanitize the data to prevent injection attacks

    if (post_id) {
        try {
            //Verify if the authenticated user is the owner of the post

            let actual_owner_of_post = await Post.findOne({ username: decodeJWT(req.header("Authorization").split(" ")[1]), post_id: post_id });

            if (actual_owner_of_post) {
                //Deelte post from post collection
                await Post.deleteOne({ post_id: post_id }); // Delete post from post collection
                await Likes.deleteOne({ post_id: post_id }); // Delete post from likes collection
                res.status(200).json({ msg: "Post deleted successfully" });
            } else {
                return res.json({ msg: "You are not the owner of this post!" });
            }
        } catch (err) {
            return res.status(400).json({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).json({ msg: "Please provide a post id!" });
    }
});

// ------------------ Logic to Search the posts ------------------

// Search post as per keywords in the post title and keywords
// Display the result in descending order of number of likes
// No authentication required to search in public posts

router.get("/search", async (req, res) => {
    let search_query = sanitize(req.query.query); // Sanitize the data to prevent injection attacks

    if (search_query) {
        try {
            // Used regex to search for the query in the title and keywords

            let posts = await Post.find({ $or: [{ title: RegExp(search_query, "i") }, { keywords: RegExp(search_query, "i") }], is_published: true }).select({ _id: 0, __v: 0 });
            if (posts.length > 0) {
                res.status(200).send(posts);
            } else {
                return res.status(200).json({ msg: "No result found for " + search_query });
            }
        } catch (err) {
            return res.status(500).json({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).json({ msg: "Please provide a search query!" });
    }
});

//--------------------- Logic to Like Post ---------------------
// Like posts
// - Check if same user liked the same post earlier or not
// - If liked earlier then dislike the post else like the post
// - Update the number of likes in the post collection

router.post("/blog/:post_id/like", auth, async (req, res) => {
    let post_id = sanitize(req.params.post_id); // Sanitize the data to prevent injection attacks

    if (post_id) {
        try {
            //Check if the user has already liked the post
            let user_liked_post = await Likes.findOne({ post_id: post_id, username: decodeJWT(req.header("Authorization").split(" ")[1]) });
            if (user_liked_post) {
                //If post is already liked by the user, unlike the post

                await Likes.findOneAndDelete({ post_id: post_id, username: decodeJWT(req.header("Authorization").split(" ")[1]) });

                //Count number of likes for each post

                var aggregate_likes_count = await Likes.aggregate([
                    {
                        $group: { _id: "$post_id", like_count: { $sum: 1 } },
                    },
                ]);
                var like_count;
                aggregate_likes_count.forEach((i) => {
                    if (i._id === post_id) {
                        like_count = i.like_count;
                    }
                });

                await Post.findOneAndUpdate({ post_id: post_id }, { like_count: like_count });
                return res.status(200).json({ msg: "Post has beed disliked!" });
            } else {
                //Update likes in like collection
                await Likes.create({
                    post_id: post_id,
                    username: decodeJWT(req.header("Authorization").split(" ")[1]),
                });

                //Count number of likes for each post

                var aggregate_likes_count = await Likes.aggregate([
                    {
                        $group: { _id: "$post_id", like_count: { $sum: 1 } },
                    },
                ]);
                var like_count;
                aggregate_likes_count.forEach((i) => {
                    if (i._id === post_id) {
                        like_count = i.like_count;
                    }
                });

                await Post.findOneAndUpdate({ post_id: post_id }, { like_count: like_count });
                return res.status(200).json({ msg: "Post liked successfully!" });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({ msg: "Something went wrong!" });
        }
    } else {
        return res.status(400).json({ msg: "Please provide a post id!" });
    }
});
module.exports = router;
