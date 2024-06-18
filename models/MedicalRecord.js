// models/MedicalRecord.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  filetype: String,
  url: String,
});

const medicalRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Can be User or HealthCareProvider
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  prescription: String,
  medicines: [String],
  findings: String,
  additionalComments: String,
  vitals: {
    temperature: String,
    bloodPressure: String,
    heartRate: String,
    respirationRate: String,
  },
  files: [fileSchema],
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
