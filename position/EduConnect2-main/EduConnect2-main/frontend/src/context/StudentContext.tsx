import React, { createContext, useState, useContext, useEffect } from 'react';
import { Student } from '../types';
import { studentApi } from '../services/api';
import toast from 'react-hot-toast';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  registerStudent: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; verificationCode?: string }>;
  getStudentByEmail: (email: string) => Promise<Student | undefined>;
  getStudentById: (id: string) => Promise<Student | undefined>;
  authenticateStudent: (email: string, password: string) => Promise<{ success: boolean; student?: Student; message: string }>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean }>;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; code?: string; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const StudentContext = createContext<StudentContextType>({
  students: [],
  loading: false,
  error: null,
  registerStudent: async () => ({ success: false, message: '', verificationCode: undefined }),
  getStudentByEmail: async () => undefined,
  getStudentById: async () => undefined,
  authenticateStudent: async () => ({ success: false, message: '' }),
  checkEmailExists: async () => ({ exists: false }),
  sendVerificationCode: async () => ({ success: false, message: '' }),
  forgotPassword: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false, message: '' }),
});

export const useStudents = () => useContext(StudentContext);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load students from API
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await studentApi.getAllStudents();
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students');
        toast.error('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getStudentByEmail = async (email: string): Promise<Student | undefined> => {
    try {
      return await studentApi.getStudentByEmail(email);
    } catch (err) {
      console.error('Error fetching student by email:', err);
      return undefined;
    }
  };

  const getStudentById = async (id: string): Promise<Student | undefined> => {
    try {
      return await studentApi.getStudentById(id);
    } catch (err) {
      console.error('Error fetching student by ID:', err);
      return undefined;
    }
  };

  const checkEmailExists = async (email: string): Promise<{ exists: boolean }> => {
    try {
      return await studentApi.checkEmailExists(email);
    } catch (err) {
      console.error('Error checking if email exists:', err);
      return { exists: false };
    }
  };

  const sendVerificationCode = async (email: string): Promise<{ success: boolean; code?: string; message: string }> => {
    try {
      return await studentApi.sendVerificationCode(email);
    } catch (err) {
      console.error('Error sending verification code:', err);
      return { success: false, message: 'Failed to send verification code' };
    }
  };

  const registerStudent = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string; verificationCode?: string }> => {
    try {
      const response = await studentApi.registerStudent(name, email, password);
      
      if (response.success && response.student) {
        setStudents(prev => [...prev, response.student!]);
      }
      
      return { success: response.success, message: response.message, verificationCode: response.verificationCode };
    } catch (err) {
      console.error('Error registering student:', err);
      return { success: false, message: 'Registration failed' };
    }
  };

  const authenticateStudent = async (email: string, password: string): Promise<{ success: boolean; student?: Student; message: string }> => {
    try {
      return await studentApi.authenticateStudent(email, password);
    } catch (err) {
      console.error('Error authenticating student:', err);
      return { success: false, message: 'Authentication failed' };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await studentApi.forgotPassword(email);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      return { success: false, message: 'Failed to request password reset' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await studentApi.resetPassword(token, newPassword);
    } catch (err) {
      console.error('Error resetting password:', err);
      return { success: false, message: 'Failed to reset password' };
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        registerStudent,
        getStudentByEmail,
        getStudentById,
        authenticateStudent,
        checkEmailExists,
        sendVerificationCode,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};