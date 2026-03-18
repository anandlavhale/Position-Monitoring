const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetToken: String,
  resetTokenExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema); 