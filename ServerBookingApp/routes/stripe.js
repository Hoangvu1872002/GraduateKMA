var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  payHandle,
  stripeHandle,
} = require("../controllers/restful/payosController");

router.post("/pay", payHandle);
// router.post("/stripe", stripeHandle);

module.exports = router;
