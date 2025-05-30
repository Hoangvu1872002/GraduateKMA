var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getBillTemById,
} = require("../controllers/restful/billTempoaryControllers");

router.post("/get-bill", verifyAccessToken, getBillTemById);

module.exports = router;
