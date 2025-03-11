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

const updateBillStatus = asyncHandle(async (req, res) => {
  try {
    const { billId, status } = req.body; // Nhận billId và status từ request body
    console.log(billId, status);

    // Kiểm tra giá trị status hợp lệ
    const validStatuses = ["RECEIVED", "PENDING", "COMPLETED", "CANCELED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Tìm và cập nhật trạng thái của bill
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { status },
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedBill) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    console.log(`✅ Cập nhật đơn hàng ${billId} thành công: ${status}`);

    return res.status(200).json({ data: { bill: updatedBill } });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

const getBillById = asyncHandle(async (req, res) => {
  try {
    const { billId } = req.body; // Lấy billId từ request params

    console.log(billId);

    // Tìm đơn hàng theo ID và populate thông tin tài xế
    const bill = await Bill.findById(billId).populate("driverId", "-password");

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

module.exports = { getPendingBills, updateBillStatus, getBillById };
