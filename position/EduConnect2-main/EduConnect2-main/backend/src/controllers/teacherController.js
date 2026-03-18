const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ id: req.params.id }).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, id, password, timetable } = req.body;
    
    // Check if teacher already exists
    const teacherExists = await Teacher.findOne({ id });
    
    if (teacherExists) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const teacher = await Teacher.create({
      name,
      id,
      password: hashedPassword,
      timetable
    });
    
    res.status(201).json({
      name: teacher.name,
      id: teacher.id,
      timetable: teacher.timetable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update teacher timetable
exports.updateTeacherTimetable = async (req, res) => {
  try {
    const { timetable } = req.body;
    
    const teacher = await Teacher.findOne({ id: req.params.id });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    teacher.timetable = timetable;
    await teacher.save();
    
    res.json({
      name: teacher.name,
      id: teacher.id,
      timetable: teacher.timetable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authenticate teacher
exports.authenticateTeacher = async (req, res) => {
  try {
    const { id, password } = req.body;
    
    const teacher = await Teacher.findOne({ id });
    
    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, teacher.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      teacher: {
        name: teacher.name,
        id: teacher.id,
        timetable: teacher.timetable
      },
      message: 'Authentication successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 