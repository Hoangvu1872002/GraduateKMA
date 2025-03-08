const asyncHandle = require("express-async-handler");
const Bill = require("../../models/billModel");

require("dotenv").config();

const getPendingBills = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy userId từ request (giả sử đã xác thực)

    // Lọc danh sách đơn hàng của user chưa hoàn thành và chưa bị hủy, đồng thời lấy thông tin tài xế
    const bills = await Bill.find({
      userId: _id,
      status: { $nin: ["COMPLETED", "CANCELED"] },
    }).populate("driverId"); // Lấy thông tin của tài xế

    console.log(bills);

    return res.status(200).json({ data: { bills } });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

module.exports = { getPendingBills };
