var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  updateDriverLocation,
  findDriversNearby,
} = require("../controllers/driverControllers");

router.put("/update-location-driver", verifyAccessToken, updateDriverLocation);
router.post("/find-driver-nearby", verifyAccessToken, findDriversNearby);

module.exports = router;
