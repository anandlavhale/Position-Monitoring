import React, { useState } from 'react';
import { useTeachers } from '../context/TeacherContext';
import { useAuth } from '../context/AuthContext';
import { DaySchedule, TimeSlot } from '../types';
import { Calendar, Clock, MapPin, BookOpen, User, CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimetableProps {
  teacherId: string;
}

const Timetable: React.FC<TimetableProps> = ({ teacherId }) => {
  const { teachers, updateTeacherTimetable } = useTeachers();
  const { user, role } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [editingSlot, setEditingSlot] = useState<{ day: string; timeSlot: string } | null>(null);
  const [editFormData, setEditFormData] = useState<{
    subject: string;
    class: string;
    loc: string;
  }>({ subject: '', class: '', loc: '' });
  
  const teacher = teachers.find(t => t.id === teacherId);
  
  if (!teacher) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Teacher not found</p>
      </div>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const handleToggleAvailability = (day: string, timeSlot: string, currentAvailability: "AVAILABLE" | "UNAVAILABLE") => {
    if (role !== 'teacher' || user?.id !== teacherId) return;
    
    const newAvailability = currentAvailability === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    
    // Create a deep copy of the teacher's timetable
    const updatedTimetable = JSON.parse(JSON.stringify(teacher.timetable));
    
    // Update the availability for the specific time slot
    updatedTimetable[day][timeSlot].avail = newAvailability;
    
    // Update the teacher's timetable
    updateTeacherTimetable(teacherId, updatedTimetable);
  };

  const startEditing = (day: string, timeSlot: string, details: TimeSlot) => {
    if (role !== 'teacher' || user?.id !== teacherId) return;
    if (details.subject === "RECESS" || details.subject === "LUNCH") return;
    
    setEditingSlot({ day, timeSlot });
    setEditFormData({
      subject: details.subject === "NONE" ? "" : details.subject,
      class: details.class === "NONE" ? "" : details.class,
      loc: details.loc === "NONE" ? "" : details.loc,
    });
  };

  const cancelEditing = () => {
    setEditingSlot(null);
  };

  const saveChanges = () => {
    if (!editingSlot || !teacher) return;
    
    // Create a deep copy of the teacher's timetable
    const updatedTimetable = JSON.parse(JSON.stringify(teacher.timetable));
    
    // Update the details for the specific time slot
    updatedTimetable[editingSlot.day][editingSlot.timeSlot].subject = editFormData.subject || "NONE";
    updatedTimetable[editingSlot.day][editingSlot.timeSlot].class = editFormData.class || "NONE";
    updatedTimetable[editingSlot.day][editingSlot.timeSlot].loc = editFormData.loc || "STAFF ROOM";
    
    // Update the teacher's timetable
    updateTeacherTimetable(teacherId, updatedTimetable);
    
    // Reset editing state
    setEditingSlot(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTimeSlotColor = (timeSlot: TimeSlot) => {
    if (timeSlot.subject === "RECESS" || timeSlot.subject === "LUNCH") {
      return "bg-gray-100 border-gray-200";
    }
    
    if (timeSlot.avail === "AVAILABLE") {
      return "bg-green-50 border-green-200";
    }
    
    if (timeSlot.subject !== "NONE") {
      return "bg-indigo-50 border-indigo-200";
    }
    
    return "bg-red-50 border-red-200";
  };

  const getTimeSlotIcon = (timeSlot: TimeSlot) => {
    if (timeSlot.subject === "RECESS" || timeSlot.subject === "LUNCH") {
      return <Clock size={16} className="text-gray-500" />;
    }
    
    if (timeSlot.avail === "AVAILABLE") {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    
    if (timeSlot.subject !== "NONE") {
      return <BookOpen size={16} className="text-indigo-500" />;
    }
    
    return <XCircle size={16} className="text-red-500" />;
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-800">{teacher.name}'s Timetable</h2>
            <p className="text-gray-600 text-sm mt-1">
              View schedule and availability for the week
            </p>
          </div>
          {role === 'teacher' && user?.id === teacherId && (
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              You can edit your schedule and availability
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {days.map((day) => (
            <motion.button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-md capitalize whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={16} className="inline-block mr-1" />
              {day}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {teacher.timetable[selectedDay] && Object.entries(teacher.timetable[selectedDay]).map(([timeSlot, details]) => (
            <motion.div
              key={timeSlot}
              className={`border rounded-lg p-4 ${getTimeSlotColor(details)} ${
                role === 'teacher' && user?.id === teacherId && details.subject !== "RECESS" && details.subject !== "LUNCH"
                  ? 'cursor-pointer hover:shadow-md transition-shadow'
                  : ''
              }`}
              whileHover={
                role === 'teacher' && user?.id === teacherId && details.subject !== "RECESS" && details.subject !== "LUNCH"
                  ? { scale: 1.02 }
                  : {}
              }
            >
              {editingSlot && editingSlot.day === selectedDay && editingSlot.timeSlot === timeSlot ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{timeSlot}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={saveChanges}
                        className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text"
                        name="subject"
                        value={editFormData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject Name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
                      <input 
                        type="text"
                        name="class"
                        value={editFormData.class}
                        onChange={handleInputChange}
                        placeholder="Class Name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input 
                        type="text"
                        name="loc"
                        value={editFormData.loc}
                        onChange={handleInputChange}
                        placeholder="Location"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <span className="mr-2">Availability:</span>
                    <button
                      onClick={() => handleToggleAvailability(selectedDay, timeSlot, details.avail)}
                      className={`px-3 py-1 rounded-full ${
                        details.avail === "AVAILABLE"
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {details.avail === "AVAILABLE" ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{timeSlot}</div>
                      <div className="flex items-center mt-2">
                        {getTimeSlotIcon(details)}
                        <span className={`ml-2 text-sm ${
                          details.avail === "AVAILABLE" 
                            ? 'text-green-600' 
                            : details.subject === "RECESS" || details.subject === "LUNCH"
                              ? 'text-gray-600'
                              : 'text-red-600'
                        }`}>
                          {details.avail === "AVAILABLE" 
                            ? 'Available for appointments' 
                            : details.subject === "RECESS" || details.subject === "LUNCH"
                              ? details.subject
                              : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {details.subject !== "NONE" && details.subject !== "RECESS" && details.subject !== "LUNCH" && (
                        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium mr-2">
                          {details.subject} - {details.class}
                        </div>
                      )}
                      
                      {role === 'teacher' && user?.id === teacherId && details.subject !== "RECESS" && details.subject !== "LUNCH" && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(selectedDay, timeSlot, details);
                          }}
                          className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {details.loc !== "NONE" && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {details.loc}
                    </div>
                  )}
                  
                  {role === 'teacher' && user?.id === teacherId && details.subject !== "RECESS" && details.subject !== "LUNCH" && (
                    <div 
                      className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center"
                      onClick={() => handleToggleAvailability(selectedDay, timeSlot, details.avail)}
                    >
                      {details.avail === "AVAILABLE" ? <XCircle size={14} className="mr-1" /> : <CheckCircle size={14} className="mr-1" />}
                      {details.avail === "AVAILABLE" ? 'Mark as unavailable' : 'Mark as available'}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Timetable;