import React, { createContext, useState, useContext, useEffect } from 'react';
import { Teacher, Timetable } from '../types';
import { teacherApi } from '../services/api';
import toast from 'react-hot-toast';

interface TeacherContextType {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  getTeacherById: (id: string) => Promise<Teacher | undefined>;
  authenticateTeacher: (id: string, password: string) => Promise<{ success: boolean; teacher?: Teacher; message: string }>;
  updateTeacherTimetable: (id: string, timetable: Timetable) => Promise<boolean>;
}

const TeacherContext = createContext<TeacherContextType>({
  teachers: [],
  loading: false,
  error: null,
  getTeacherById: async () => undefined,
  authenticateTeacher: async () => ({ success: false, message: '' }),
  updateTeacherTimetable: async () => false,
});

export const useTeachers = () => useContext(TeacherContext);

export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load teachers from API
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const data = await teacherApi.getAllTeachers();
        setTeachers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to fetch teachers');
        toast.error('Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getTeacherById = async (id: string): Promise<Teacher | undefined> => {
    try {
      return await teacherApi.getTeacherById(id);
    } catch (err) {
      console.error('Error fetching teacher by ID:', err);
      return undefined;
    }
  };

  const authenticateTeacher = async (id: string, password: string): Promise<{ success: boolean; teacher?: Teacher; message: string }> => {
    try {
      return await teacherApi.authenticateTeacher(id, password);
    } catch (err) {
      console.error('Error authenticating teacher:', err);
      return { success: false, message: 'Authentication failed' };
    }
  };

  const updateTeacherTimetable = async (id: string, timetable: Timetable): Promise<boolean> => {
    try {
      const updatedTeacher = await teacherApi.updateTeacherTimetable(id, timetable);
      
      // Update the teacher in the local state
      setTeachers(prev => 
        prev.map(teacher => 
          teacher.id === id ? { ...teacher, timetable } : teacher
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating teacher timetable:', err);
      toast.error('Failed to update timetable');
      return false;
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        teachers,
        loading,
        error,
        getTeacherById,
        authenticateTeacher,
        updateTeacherTimetable,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};