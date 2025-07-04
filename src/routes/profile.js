const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEdit } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Show Profile " + user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
      throw new Error("User can not be updated");
    }
    const loggenInUser = req.user;

    Object.keys(req.body).forEach(
      (key) => (loggenInUser[key] = req.body[key])
    );

    // await loggenInUser.save();

    res.json({
      message: "User Profile Updated Successfully.",
      data: loggenInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
