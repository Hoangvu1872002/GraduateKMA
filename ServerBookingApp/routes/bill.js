var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const { getPendingBills } = require("../controllers/restful/billControllers");

router.get("/get-bills-pending", verifyAccessToken, getPendingBills);

module.exports = router;
