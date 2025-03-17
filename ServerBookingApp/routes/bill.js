var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getPendingBills,
  updateBillStatus,
  getBillById,
  getAllBills,
} = require("../controllers/restful/billControllers");

router.get("/get-bills-pending", verifyAccessToken, getPendingBills);
router.put("/update-bills-status", verifyAccessToken, updateBillStatus);
router.post("/get-bill", verifyAccessToken, getBillById);
router.get("/get-all-bill", verifyAccessToken, getAllBills);

module.exports = router;
