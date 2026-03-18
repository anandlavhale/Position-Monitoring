import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appointment } from '../types';
import { useAuth } from './AuthContext';
import { appointmentApi } from '../services/api';
import toast from 'react-hot-toast';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (teacherId: string, studentId: string, studentName: string, studentEmail: string, day: string, timeSlot: string, reason: string) => Promise<boolean>;
  updateAppointmentStatus: (appointmentId: string, status: "pending" | "approved" | "rejected") => Promise<boolean>;
  getAppointmentsByTeacherId: (teacherId: string) => Promise<Appointment[]>;
  getAppointmentsByStudentId: (studentId: string) => Promise<Appointment[]>;
}

const AppointmentContext = createContext<AppointmentContextType>({
  appointments: [],
  loading: false,
  error: null,
  createAppointment: async () => false,
  updateAppointmentStatus: async () => false,
  getAppointmentsByTeacherId: async () => [],
  getAppointmentsByStudentId: async () => [],
});

export const useAppointments = () => useContext(AppointmentContext);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, role } = useAuth();

  useEffect(() => {
    // Load appointments from API based on user role
    const fetchAppointments = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        let data: Appointment[] = [];
        
        console.log('Fetching appointments for user:', user.id, 'with role:', role);
        
        if (role === 'teacher') {
          console.log('Fetching teacher appointments');
          data = await appointmentApi.getAppointmentsByTeacherId(user.id);
        } else if (role === 'student') {
          console.log('Fetching student appointments');
          data = await appointmentApi.getAppointmentsByStudentId(user.id);
        } else {
          console.log('Fetching all appointments');
          data = await appointmentApi.getAllAppointments();
        }
        
        console.log('Appointments fetched:', data);
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments');
        toast.error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, role]);

  const createAppointment = async (
    teacherId: string,
    studentId: string,
    studentName: string,
    studentEmail: string,
    day: string,
    timeSlot: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const newAppointment = await appointmentApi.createAppointment({
        teacherId,
        studentId,
        studentName,
        studentEmail,
        day,
        timeSlot,
        reason,
      });
      
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('Appointment created successfully');
      return true;
    } catch (err) {
      console.error('Error creating appointment:', err);
      toast.error('Failed to create appointment');
      return false;
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<boolean> => {
    try {
      const updatedAppointment = await appointmentApi.updateAppointmentStatus(appointmentId, status);
      
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId ? { ...appointment, status } : appointment
        )
      );
      
      toast.success(`Appointment ${status}`);
      return true;
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast.error('Failed to update appointment status');
      return false;
    }
  };

  const getAppointmentsByTeacherId = async (teacherId: string): Promise<Appointment[]> => {
    try {
      return await appointmentApi.getAppointmentsByTeacherId(teacherId);
    } catch (err) {
      console.error('Error fetching appointments by teacher ID:', err);
      return [];
    }
  };

  const getAppointmentsByStudentId = async (studentId: string): Promise<Appointment[]> => {
    try {
      return await appointmentApi.getAppointmentsByStudentId(studentId);
    } catch (err) {
      console.error('Error fetching appointments by student ID:', err);
      return [];
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        createAppointment,
        updateAppointmentStatus,
        getAppointmentsByTeacherId,
        getAppointmentsByStudentId,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};