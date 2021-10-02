// NPM Packages
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");
require('dotenv').config()

// User defined modules
const connectDB = require("./db/connection");

const app = express();
const PORT = process.env.PORT || 5000;

// Mongo DB connection
connectDB();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Defining Routes 
app.use("/api/users", require("./routes/apis/user"));
// app.use("/api", require())
app.use("/api/emails", require("./routes/apis/Emails"));
// app.use('/api/user/account-activation')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
