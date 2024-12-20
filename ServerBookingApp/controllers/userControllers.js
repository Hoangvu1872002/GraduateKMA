const userModel = require("../models/userModel");
const asyncHandle = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
require("dotenv").config();

const getCurrent = asyncHandle(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);

  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found!",
  });
});

module.exports = {
  getCurrent,
};
