# Education Web3 Backend

This is the backend for the Education Web3 application, built with Node.js, Express, and MongoDB.

## Setup

1. Install MongoDB on your system if you haven't already.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/education-web3
   JWT_SECRET=your_jwt_secret_key
   ```

## Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create a new teacher
- `PUT /api/teachers/:id/timetable` - Update teacher timetable
- `POST /api/teachers/auth` - Authenticate teacher

### Students
- `GET /api/students` - Get all students
- `GET /api/students/id/:id` - Get student by ID
- `GET /api/students/email/:email` - Get student by email
- `POST /api/students/register` - Register a new student
- `POST /api/students/login` - Login student

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/teacher/:teacherId` - Get appointments by teacher ID
- `GET /api/appointments/student/:studentId` - Get appointments by student ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment 