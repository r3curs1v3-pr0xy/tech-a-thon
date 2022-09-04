require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const index = require("./routes/index");
const auth = require("./routes/auth");

const app = express();

db();

//cors

app.use(cors());
app.use(express.json());
app.disable("x-powered-by"); // Hide the fact that we are using express for security reasons

const port = process.env.PORT || 3000;

app.use("/api/v1/", index);
app.use("/api/v1/", auth);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
