const MedicalRecord = require('../models/MedicalRecord');

const createMedicalRecord = async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json({ message: "Medical record created successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to create medical record", error });
  }
};

const getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ appointment: req.params.appointmentId })
      .populate('user', 'fullname')
      .populate('hcp', 'fullname');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical records", error });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.recordId, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record updated successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to update medical record", error });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.recordId);
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete medical record", error });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
};
