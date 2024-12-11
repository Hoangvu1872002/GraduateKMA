var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const { getCurrent } = require("../controllers/userControllers");

router.get("/current", verifyAccessToken, getCurrent);

module.exports = router;
