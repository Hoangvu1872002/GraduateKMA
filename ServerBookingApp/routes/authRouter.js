var express = require("express");
const {
  register,
  login,
  verification,
  forgotPassword,
  // handleLoginWithGoogle,
} = require("../controllers/authControllers");
var authRouter = express.Router();

/* GET users listing. */
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verification", verification);
authRouter.post("/forgotPassword", forgotPassword);
// authRouter.post("/google-signin", handleLoginWithGoogle);

module.exports = authRouter;
