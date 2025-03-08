const bcryp = require("bcryptjs");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMail = require("../../ultils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/jwt");
const driverModel = require("../../models/driverModel");
require("dotenv").config();

const verificationDriver = asyncHandle(async (req, res) => {
  const { email } = req.body;

  // const { email, password, firstname, lastname, mobile } = req.body;

  // if (!email || !password || !lastname || !firstname || !mobile)
  //   return res.status(400).json({
  //     success: false,
  //     mes: "Missing input",
  //   });

  const verificationCode = Math.round(1000 + Math.random() * 9000);

  const driver = await driverModel.findOne({ email });
  if (driver) throw new Error("Driver has existed!");
  else {
    const html = `Your code to verification email: <h1>${verificationCode}</h1>`;
    const subject = "Verification email code";
    await sendMail(email, html, subject);
  }

  res.status(200).json({
    mes: "Send verification code successfully!!!",
    data: {
      success: driver ? false : true,
      code: verificationCode,
    },
  });
});

const registerDriver = asyncHandle(async (req, res) => {
  const { firstname, lastname, email, password, mobile } = req.body;

  const newDriver = await driverModel.create({
    email,
    password,
    mobile,
    firstname,
    lastname,
  });

  res.status(200).json({
    data: {
      mes: "Register new driver successfully",
      success: newDriver ? true : false,
    },
  });
});

const loginDriver = asyncHandle(async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });

  const response = await driverModel.findOne({ email });

  if (response && (await response.isCorrectPassword(password))) {
    // tách pw và role ra khỏi response
    const { password, role, refreshToken, ...driverData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //Lưu refresh token vào database
    await driverModel.findByIdAndUpdate(
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
      },
    });
  } else {
    throw new Error("Invalid credenttials!");
  }
});

const forgotPasswordDriver = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const randomPassword = Math.round(100000 + Math.random() * 99000);

  const driver = await driverModel.findOne({ email });
  if (driver) {
    const salt = await bcryp.genSalt(10);
    const hashedPassword = await bcryp.hash(`${randomPassword}`, salt);

    await driverModel
      .findByIdAndUpdate(driver._id, {
        password: hashedPassword,
        isChangePassword: true,
      })
      .then(() => {
        console.log("Done");
      })
      .catch((error) => console.log(error));

    const html = `Your code to verification email for your new password: <h1>${randomPassword}</h1>`;
    const subject = "Verification email code new password.";
    const check = await sendMail(email, html, subject);
    if (check) {
      res.status(200).json({
        data: {
          success: check ? true : false,
          mes: "Send email new password successfully!!!",
        },
      });
    } else {
      res.status(401);
      throw new Error("Can not send email");
    }
  } else {
    res.status(401);
    throw new Error("Driver not found!!!");
  }
});

module.exports = {
  registerDriver,
  loginDriver,
  verificationDriver,
  forgotPasswordDriver,
};
