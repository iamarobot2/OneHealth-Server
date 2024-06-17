const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, appointmentDate, reason } = req.body;
    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      appointmentDate,
      reason,
    });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user: userId }).populate(
      "doctor",
      "fullname specialization"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user appointments", error });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId }).populate(
      "user",
      "fullname email"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get doctor appointments", error });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updates = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment", error });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment", error });
  }
};
module.exports = {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
};
