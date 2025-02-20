var express = require("express");
const {
  registerDriver,
  loginDriver,
  verificationDriver,
  forgotPasswordDriver,
  // handleLoginWithGoogle,
} = require("../controllers/authDriverControllers");
var authRouter = express.Router();

/* GET Drivers listing. */
authRouter.post("/register", registerDriver);
authRouter.post("/login", loginDriver);
authRouter.post("/verification", verificationDriver);
authRouter.post("/forgotPassword", forgotPasswordDriver);
// authRouter.post("/google-signin", handleLoginWithGoogle);

module.exports = authRouter;
