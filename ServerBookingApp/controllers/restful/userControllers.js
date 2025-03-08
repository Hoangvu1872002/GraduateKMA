const asyncHandle = require("express-async-handler");
const userModel = require("../../models/userModel");

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

const updateUserSocketId = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy ID tài xế từ request (giả sử đã xác thực)
    const { socketId } = req.body; // Lấy socketId từ request body

    // Cập nhật socketId của tài xế
    const driver = await userModel.findByIdAndUpdate(
      _id,
      { socketId },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ data: { message: "Không tìm thấy tài xế!" } });
    }

    return res.status(200).json({ data: { success: true, driver } });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật socketId:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

module.exports = {
  getCurrent,
  getAllUser,
  updateUserSocketId,
};
