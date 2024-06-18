const express = require("express");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { recipientEmail, link, otp, purpose } = req.body;

  try {
    await sendEmail(
      recipientEmail,
      `One Health Data Sharing from ${req.bosy.username}`,
      `Access the medical records using this link: ${link} and OTP: ${otp}. Purpose: ${purpose}`
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
