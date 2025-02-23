const userModel = require("../models/userModel");
const asyncHandle = require("express-async-handler");

require("dotenv").config();

const getCurrent = asyncHandle(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id).select("-refreshToken -password");

  return res.status(200).json({
    data: { success: user ? true : false, rs: user ? user : "User not found!" },
  });
});

const getAllUser = asyncHandle(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel.find().select("-refreshToken -password");

  return res.status(200).json({
    data: { success: user ? true : false, rs: user ? user : "User not found!" },
  });
});

module.exports = {
  getCurrent,
  getAllUser,
};
