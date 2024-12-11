const userModel = require("../models/userModel");
const bcryp = require("bcryptjs");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMail = require("../ultils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
require("dotenv").config();

const verification = asyncHandle(async (req, res) => {
  const { email } = req.body;

  // const { email, password, firstname, lastname, mobile } = req.body;

  // if (!email || !password || !lastname || !firstname || !mobile)
  //   return res.status(400).json({
  //     success: false,
  //     mes: "Missing input",
  //   });

  const verificationCode = Math.round(1000 + Math.random() * 9000);

  const user = await userModel.findOne({ email });
  if (user) throw new Error("User has existed!");
  else {
    const html = `Your code to verification email: <h1>${verificationCode}</h1>`;
    await sendMail(email, html);
  }

  res.status(200).json({
    mes: "Send verification code successfully!!!",
    data: {
      success: user ? false : true,
      code: verificationCode,
    },
  });
});

const register = asyncHandle(async (req, res) => {
  const { firstname, lastname, email, password, mobile } = req.body;
  const newUser = await userModel.create({
    email,
    password,
    mobile,
    firstname,
    lastname,
  });

  console.log(newUser);

  res.status(200).json({
    data: {
      mes: "Register new user successfully",
      success: newUser ? true : false,
    },
  });
});

const login = asyncHandle(async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });

  const response = await userModel.findOne({ email });

  if (response && (await response.isCorrectPassword(password))) {
    // tách pw và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //Lưu refresh token vào database
    await userModel.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successfully",
      data: {
        success: true,
        accessToken,
        // userData,
      },
    });
  } else {
    throw new Error("Invalid credenttials!");
  }
});

module.exports = {
  register,
  login,
  verification,
};
