const asyncHandle = require("express-async-handler");
const billTemporaryModel = require("../../models/billTemporaryModel");

require("dotenv").config();

const getBillTemById = asyncHandle(async (req, res) => {
  try {
    const { billId } = req.body; // Lấy billId từ request params

    console.log(billId);

    // Tìm đơn hàng theo ID và populate thông tin tài xế
    const bill = await billTemporaryModel
      .findById(billId)
      .populate("driverId", "-password") // Lấy đầy đủ thông tin tài xế
      .populate("userId", "-password"); // Lấy đầy đủ thông tin user

    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    console.log(`✅ Lấy thông tin đơn hàng thành công: ${billId}`);

    return res.status(200).json({ data: bill });
  } catch (error) {
    console.error("❌ Lỗi khi tìm đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

module.exports = {
  getBillTemById,
};
