const express = require("express");
const {
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/medicalRecordController");

const router = express.Router();

router.get("/:appointmentId", getMedicalRecords);
router.post("/", createMedicalRecord);
router.put("/:recordId", updateMedicalRecord);
router.delete("/:recordId", deleteMedicalRecord);

module.exports = router;
