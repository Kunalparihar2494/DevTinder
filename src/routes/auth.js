const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    //creating new instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added ");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User Invalid");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send(user);
      } else {
        throw new Error("Paswword is not Valid");
      }
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("User logged out");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.patch("/changepassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      await user.save();
      res.send("Password Changed Successfully");
    } else {
      throw new Error("Paswword is not Valid");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = authRouter;
