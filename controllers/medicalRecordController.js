const MedicalRecord = require('../models/MedicalRecord');

const createMedicalRecord = async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json({ message: "Medical record created successfully", record });
  } catch (error) {
    console.error("Error creating medical record:", error);
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
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Failed to fetch medical records", error });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.recordId, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record updated successfully", record });
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Failed to update medical record", error });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.recordId);
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json({ message: "Failed to delete medical record", error });
  }
};

const getMedicalRecordsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const records = await MedicalRecord.find({ 'appointment.user': userId })
      .populate('appointment', 'appointmentDate appointmentTime')
      .populate('appointment.user', 'fullname')
      .populate('appointment.doctor', 'fullname specialization');

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching medical records by user:", error);
    res.status(500).json({ message: "Failed to fetch medical records by user", error });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByUser,
};
