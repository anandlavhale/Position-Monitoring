import React, { useState, useEffect } from 'react';
import { useTeachers } from '../context/TeacherContext';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import { Check, X, Clock, Calendar, User, Mail, MessageSquare, Filter, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const { teachers } = useTeachers();
  const { appointments, loading, error, createAppointment } = useAppointments();
  const { user, role } = useAuth();
  
  const [teacherId, setTeacherId] = useState('');
  const [day, setDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Debug appointments
  useEffect(() => {
    console.log('Current user:', user);
    console.log('All appointments:', appointments);
    
    if (user && role === 'student') {
      const studentAppointments = appointments.filter(app => app.studentId === user.id);
      console.log('Filtered student appointments:', studentAppointments);
    }
  }, [appointments, user, role]);

  // Filter appointments for this student
  const studentAppointments = user && role === 'student' 
    ? appointments.filter(app => app.studentId === user.id)
    : [];
    
  const filteredAppointments = filter === 'all' 
    ? studentAppointments 
    : studentAppointments.filter(app => app.status === filter);

  // Get available time slots for selected teacher and day
  const getAvailableTimeSlots = () => {
    if (!teacherId || !day) return [];
    
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.timetable[day]) return [];
    
    return Object.entries(teacher.timetable[day])
      .filter(([_, details]) => details.avail === "AVAILABLE")
      .map(([slot]) => slot);
  };

  const availableTimeSlots = getAvailableTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || role !== 'student') {
      setFormError('You must be logged in as a student to request appointments');
      return;
    }
    
    // Validate form
    if (!teacherId || !day || !timeSlot || !reason) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Add appointment
    const success = await createAppointment(
      teacherId,
      user.id,
      user.name,
      user.email,
      day,
      timeSlot,
      reason
    );
    
    if (success) {
      // Reset form
      setTeacherId('');
      setDay('');
      setTimeSlot('');
      setReason('');
      setShowForm(false);
      setFormError('');
    }
  };

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center text-xs font-medium"><Clock size={14} className="mr-1" /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center text-xs font-medium"><Check size={14} className="mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center text-xs font-medium"><X size={14} className="mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Request appointment button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-indigo-800">Your Appointments</h2>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancel' : 'Request Appointment'}
        </motion.button>
      </div>
      
      {/* Appointment request form */}
      {showForm && (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Request an Appointment</h3>
          
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="inline mr-1" /> Select Teacher
                </label>
                <select
                  id="teacherId"
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    setTimeSlot(''); // Reset time slot when teacher changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-1" /> Day
                </label>
                <select
                  id="day"
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                    setTimeSlot(''); // Reset time slot when day changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a day</option>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((d) => (
                    <option key={d} value={d} className="capitalize">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="inline mr-1" /> Time Slot
                </label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!teacherId || !day}
                >
                  <option value="">Select a time slot</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {teacherId && day && availableTimeSlots.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">No available time slots for this day</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare size={16} className="inline mr-1" /> Reason for Appointment
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Briefly describe why you need this appointment"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Request
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Appointments list */}
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-800">Your Appointment History</h3>
          
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {user && role === 'student' ? (
          filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const teacher = teachers.find(t => t.id === appointment.teacherId);
                    return (
                      <motion.tr 
                        key={appointment.id} 
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: '#F9FAFB' }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{teacher?.name || 'Unknown Teacher'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{appointment.day}</div>
                          <div className="text-sm text-gray-500">{appointment.timeSlot}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{appointment.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 flex flex-col items-center justify-center text-gray-500">
              <AlertCircle size={48} className="mb-4 text-gray-400" />
              <p>You haven't made any appointment requests yet.</p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Please log in as a student to view your appointment history.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;