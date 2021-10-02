const mongoose = require("mongoose");
const config = require("config");
const DB = config.get("dbConnection");

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex:true
    });
    console.log("MongoDB connected...!");
  } catch (error) {
    console.log("MongoDB connection error");
  }
};

module.exports = connectDB;
