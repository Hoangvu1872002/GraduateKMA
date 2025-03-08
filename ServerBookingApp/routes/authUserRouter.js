var express = require("express");
const {
  registerUser,
  loginUser,
  verificationUser,
  forgotPasswordUser,
  // handleLoginWithGoogle,
} = require("../controllers/restful/authUserControllers");
var authRouter = express.Router();

/* GET users listing. */
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verification", verificationUser);
authRouter.post("/forgotPassword", forgotPasswordUser);
// authRouter.post("/google-signin", handleLoginWithGoogle);

module.exports = authRouter;
