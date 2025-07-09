const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoURL skills about";

userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate(
      "fromUserId",
      "firstName lastName age gender photoURL skills about"
    );
    res.json({
      message: "Request fetch successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((data) => {
      if (data.fromUserId.toString() === loggedInUser._id.toString()) {
        return data.toUserId;
      }
      return data.fromUserId;
    });

    // const data = connectionRequest.map((data) => {
    //   return data.toUserId;
    // });

    res.json({
      message: "All Request fetch successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit <= 50 ? limit : 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserId = new Set();
    connectionRequest.map((req) => {
      hideUserId.add(req.fromUserId.toString());
      hideUserId.add(req.toUserId.toString());
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUserId) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Feed data fetched.",
      data: users,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
