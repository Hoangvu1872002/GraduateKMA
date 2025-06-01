var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  updateDriverLocation,
  findDriversNearby,
  updateDriverSocketId,
  getCurrent,
  updateDriverBalance,
  addDriverRating,
} = require("../controllers/restful/driverControllers");

router.get("/current", verifyAccessToken, getCurrent);
router.put("/update-location-driver", verifyAccessToken, updateDriverLocation);
router.post("/find-driver-nearby", verifyAccessToken, findDriversNearby);
router.post("/rating", verifyAccessToken, addDriverRating);
router.put("/update-driver-socketId", verifyAccessToken, updateDriverSocketId);
router.put("/update-balence-driver", verifyAccessToken, updateDriverBalance);

module.exports = router;
