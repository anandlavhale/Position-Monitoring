const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  teacherId: {
    type: String,
    required: true,
    ref: 'Teacher'
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema); 