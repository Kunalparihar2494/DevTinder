const express = require("express");
const { userAuth } = require("../middlewares/auth");


const requestRouter = express.Router();


requestRouter.get("/sendconnection", userAuth, async (req, res) => {
  try {
    res.send("Connection Request Send By - " + req.user.firstName);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = requestRouter