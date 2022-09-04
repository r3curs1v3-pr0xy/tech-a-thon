require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const JWT_SECRET = process.env.JWT_SECRET;

// Protects against spam by rate limiting the API

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many request!" });

//Signup Route

router.post("/signup", limiter, async (req, res) => {
    var { full_name, username, email, password } = sanitize(req.body); // Sanitize the request body to prevent NoSQL injection
    try {
        //Validate user input

        if (full_name && username && email && password) {
            let user = await User.findOne({ username: username });

            //If user doesn't exist, create a new user

            if (user) {
                return res.status(400).json({ msg: "Username already exists" });
            }

            //Validate email

            if (!validator.isEmail(email)) {
                return res.status(400).json({ msg: "Invalid email" });
            }

            //Validate username

            if (!validator.isAlphanumeric(username)) {
                return res.status(400).json({ msg: "Invalid username" });
            }

            // Create a new user

            await new User(sanitize(req.body)).save((err) => {
                if (err) {
                    return res.status(400).json({ msg: "Something went wrong" });
                } else {
                    return res.status(200).json({ msg: "User created successfully" });
                }
            });
        } else {
            return res.status(400).json({ msg: "All fields are required" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
});

//Signin Route

router.post("/signin", limiter, async (req, res) => {
    var { username, password } = sanitize(req.body); // Sanitize the request body to prevent NoSQL injection
    try {
        //Validate user input

        if (username && password) {
            let user = await User.findOne({ username: username });

            //If user doesn't exist, return error

            if (!user) {
                return res.status(400).json({ msg: "Username or password is incorrect" });
            }

            //Verify if password is correct

            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ msg: "Username or password is incorrect" });
            }

            // Create a new token

            const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: "3600s" });

            // Return token

            return res.status(200).json({ token: token });
        } else {
            return res.status(400).json({ msg: "All fields are required" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
});

module.exports = router;
