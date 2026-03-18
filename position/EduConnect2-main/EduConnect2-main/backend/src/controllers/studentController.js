const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id }).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by email
exports.getStudentByEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email }).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate a 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Register a new student
exports.registerStudent = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    
    if (studentExists) {
      console.log('Student already exists:', email);
      return res.status(400).json({ success: false, message: 'Student already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate unique ID
    const id = uuidv4();

    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code for', email, ':', verificationCode);
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const student = await Student.create({
      id,
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires
    });

    console.log('Student created successfully:', student.id);

    // Send verification email with a timeout
    let emailSent = false;
    try {
      console.log('Attempting to send verification email to:', email);
      
      // Set a timeout for email sending (3 seconds)
      const emailPromise = sendVerificationEmail(email, verificationCode);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 3000)
      );
      
      await Promise.race([emailPromise, timeoutPromise]);
      emailSent = true;
      console.log('Verification email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      emailSent = false;
    }
    
    // DEVELOPMENT MODE: Always include verification code in response
    // In production, you would remove this and only include the code if email fails
    res.status(201).json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        isEmailVerified: student.isEmailVerified,
        createdAt: student.createdAt
      },
      verificationCode: verificationCode, // Always include code during development
      message: emailSent 
        ? 'Student registered successfully. Please check your email for the verification code. For development, the code is also included in this response.'
        : 'Student registered successfully. Use the verification code provided: ' + verificationCode
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: error.message 
    });
  }
};

// Login student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, student.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!student.isEmailVerified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please verify your email address before logging in'
      });
    }
    
    res.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        isEmailVerified: student.isEmailVerified,
        createdAt: student.createdAt
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify email with code
exports.verifyEmail = async (req, res) => {
  try {
    console.log('Verification request received:', req.body);
    const { email, code } = req.body;

    console.log('Looking for student with email:', email, 'and code:', code);
    
    // First try to find by exact match
    let student = await Student.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });

    if (!student) {
      console.log('No exact match found, trying case-insensitive search...');
      // Try case-insensitive search
      const students = await Student.find({
        email: { $regex: new RegExp('^' + email + '$', 'i') },
        verificationCodeExpires: { $gt: Date.now() }
      });
      
      // Check if any student's verification code matches (case-insensitive)
      for (const s of students) {
        if (s.verificationCode && s.verificationCode.toString() === code.toString()) {
          student = s;
          console.log('Found student with case-insensitive match:', student.id);
          break;
        }
      }
    }

    if (!student) {
      console.log('Invalid or expired verification code for email:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    console.log('Valid verification code for student:', student.id);
    student.isEmailVerified = true;
    student.verificationCode = undefined;
    student.verificationCodeExpires = undefined;
    await student.save();
    console.log('Student email verified successfully:', student.id);

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resend verification code
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    student.verificationCode = verificationCode;
    student.verificationCodeExpires = verificationCodeExpires;
    await student.save();

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    res.json({
      success: true,
      message: 'New verification code sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password - generate and send reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      // For security reasons, don't reveal whether the email exists
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive password reset instructions'
      });
    }

    // Generate a reset token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update student with reset token info
    student.resetToken = resetToken;
    student.resetTokenExpires = resetTokenExpires;
    await student.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      
      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email'
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide token and new password'
      });
    }

    // Find student with valid reset token
    const student = await Student.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update student with new password and clear reset token
    student.password = hashedPassword;
    student.resetToken = undefined;
    student.resetTokenExpires = undefined;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 