var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const { getCurrent, getAllUser } = require("../controllers/userControllers");

router.get("/current", verifyAccessToken, getCurrent);
router.get("/get-all-users", verifyAccessToken, getAllUser);

module.exports = router;
