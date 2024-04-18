const express = require("express");
const router = express.Router();
const {
  Login,
  userSignup,
  Refresh,
  Logout,
  hcpSignup,
} = require("../controllers/authController");
const loginLimitter = require("../middleware/loginLimiter");

router.get("/refresh", Refresh);
router.post("/login", loginLimitter, Login);
router.post("/signup/user", userSignup);
router.post("/signup/hcp", hcpSignup);
router.post("/logout", Logout);

module.exports = router;
