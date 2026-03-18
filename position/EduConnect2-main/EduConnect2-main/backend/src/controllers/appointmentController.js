const Appointment = require('../models/Appointment');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { v4: uuidv4 } = require('uuid');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments by teacher ID
exports.getAppointmentsByTeacherId = async (req, res) => {
  try {
    console.log('Getting appointments for teacher ID:', req.params.teacherId);
    const appointments = await Appointment.find({ teacherId: req.params.teacherId });
    console.log('Found appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error getting appointments by teacher ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get appointments by student ID
exports.getAppointmentsByStudentId = async (req, res) => {
  try {
    console.log('Getting appointments for student ID:', req.params.studentId);
    const appointments = await Appointment.find({ studentId: req.params.studentId });
    console.log('Found appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error getting appointments by student ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { teacherId, studentId, studentName, studentEmail, day, timeSlot, reason } = req.body;
    
    console.log('Creating appointment with data:', req.body);
    
    // Check if teacher exists
    const teacher = await Teacher.findOne({ id: teacherId });
    if (!teacher) {
      console.log('Teacher not found:', teacherId);
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Check if student exists
    const student = await Student.findOne({ id: studentId });
    if (!student) {
      console.log('Student not found:', studentId);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if the time slot is available
    if (!teacher.timetable[day] || !teacher.timetable[day][timeSlot] || teacher.timetable[day][timeSlot].avail !== 'AVAILABLE') {
      console.log('Time slot not available:', day, timeSlot);
      return res.status(400).json({ message: 'Time slot is not available' });
    }
    
    // Generate unique ID
    const id = uuidv4();
    
    const appointment = await Appointment.create({
      id,
      teacherId,
      studentId,
      studentName,
      studentEmail,
      day,
      timeSlot,
      reason,
      status: 'pending'
    });
    
    console.log('Appointment created successfully:', appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const appointment = await Appointment.findOne({ id: req.params.id });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ id: req.params.id });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    await appointment.deleteOne();
    
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 