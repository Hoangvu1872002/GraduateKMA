var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  createEvent,
  getLatestUnfinishedEvents,
  getAllUnfinishedEvents,
  deleteEventById,
} = require("../controllers/restful/eventControllers");

router.post("/create-event", verifyAccessToken, createEvent);
router.get("/get-event-lastest", verifyAccessToken, getLatestUnfinishedEvents);
router.get("/get-all-event", verifyAccessToken, getAllUnfinishedEvents);
router.delete("/delete-event", verifyAccessToken, deleteEventById);

module.exports = router;
