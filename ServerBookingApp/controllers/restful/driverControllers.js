const asyncHandle = require("express-async-handler");
const driverModel = require("../../models/driverModel");
const userModel = require("../../models/userModel");
require("dotenv").config();

const getCurrent = asyncHandle(async (req, res) => {
  const { _id } = req.user;
  const user = await driverModel
    .findById(_id)
    .select("-refreshToken -password");

  return res.status(200).json({
    data: { success: user ? true : false, rs: user ? user : "User not found!" },
  });
});

const updateDriverLocation = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy ID tài xế từ URL
    const { longitude, latitude } = req.body; // Lấy tọa độ từ request body

    // Cập nhật tọa độ của tài xế
    const driver = await driverModel.findByIdAndUpdate(
      _id,
      { location: { type: "Point", coordinates: [longitude, latitude] } },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ data: { message: "Không tìm thấy tài xế!" } });
    }

    return res.status(200).json({ data: { success: true, driver } });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const findDriversNearby = asyncHandle(async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    console.log(latitude, longitude);

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp tọa độ hợp lệ!" });
    }

    const radiusInMeters = 2000; // 2km = 2000m

    const drivers = await driverModel.find(
      {
        status: "online",
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: radiusInMeters,
          },
        },
      },
      "location.coordinates travelMode _id"
    );

    // Chuyển đổi dữ liệu để trả về đúng format mong muốn
    const formattedDrivers = drivers.map((driver) => ({
      _id: driver._id,
      travelMode: driver.travelMode,
      latitude: driver.location?.coordinates[1], // Lấy latitude từ coordinates
      longitude: driver.location?.coordinates[0], // Lấy longitude từ coordinates
    }));

    return res.status(200).json({
      data: formattedDrivers,
    });
  } catch (error) {
    console.error("Lỗi khi tìm tài xế gần:", error);
    return res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

const updateDriverSocketId = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy ID tài xế từ request (giả sử đã xác thực)
    const { socketId } = req.body; // Lấy socketId từ request body

    // Cập nhật socketId của tài xế
    const driver = await driverModel.findByIdAndUpdate(
      _id,
      { socketId },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ data: { message: "Không tìm thấy tài xế!" } });
    }

    return res.status(200).json({ data: { success: true, driver } });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật socketId:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
});

const updateDriverBalance = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy ID tài xế từ request (giả sử đã xác thực)
    const { cost } = req.body; // Số tiền cần trừ
    console.log(cost);

    if (typeof cost !== "number" || cost <= 0) {
      return res.status(400).json({ message: "Invalid cost value!" });
    }

    // Tìm tài xế
    const driver = await driverModel.findById(_id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    // Trừ tiền
    if (driver.balence < cost) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }
    driver.balence -= cost;
    await driver.save();
    console.log("Driver balance updated:", driver.balence);

    // Tìm user có role là admin và cộng tiền
    const adminUser = await userModel.findOne({ role: "admin" });
    if (adminUser) {
      adminUser.balence = adminUser.balence + cost;
      await adminUser.save();
      console.log("Admin balance updated:", adminUser.balence);
    }

    return res
      .status(200)
      .json({ data: { success: true, balence: driver.balence } });
  } catch (error) {
    console.error("❌ Error updating balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const addDriverRating = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // ID người đánh giá (user)
    const { driverId, star, comment } = req.body;

    if (!driverId || typeof star !== "number" || star < 1 || star > 5) {
      return res.status(400).json({ message: "Invalid rating data!" });
    }

    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    // Thêm đánh giá mới vào mảng ratings
    driver.ratings.push({
      star,
      postedBy: _id,
      comment,
    });

    // Cập nhật tổng rating trung bình
    const totalStars = driver.ratings.reduce((sum, r) => sum + r.star, 0);
    driver.totalRating = totalStars / driver.ratings.length;

    await driver.save();

    return res.status(200).json({
      data: {
        success: true,
        ratings: driver.ratings,
        totalRating: driver.totalRating,
      },
    });
  } catch (error) {
    console.error("❌ Error adding rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateDriverStatus = asyncHandle(async (req, res) => {
  try {
    const { _id } = req.user; // Lấy ID tài xế từ request (giả sử đã xác thực)
    const { status } = req.body; // Trạng thái mới: "offline", "online", "busy"

    // Kiểm tra giá trị hợp lệ
    const validStatuses = ["offline", "online", "busy"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value!" });
    }

    // Cập nhật trạng thái
    const driver = await driverModel.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found!" });
    }

    return res
      .status(200)
      .json({ data: { success: true, status: driver.status } });
  } catch (error) {
    console.error("❌ Error updating driver status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  getCurrent,
  updateDriverLocation,
  findDriversNearby,
  updateDriverSocketId,
  updateDriverBalance,
  addDriverRating,
  updateDriverStatus,
};
