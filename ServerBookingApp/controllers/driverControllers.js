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

    const drivers = await driverModel.find(
      {
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

module.exports = { updateDriverLocation, findDriversNearby };
