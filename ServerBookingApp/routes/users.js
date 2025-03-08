var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getCurrent,
  getAllUser,
  updateUserSocketId,
} = require("../controllers/restful/userControllers");

router.get("/current", verifyAccessToken, getCurrent);
router.get("/get-all-users", verifyAccessToken, getAllUser);
router.put("/update-user-socketId", verifyAccessToken, updateUserSocketId);

module.exports = router;
