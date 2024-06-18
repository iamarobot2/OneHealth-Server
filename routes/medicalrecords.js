const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/medicalRecordController");

router.post("/", createMedicalRecord);
router.get("/:appointmentId", getMedicalRecords);
router.put("/:recordId", updateMedicalRecord);
router.delete("/:recordId", deleteMedicalRecord);

module.exports = router;
