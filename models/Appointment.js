const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HealthCareProvider",
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime:
  {
    type:String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
