const mongoose = require("mongoose");

const connectDB = mongoose.connect(
  "mongodb+srv://kunalparihar51kp:pihDdZwHAHB9are1@namastenode.bgdtix5.mongodb.net/devTinder"
);

module.exports = connectDB;


