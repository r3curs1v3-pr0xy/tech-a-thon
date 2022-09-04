const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        token = token.split(" ")[1];
        jwt.verify(token, JWT_SECRET, (err) => {
            if (err) {
                res.status(401).json({ msg: "Your authentication token is invalid!" });
            } else {
                next();
            }
        });
    } catch {
        res.status(401).json({
            msg: "Invalid Request!",
        });
    }
};
