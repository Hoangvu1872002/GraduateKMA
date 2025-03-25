var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var driverRouter = require("./routes/driver");
var authUserRouter = require("./routes/authUserRouter");
var authDriverRouter = require("./routes/authDriverRouter");
var billRouter = require("./routes/bill");
var eventRouter = require("./routes/event");

const { errorsMiddleware } = require("./middlewares/errorsMiddleware");

const booking = require("./controllers/sockets/booking");

var app = express();

const dbConnect = require("./config/database");
dbConnect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/driver", driverRouter);
app.use("/auth-user", authUserRouter);
app.use("/auth-driver", authDriverRouter);
app.use("/bill", billRouter);
app.use("/event", eventRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorsMiddleware);

const PORT = process.env.PORT;
const http = require("http");
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Server running on port ${PORT}`));

const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

booking(io);

module.exports = app;
