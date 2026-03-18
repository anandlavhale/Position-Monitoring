const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Teacher = require('./models/Teacher');

// Load environment variables
dotenv.config();

// Load teachers from JSON file
const teachersFilePath = path.join(__dirname, '../../frontend/public/teachers.json');
const teachersData = JSON.parse(fs.readFileSync(teachersFilePath, 'utf8'));

// Function to generate a simple ID from name
function generateIdFromName(name) {
  if (!name) return 'teacher' + Math.floor(Math.random() * 10000);
  return name.toLowerCase().trim().split(' ').pop().replace(/[^a-z0-9]/g, '');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Clear existing teachers
      await Teacher.deleteMany({});
      console.log('Cleared existing teachers');
      
      // Process teacher data: add missing fields and prepare for database insertion
      const processedTeachers = teachersData.map((teacher, index) => {
        // Add id if missing (use last name or a part of the name if available)
        if (!teacher.id && teacher.name) {
          teacher.id = generateIdFromName(teacher.name);
          console.log(`Generated ID '${teacher.id}' for teacher '${teacher.name}'`);
        } else if (!teacher.id) {
          teacher.id = 'teacher' + (index + 1);
          console.log(`Generated fallback ID '${teacher.id}' for teacher at index ${index}`);
        }
        
        // Add password if missing
        if (!teacher.password) {
          teacher.password = 'password123';
        }
        
        return teacher;
      });
      
      console.log(`Processed ${processedTeachers.length} teacher records`);
      
      // Create teachers with hashed passwords
      const teacherPromises = processedTeachers.map(async (teacherData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacherData.password, salt);
        
        return Teacher.create({
          ...teacherData,
          password: hashedPassword
        });
      });
      
      const teachers = await Promise.all(teacherPromises);
      
      console.log(`${teachers.length} teachers created successfully`);
      
      if (teachers.length > 0) {
        console.log('Sample teacher login credentials:');
        console.log(`ID: ${processedTeachers[0].id}`);
        console.log(`Password: ${processedTeachers[0].password}`);
      }
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
      
      process.exit(0);
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 