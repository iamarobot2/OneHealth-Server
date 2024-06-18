const Hcp = require('../models/HealthCareProvider');
const bcrypt = require('bcryptjs');

// Create HCP
exports.createHCP = async (req, res) => {
  try {
    const { fullname, dob, gender, email, password, contactnumber, specialization, medicalLicenseNumber, workaddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hcp = new Hcp({ fullname, dob, gender, email, password: hashedPassword, contactnumber, specialization, medicalLicenseNumber, workaddress });
    await hcp.save();
    res.status(201).json({ message: 'HealthCareProvider created successfully', hcp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create HealthCareProvider', error });
  }
};

// Get All HCPs
exports.getAllHCPs = async (req, res) => {
  try {
    const hcps = await Hcp.find();
    res.status(200).json(hcps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get HealthCareProviders', error });
  }
};

// Get HCP by ID
exports.getHCPById = async (req, res) => {
  try {
    const hcp = await Hcp.findById(req.params.hcpId);
    if (!hcp) return res.status(404).json({ message: 'HealthCareProvider not found' });
    res.status(200).json(hcp);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get HealthCareProvider', error });
  }
};

// Update HCP
exports.updateHCP = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const hcp = await Hcp.findByIdAndUpdate(req.params.hcpId, updates, { new: true });
    if (!hcp) return res.status(404).json({ message: 'HealthCareProvider not found' });
    res.status(200).json({ message: 'HealthCareProvider updated successfully', hcp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update HealthCareProvider', error });
  }
};

// Delete HCP
exports.deleteHCP = async (req, res) => {
  try {
    await Hcp.findByIdAndDelete(req.params.hcpId);
    res.status(200).json({ message: 'HealthCareProvider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete HealthCareProvider', error });
  }
};
