const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, appointmentDate, appointmentTime } = req.body;

    console.log("Received data: ", {
      userId,
      doctorId,
      appointmentDate,
      appointmentTime,
    });

    // Ensure date is in DDMMYYYY format
    const datePattern = /^\d{2}\d{2}\d{4}$/;
    if (!datePattern.test(appointmentDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Check if the user already has an appointment with the doctor on the same day
    const existingAppointment = await Appointment.findOne({
      user: userId,
      doctor: doctorId,
      appointmentDate,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "You already have an appointment with this doctor on the selected date.",
      });
    }

    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    res.status(500).json({ message: "Failed to create appointment", error });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user: userId })
      .populate("doctor", "fullname specialization workaddress")
      .exec();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user appointments", error });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("user", "fullname email")
      .exec();
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

    // Fetch the appointment to check its current status
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (["completed", "accepted"].includes(appointment.status)) {
      return res
        .status(403)
        .json({ message: "Cannot update a completed or accepted appointment" });
    }

    Object.assign(appointment, updates);
    await appointment.save();

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

    // Fetch the appointment to check its current status
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (["completed", "accepted"].includes(appointment.status)) {
      return res
        .status(403)
        .json({ message: "Cannot delete a completed or accepted appointment" });
    }

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
