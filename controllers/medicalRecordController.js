const MedicalRecord = require("../models/MedicalRecord");

exports.getMedicalRecords = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const records = await MedicalRecord.find({ appointment: appointmentId }).populate("addedBy", "fullname");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to get medical records", error });
  }
};

exports.createMedicalRecord = async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json({ message: "Medical record created successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to create medical record", error });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updates = req.body;
    const record = await MedicalRecord.findByIdAndUpdate(recordId, updates, { new: true });
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record updated successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to update medical record", error });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    await MedicalRecord.findByIdAndDelete(recordId);
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete medical record", error });
  }
};
