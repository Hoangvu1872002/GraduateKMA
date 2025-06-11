const mongoose = require("mongoose"); // Erase if already required
const { Schema } = mongoose; // Thêm dòng này

const roomChatSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "drivers", required: true },
    listMessages: [
      {
        id: { type: String },
        sender: { type: mongoose.Schema.Types.ObjectId },
        message: { type: String },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastestMesage: {
      id: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId },
      message: { type: String },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("roomChats", roomChatSchema);
