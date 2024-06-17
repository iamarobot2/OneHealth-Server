const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');


router.post('/appointments', createAppointment);
router.get('/appointments/user/:userId', getUserAppointments);
router.get('/appointments/doctor/:doctorId', getDoctorAppointments);
router.put('/appointments/:appointmentId', updateAppointment);
router.delete('/appointments/:appointmentId', deleteAppointment);


module.exports = router;
