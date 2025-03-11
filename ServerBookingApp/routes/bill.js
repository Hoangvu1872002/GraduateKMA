var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getPendingBills,
  updateBillStatus,
  getBillById,
} = require("../controllers/restful/billControllers");

router.get("/get-bills-pending", verifyAccessToken, getPendingBills);
router.put("/update-bills-status", verifyAccessToken, updateBillStatus);
router.post("/get-bill", verifyAccessToken, getBillById);

module.exports = router;
