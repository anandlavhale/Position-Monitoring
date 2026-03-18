const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// GET /api/teachers - Get all teachers
router.get('/', teacherController.getAllTeachers);

// GET /api/teachers/:id - Get teacher by ID
router.get('/:id', teacherController.getTeacherById);

// POST /api/teachers - Create a new teacher
router.post('/', teacherController.createTeacher);

// PUT /api/teachers/:id/timetable - Update teacher timetable
router.put('/:id/timetable', teacherController.updateTeacherTimetable);

// POST /api/teachers/auth - Authenticate teacher
router.post('/auth', teacherController.authenticateTeacher);

module.exports = router; 