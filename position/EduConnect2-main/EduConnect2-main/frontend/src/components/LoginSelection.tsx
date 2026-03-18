import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import AnimatedLogo from '../animated new.json';

const LoginSelection: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-black/50 backdrop-blur-sm"></div>
      
      <motion.div 
        className="bg-white/90 p-8 rounded-lg shadow-2xl w-full max-w-md backdrop-blur-sm z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <motion.div 
            className="w-32 h-32 mb-3"
            variants={itemVariants}
          >
            <Lottie 
              animationData={AnimatedLogo} 
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-center text-indigo-800 mb-2"
            variants={itemVariants}
          >
            Faculty Timetable Portal
          </motion.h1>
        </div>

        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Go to Home Page"
        >
          <Home size={24} />
        </motion.button>
        
        <div className="space-y-6">
          <motion.p 
            className="text-gray-600 text-center mb-6"
            variants={itemVariants}
          >
            Please select your role to continue
          </motion.p>
          
          <motion.button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <User size={20} />
            <span>Login as Student</span>
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/teacher-login')}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <School size={20} />
            <span>Login as Teacher</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSelection; 