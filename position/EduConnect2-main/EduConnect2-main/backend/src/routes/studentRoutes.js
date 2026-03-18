const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students - Get all students
router.get('/', studentController.getAllStudents);

// GET /api/students/id/:id - Get student by ID
router.get('/id/:id', studentController.getStudentById);

// GET /api/students/email/:email - Get student by email
router.get('/email/:email', studentController.getStudentByEmail);

// POST /api/students/register - Register a new student
router.post('/register', studentController.registerStudent);

// POST /api/students/login - Login student
router.post('/login', studentController.loginStudent);

// POST /api/students/verify-email - Verify email with code
router.post('/verify-email', studentController.verifyEmail);

// POST /api/students/resend-verification - Resend verification code
router.post('/resend-verification', studentController.resendVerificationCode);

// POST /api/students/forgot-password - Send password reset email
router.post('/forgot-password', studentController.forgotPassword);

// POST /api/students/reset-password - Reset password with token
router.post('/reset-password', studentController.resetPassword);

module.exports = router; 