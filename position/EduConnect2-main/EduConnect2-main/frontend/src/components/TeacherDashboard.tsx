import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { Appointment } from '../types';
import { Check, X, Clock, AlertCircle, Filter, Search, Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Debug appointments
  useEffect(() => {
    console.log('Current teacher:', user);
    console.log('All appointments:', appointments);
    
    if (user) {
      const teacherAppointments = appointments.filter(app => app.teacherId === user.id);
      console.log('Filtered teacher appointments:', teacherAppointments);
    }
  }, [appointments, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter appointments for this teacher
  const teacherAppointments = appointments.filter(app => app.teacherId === user.id);
  
  const filteredAppointments = teacherAppointments
    .filter(app => filter === 'all' || app.status === filter)
    .filter(app => 
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleApprove = async (appointmentId: string) => {
    const success = await updateAppointmentStatus(appointmentId, 'approved');
    if (!success) {
      toast.error('Failed to approve appointment');
    }
  };

  const handleReject = async (appointmentId: string) => {
    const success = await updateAppointmentStatus(appointmentId, 'rejected');
    if (!success) {
      toast.error('Failed to reject appointment');
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
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
      {/* Schedule Management Tip */}
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-blue-100 p-2 rounded-full text-blue-500">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-medium text-blue-800">Manage Your Schedule</h3>
          <p className="text-sm text-blue-600 mt-1">
            You can now edit your class information, subjects, and location in the Timetable section. 
            Go to the "View Schedule" page to customize your weekly schedule and availability.
          </p>
        </div>
      </motion.div>

      {/* Appointments Section */}
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Appointment Requests</h2>
        
        {appointments.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center justify-center text-gray-500">
            <AlertCircle size={48} className="mb-4 text-gray-400" />
            <p>You don't have any appointment requests yet.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex mb-0 space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                <motion.button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    filter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Requests
                </motion.button>
                <motion.button 
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    filter === 'pending' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pending
                </motion.button>
                <motion.button 
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    filter === 'approved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-50 hover:bg-green-100 text-green-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Approved
                </motion.button>
                <motion.button 
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    filter === 'rejected' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-50 hover:bg-red-100 text-red-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Rejected
                </motion.button>
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <motion.tr 
                      key={appointment.id} 
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{appointment.studentName}</div>
                          <div className="text-sm text-gray-500">{appointment.studentEmail}</div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.status === 'pending' && (
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => handleApprove(appointment.id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Check size={16} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleReject(appointment.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;