import { Teacher, Student, Appointment } from '../types';
import { config } from '../config/env';

const API_URL = config.apiUrl;

// Teacher API
export const teacherApi = {
  // Get all teachers
  getAllTeachers: async (): Promise<Teacher[]> => {
    const response = await fetch(`${API_URL}/teachers`);
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    return response.json();
  },

  // Get teacher by ID
  getTeacherById: async (id: string): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch teacher');
    }
    return response.json();
  },

  // Create a new teacher
  createTeacher: async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacher),
    });
    if (!response.ok) {
      throw new Error('Failed to create teacher');
    }
    return response.json();
  },

  // Update teacher timetable
  updateTeacherTimetable: async (id: string, timetable: Teacher['timetable']): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers/${id}/timetable`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timetable }),
    });
    if (!response.ok) {
      throw new Error('Failed to update timetable');
    }
    return response.json();
  },

  // Authenticate teacher
  authenticateTeacher: async (id: string, password: string): Promise<{ success: boolean; teacher?: Teacher; message: string }> => {
    const response = await fetch(`${API_URL}/teachers/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });
    return response.json();
  },
};

// Student API
export const studentApi = {
  // Get all students
  getAllStudents: async (): Promise<Student[]> => {
    const response = await fetch(`${API_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<Student> => {
    const response = await fetch(`${API_URL}/students/id/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }
    return response.json();
  },

  // Get student by email
  getStudentByEmail: async (email: string): Promise<Student> => {
    const response = await fetch(`${API_URL}/students/email/${email}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }
    return response.json();
  },

  // Check if email exists
  checkEmailExists: async (email: string): Promise<{ exists: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/students/check-email/${email}`);
      if (!response.ok) {
        return { exists: false };
      }
      return response.json();
    } catch (error) {
      console.error("Error checking email:", error);
      return { exists: false };
    }
  },

  // Send verification code (in a real app, this would send an email)
  sendVerificationCode: async (email: string): Promise<{ success: boolean; code?: string; message: string }> => {
    try {
      // Call the backend to send a verification code
      const response = await fetch(`${API_URL}/students/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      // For development, we'll also return the verification code from the registration response
      return {
        success: data.success,
        message: data.message || 'Verification code sent successfully'
      };
    } catch (error) {
      console.error("Error sending verification code:", error);
      return { 
        success: false, 
        message: 'Failed to send verification code' 
      };
    }
  },

  // Register a new student
  registerStudent: async (name: string, email: string, password: string): Promise<{ success: boolean; student?: Student; message: string; verificationCode?: string }> => {
    const response = await fetch(`${API_URL}/students/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  // Authenticate student
  authenticateStudent: async (email: string, password: string): Promise<{ success: boolean; student?: Student; message: string }> => {
    const response = await fetch(`${API_URL}/students/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/students/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return await response.json();
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return { 
        success: false, 
        message: 'Failed to send password reset request' 
      };
    }
  },
  
  // Reset Password
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/students/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      return await response.json();
    } catch (error) {
      console.error("Error resetting password:", error);
      return { 
        success: false, 
        message: 'Failed to reset password' 
      };
    }
  },
};

// Appointment API
export const appointmentApi = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  // Get appointments by teacher ID
  getAppointmentsByTeacherId: async (teacherId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments/teacher/${teacherId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  // Get appointments by student ID
  getAppointmentsByStudentId: async (studentId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments/student/${studentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  // Create a new appointment
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Promise<Appointment> => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    return response.json();
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, status: Appointment['status']): Promise<Appointment> => {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update appointment status');
    }
    return response.json();
  },
};

// Contact API
export const contactApi = {
  // Submit contact form
  submitContactForm: async (name: string, email: string, subject: string, message: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });
    return response.json();
  },
}; 