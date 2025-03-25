var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  createEvent,
  getLatestUnfinishedEvents,
} = require("../controllers/restful/eventControllers");

router.post("/create-event", verifyAccessToken, createEvent);
router.get("/get-event-lastest", verifyAccessToken, getLatestUnfinishedEvents);

module.exports = router;
