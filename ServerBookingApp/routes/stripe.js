var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  payHandle,
  rechargeHandle,
  rechargeBalanceAndNotify,
} = require("../controllers/restful/payosController");

router.post("/pay", payHandle);
router.post("/recharge", verifyAccessToken, rechargeHandle);
router.post("/recharge-user", verifyAccessToken, rechargeBalanceAndNotify);

module.exports = router;
