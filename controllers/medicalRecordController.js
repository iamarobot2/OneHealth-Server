// controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');
const { uploadFileToFirestore, deleteFileFromFirestore } = require('../services/firestoreService');

// Create Medical Record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { userId, addedBy, date, title, description, prescription, medicines, findings, additionalComments, vitals } = req.body;
    const files = req.files.map(file => ({ filename: file.originalname, filetype: file.mimetype, url: file.url }));

    const medicalRecord = new MedicalRecord({
      user: userId,
      addedBy,
      date,
      title,
      description,
      prescription,
      medicines,
      findings,
      additionalComments,
      vitals,
      files,
    });

    await medicalRecord.save();
    res.status(201).json({ message: 'Medical record created successfully', medicalRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create medical record', error });
  }
};

// Get User Medical Records
exports.getUserMedicalRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await MedicalRecord.find({ user: userId });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get medical records', error });
  }
};

// Get Single Medical Record
exports.getMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await MedicalRecord.findById(recordId);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get medical record', error });
  }
};

// Update Medical Record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updates = req.body;
    const files = req.files.map(file => ({ filename: file.originalname, filetype: file.mimetype, url: file.url }));
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(recordId, { ...updates, $push: { files } }, { new: true });

    if (!medicalRecord) return res.status(404).json({ message: 'Medical record not found' });
    res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medical record', error });
  }
};

// Delete Medical Record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await MedicalRecord.findByIdAndDelete(recordId);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });

    // Optionally, delete associated files from Firestore
    await Promise.all(record.files.map(file => deleteFileFromFirestore(file.url)));

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete medical record', error });
  }
};
