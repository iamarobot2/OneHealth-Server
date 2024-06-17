const express = require("express");
const router = express.Router();
const {
  Login,
  userSignup,
  Refresh,
  Logout,
  hcpSignup,
  verifyOTP,
} = require("../controllers/authController");
const loginLimitter = require("../middleware/loginLimiter");

router.post("/refresh", Refresh);
router.post("/login", loginLimitter, Login);
router.post("/verify-otp", verifyOTP)
router.post("/signup", userSignup);
router.post("/signup/hcp", hcpSignup);
router.post("/logout", Logout);

module.exports = router;
