const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
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
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
