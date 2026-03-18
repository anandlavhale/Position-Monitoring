import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherList from './TeacherList';
import Timetable from './Timetable';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { LogOut, Calendar, ClipboardList, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import AnimatedLogo from '../animated new.json';

const Dashboard: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(user?.id || '');
  const [activeTab, setActiveTab] = useState<'timetable' | 'appointments'>('timetable');

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-16 h-16 mr-2">
              <Lottie 
                animationData={AnimatedLogo} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <h1 className="text-2xl font-bold">Faculty Timetable Portal</h1>
          </div>
          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-2">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs opacity-80 capitalize">{role} Account</p>
              </div>
            </div>
            <motion.button 
              onClick={handleLogout}
              className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <motion.button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center px-4 py-2 mr-4 ${
              activeTab === 'timetable'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Calendar size={18} className="mr-2" />
            Timetables
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center px-4 py-2 ${
              activeTab === 'appointments'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <ClipboardList size={18} className="mr-2" />
            Appointments
          </motion.button>
        </div>

        {activeTab === 'timetable' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <TeacherList onSelectTeacher={handleSelectTeacher} />
            </div>
            <div className="lg:col-span-3">
              {selectedTeacherId ? (
                <Timetable teacherId={selectedTeacherId} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Select a teacher to view their timetable</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {role === 'teacher' ? (
              <TeacherDashboard />
            ) : (
              <StudentDashboard />
            )}
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Faculty Timetable Portal. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-1">A modern platform for faculty-student scheduling</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;