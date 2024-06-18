const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');


router.post('/', createAppointment);
router.get('/user/:userId', getUserAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.put('/:appointmentId', updateAppointment);
router.delete('/:appointmentId', deleteAppointment);


module.exports = router;
