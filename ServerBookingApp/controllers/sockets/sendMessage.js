const driverModel = require("../../models/driverModel");
const RoomChat = require("../../models/roomChatModal");

const mongoose = require("mongoose"); // Erase if already required

module.exports = function (io) {
  io.of("/message").on("connection", (socket) => {
    socket.on("sendMessage", async ({ roomId, senderId, message }) => {
      try {
        if (!roomId || !senderId || !message) {
          return socket.emit("error", { message: "Thiếu dữ liệu đầu vào" });
        }

        // Tạo tin nhắn mới
        const messageData = {
          id: new mongoose.Types.ObjectId().toString(),
          sender: new mongoose.Types.ObjectId(senderId),
          message,
          isRead: false,
          createdAt: new Date(),
        };

        // Tìm phòng chat theo roomId
        let roomChat = await RoomChat.findById(roomId);
        if (!roomChat) {
          return socket.emit("error", { message: "Không tìm thấy phòng chat" });
        }

        // Thêm tin nhắn vào danh sách và cập nhật tin nhắn mới nhất
        roomChat.listMessages.push(messageData);
        roomChat.lastestMesage = messageData;
        await roomChat.save();

        // Phát tin nhắn tới tất cả user trong room
        io.of("/message").to(roomId).emit("receiveMessage", {
          roomId,
          message: messageData,
        });

        console.log(`📩 Tin nhắn mới trong phòng ${roomId}:`, message);
      } catch (error) {
        console.error("❌ Lỗi khi gửi tin nhắn:", error);
        socket.emit("error", { message: "Lỗi server nội bộ" });
      }
    });
  });
};
