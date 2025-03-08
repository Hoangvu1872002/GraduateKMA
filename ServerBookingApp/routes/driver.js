var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  updateDriverLocation,
  findDriversNearby,
  updateDriverSocketId,
  getCurrent,
} = require("../controllers/restful/driverControllers");

router.get("/current", verifyAccessToken, getCurrent);
router.put("/update-location-driver", verifyAccessToken, updateDriverLocation);
router.post("/find-driver-nearby", verifyAccessToken, findDriversNearby);
router.put("/update-driver-socketId", verifyAccessToken, updateDriverSocketId);

module.exports = router;
