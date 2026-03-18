const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// GET /api/appointments - Get all appointments
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/teacher/:teacherId - Get appointments by teacher ID
router.get('/teacher/:teacherId', appointmentController.getAppointmentsByTeacherId);

// GET /api/appointments/student/:studentId - Get appointments by student ID
router.get('/student/:studentId', appointmentController.getAppointmentsByStudentId);

// POST /api/appointments - Create a new appointment
router.post('/', appointmentController.createAppointment);

// PUT /api/appointments/:id/status - Update appointment status
router.put('/:id/status', appointmentController.updateAppointmentStatus);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router; 