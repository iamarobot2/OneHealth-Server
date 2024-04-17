const express = require("express");
const router = express.Router();
const {
  Login,
  userSignup,
  Refresh,
  Logout,
} = require("../controllers/authController");
const loginLimitter = require("../middleware/loginLimiter");

router.get("/refresh", Refresh);
router.post("/login", loginLimitter, Login);
router.post("/signup/user", userSignup);
router.post("/logout", Logout);

module.exports = router;
