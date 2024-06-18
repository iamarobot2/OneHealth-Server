// routes/medicalRecordRoutes.js
const express = require('express');
const {
  createMedicalRecord,
  getUserMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  uploadFiles,
} = require('../controllers/medicalRecordController');
const { upload } = require('../middlewares/uploadMiddleware'); // Handle file uploads

const router = express.Router();

router.post('/medical-records', upload.array('files'), createMedicalRecord);
router.get('/medical-records/user/:userId', getUserMedicalRecords);
router.get('/medical-records/:recordId', getMedicalRecord);
router.put('/medical-records/:recordId', upload.array('files'), updateMedicalRecord);
router.delete('/medical-records/:recordId', deleteMedicalRecord);

module.exports = router;
