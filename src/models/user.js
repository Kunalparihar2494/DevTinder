const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const PROFILE_IMG = require("../utils/images");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLenght: 30,
      min: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["Male", "Female", "Others"].includes(val)) {
          throw new Error("Gender is Not Valid");
        }
      },
    },
    photoURL: {
      type: String,
      default: PROFILE_IMG,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid url " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default about User !!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });

  return token;
};

module.exports = mongoose.model("User", userSchema);
