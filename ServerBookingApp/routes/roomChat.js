var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getRoomChatsByUserId,
  getRoomChatsByDriverId,
  getRoomChatById,
} = require("../controllers/restful/roomChatControllers");

router.get("/get-all-room-chat-user", verifyAccessToken, getRoomChatsByUserId);
router.get(
  "/get-all-room-chat-driver",
  verifyAccessToken,
  getRoomChatsByDriverId
);
router.post("/get-room-chat-by-id", verifyAccessToken, getRoomChatById);

module.exports = router;
