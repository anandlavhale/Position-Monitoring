import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useStudents();

  // Check if token is provided
  useEffect(() => {
    if (!token) {
      setError('Reset token is missing. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('Reset token is missing. Please request a new password reset link.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword(token, newPassword);
      
      if (result.success) {
        setResetSuccess(true);
        toast.success('Password reset successful!');
      } else {
        setError(result.message || 'Failed to reset password. The token may be invalid or expired.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
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
            Reset Password
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-2"
            variants={itemVariants}
          >
            {resetSuccess 
              ? "Your password has been reset successfully"
              : "Create a new password for your account"}
          </motion.p>
        </div>

        {resetSuccess ? (
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-700">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
            </div>
            
            <Link 
              to="/login" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 mt-4"
            >
              Go to Login
            </Link>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Lock size={16} className="mr-2" />
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Enter new password"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Lock size={16} className="mr-2" />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Confirm new password"
              />
            </motion.div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.div className="flex justify-between items-center" variants={itemVariants}>
              <Link 
                to="/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Request New Link
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
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage; 