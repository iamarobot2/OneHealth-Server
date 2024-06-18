const Appointment = require("../models/Appointment");
const dayjs = require("dayjs")

const createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, appointmentDate, appointmentTime } = req.body;

    console.log("Received data: ", { userId, doctorId, appointmentDate, appointmentTime });

    // Validate inputs
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }
    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Both appointment date and time are required' });
    }

    // Ensure the appointmentDate is a valid date in the format 'DDMMYYYY'
    const parsedDate = dayjs(appointmentDate, 'DDMMYYYY');
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Invalid appointment date format' });
    }

    // Ensure the appointmentTime is a valid time in the format 'hh:mm A'
    const parsedTime = dayjs(appointmentTime, 'hh:mm A');
    if (!parsedTime.isValid()) {
      return res.status(400).json({ message: 'Invalid appointment time format' });
    }

    // Check if the user already has an appointment with the doctor on the same day
    const existingAppointment = await Appointment.findOne({
      user: userId,
      doctor: doctorId,
      appointmentDate,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "You already have an appointment with this doctor on the selected date.",
      });
    }

    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error("Failed to create appointment:", error);
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
    const { appointmentDate, appointmentTime } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (['completed', 'accepted'].includes(appointment.status)) {
      return res.status(403).json({ message: 'Cannot update a completed or accepted appointment' });
    }

    appointment.appointmentDate = appointmentDate;
    appointment.appointmentTime = appointmentTime;

    await appointment.save();

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error });
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
