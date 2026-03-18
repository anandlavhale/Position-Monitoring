import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword } = useStudents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await forgotPassword(email);
      
      // Always show success message even if email doesn't exist (for security)
      setEmailSent(true);
      toast.success('If your email exists in our system, you will receive password reset instructions.');
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <motion.h2 
            className="text-2xl font-bold text-gray-800"
            variants={itemVariants}
          >
            Forgot Password
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-2"
            variants={itemVariants}
          >
            {emailSent 
              ? "Check your email for password reset instructions"
              : "Enter your email to receive password reset instructions"}
          </motion.p>
        </div>

        {emailSent ? (
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-700">
                Password reset instructions have been sent to <strong>{email}</strong>.
                Please check your email (including spam/junk folder) and follow the instructions.
              </p>
            </div>
            
            <Link 
              to="/login" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 mt-4"
            >
              Return to Login
            </Link>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail size={16} className="mr-2" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Enter your email"
              />
            </motion.div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.div className="flex justify-between items-center" variants={itemVariants}>
              <Link 
                to="/login" 
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Back to Login
              </Link>
              
              <motion.button
                type="submit"
                className={`${
                  isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white font-medium py-2 px-4 rounded-md transition duration-300`}
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage; 