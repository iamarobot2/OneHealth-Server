const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByUser
} = require("../controllers/medicalRecordController");

router.post("/", createMedicalRecord);
router.get("/:appointmentId", getMedicalRecords);
router.put("/:recordId", updateMedicalRecord);
router.delete("/:recordId", deleteMedicalRecord);
router.get("/user/:userId", getMedicalRecordsByUser);

module.exports = router;
