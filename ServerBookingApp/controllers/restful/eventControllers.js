const asyncHandle = require("express-async-handler");
const eventModel = require("../../models/eventModel");

require("dotenv").config();

const createEvent = asyncHandle(async (req, res) => {
  const {
    authorId,
    date,
    endAt,
    description,
    locationAddress,
    locationTitle,
    position,
    title,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (
    !authorId ||
    !date ||
    !endAt ||
    !locationAddress ||
    !locationTitle ||
    !position?.lat ||
    !position?.long ||
    !title ||
    !description
  ) {
    return res.status(400).json({
      data: { success: false, message: "Thiếu thông tin bắt buộc!" },
    });
  }

  // Tạo sự kiện mới
  const newEvent = new eventModel({
    main_name_place: locationTitle,
    latitude: position.lat,
    longitude: position.long,
    title,
    description,
    authorId,
    dateEnd: date,
    endAt,
    locationAddress,
  });

  await newEvent.save();

  return res.status(201).json({
    data: { success: true },
  });
});

const getLatestUnfinishedEvents = asyncHandle(async (req, res) => {
  const { _id } = req.user;

  const events = await eventModel
    .find({ authorId: _id, status: "unfinished" })
    .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
    .limit(5); // Giới hạn lấy 5 bản ghi

  return res.status(200).json({
    data: { success: true, rs: events },
  });
});

const getAllUnfinishedEvents = asyncHandle(async (req, res) => {
  const { _id } = req.user;

  const events = await eventModel
    .find({ authorId: _id, status: "unfinished" })
    .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

  return res.status(200).json({
    data: events,
  });
});

const deleteEventById = asyncHandle(async (req, res) => {
  const { eventId } = req.body;

  const deleted = await eventModel.findByIdAndDelete(eventId);

  if (!deleted) {
    return res.status(404).json({
      data: { success: false, message: "Không tìm thấy sự kiện để xóa!" },
    });
  }

  return res.status(200).json({
    data: { success: true, message: "Xóa sự kiện thành công!" },
  });
});

// Thêm vào exports
module.exports = {
  createEvent,
  getLatestUnfinishedEvents,
  getAllUnfinishedEvents,
  deleteEventById,
};
