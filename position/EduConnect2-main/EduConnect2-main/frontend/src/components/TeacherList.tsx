import React from 'react';
import { useTeachers } from '../context/TeacherContext';
import { useAuth } from '../context/AuthContext';
import { User, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherList: React.FC<{ onSelectTeacher: (teacherId: string) => void }> = ({ onSelectTeacher }) => {
  const { teachers, loading, error } = useTeachers();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-red-500 p-4 text-center">{error}</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-indigo-800">Faculty Members</h2>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <motion.button
              key={teacher.id}
              onClick={() => onSelectTeacher(teacher.id)}
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                user && user.id === teacher.id && role === 'teacher'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02, backgroundColor: '#EEF2FF' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <User className="text-indigo-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium">{teacher.name}</p>
                {role === 'teacher' && user && user.id === teacher.id && (
                  <p className="text-xs text-indigo-600">Your schedule</p>
                )}
              </div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No faculty members found
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherList;