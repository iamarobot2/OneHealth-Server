const express = require("express");
const router = express.Router();
const {
  userLogin,
  userSignup,
  Refresh,
  Logout,
  hcpSignup,
} = require("../controllers/authController");
const loginLimitter = require("../middleware/loginLimiter");

router.get("/refresh", Refresh);
router.post("/login/user", loginLimitter, userLogin);
router.post("/signup", userSignup);
router.post("/signup/hcp", hcpSignup);
router.post("/logout", Logout);

module.exports = router;