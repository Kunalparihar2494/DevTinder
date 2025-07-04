const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({
        message: "User not found to send request.",
      });
    }

    const allowedStatus = ["like", "pass"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Request can not be completed",
      });
    }

    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      throw new Error("Request already created");
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.send("Connection Request Send By - " + req.user.firstName);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Request can not be completed",
      });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "like",
    });

    if (!connectionRequest) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "Request " + status + " successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = requestRouter;
