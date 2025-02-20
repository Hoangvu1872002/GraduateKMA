const driverModel = require("../models/driverModel");
const asyncHandle = require("express-async-handler");
require("dotenv").config();

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

    const drivers = await driverModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radiusInMeters,
        },
      },
    });

    return res.status(200).json({
      data: {
        success: true,
        rs:
          drivers.length > 0
            ? drivers
            : `Tìm thấy ${drivers.length} tài xế trong bán kính ${radiusInKm}km.`,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tìm tài xế gần:", error);
    return res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

module.exports = { updateDriverLocation, findDriversNearby };
