const asyncHandle = require("express-async-handler");
const roomChatModel = require("../../models/roomChatModal");

require("dotenv").config();

const getRoomChatsByUserId = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy userId từ request params

    // Tìm tất cả phòng chat mà user tham gia
    const roomChats = await roomChatModel
      .find({ user: _id }) // Lọc theo userId
      .populate("user", "firstname lastname mobile ") // Populate user để lấy thông tin name, email
      .populate("driver", "firstname lastname mobile licensePlate "); // Populate driver để lấy thông tin name, phone

    return res.status(200).json({ data: { success: true, roomChats } });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng chat theo userID:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

const getRoomChatsByDriverId = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy userId từ request params

    // Tìm tất cả phòng chat mà user tham gia
    const roomChats = await roomChatModel
      .find({ driver: _id }) // Lọc theo userId
      .populate("user", "firstname lastname mobile ") // Populate user để lấy thông tin name, email
      .populate("driver", "firstname lastname mobile licensePlate "); // Populate driver để lấy thông tin name, phone

    return res.status(200).json({ data: { success: true, roomChats } });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng chat theo userID:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

const getRoomChatById = asyncHandle(async (req, res) => {
  try {
    const { roomId } = req.body; // Lấy userId từ request params

    // Tìm tất cả phòng chat mà user tham gia
    const roomChat = await roomChatModel
      .findById(roomId) // Lọc theo userId
      .populate("user", "firstname lastname mobile ") // Populate user để lấy thông tin name, email
      .populate("driver", "firstname lastname mobile licensePlate "); // Populate driver để lấy thông tin name, phone

    return res.status(200).json({ data: roomChat });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng chat ", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

module.exports = {
  getRoomChatsByUserId,
  getRoomChatsByDriverId,
  getRoomChatById,
};
