var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  getPendingBills,
  updateBillStatus,
  getBillById,
  getAllBills,
  getAllBillsDriver,
} = require("../controllers/restful/billControllers");

router.get("/get-bills-pending", verifyAccessToken, getPendingBills);
router.put("/update-bills-status", verifyAccessToken, updateBillStatus);
router.post("/get-bill", verifyAccessToken, getBillById);
router.get("/get-all-bill", verifyAccessToken, getAllBills);
router.get("/get-all-bill-driver", verifyAccessToken, getAllBillsDriver);

module.exports = router;
