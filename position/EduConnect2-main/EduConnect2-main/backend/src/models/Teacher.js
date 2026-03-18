const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  subject: String,
  class: String,
  avail: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  },
  loc: String
});

const dayScheduleSchema = new mongoose.Schema({}, { strict: false });

const timetableSchema = new mongoose.Schema({}, { strict: false });

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  timetable: {
    type: timetableSchema,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema); 