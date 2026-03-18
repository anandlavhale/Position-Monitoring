import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeachers } from '../context/TeacherContext';
import { useStudents } from '../context/StudentContext';
import { UserRole } from '../types';
import { School, User, Mail, Lock, UserPlus, LogIn, ArrowLeft, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { teacherApi } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { config } from '../config/env';

interface LoginPageProps {
  role?: UserRole;
}

const LoginPage: React.FC<LoginPageProps> = ({ role: initialRole }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resendingCode, setResendingCode] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { teachers } = useTeachers();
  const { registerStudent, authenticateStudent, checkEmailExists, sendVerificationCode } = useStudents();

  // Set initial role based on URL path
  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    
    // Update URL based on selected role
    if (role === 'student') {
      navigate('/login', { replace: true });
    } else if (role === 'teacher') {
      navigate('/teacher-login', { replace: true });
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentEmail || !studentPassword) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const result = await authenticateStudent(studentEmail, studentPassword);
      
      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.student) {
        login(result.student, 'student');
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    }
  };

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !studentEmail || !studentPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!studentEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (studentPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (studentPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Check if email already exists
      const emailCheck = await checkEmailExists(studentEmail);
      
      if (emailCheck.exists) {
        setError('This email is already registered. Please use a different email or login.');
        return;
      }
      
      // Register the student first
      const registerResult = await registerStudent(studentName, studentEmail, studentPassword);
      
      if (!registerResult.success) {
        setError(registerResult.message || 'Failed to register');
        return;
      }
      
      // Get the verification code from the registration response
      if (registerResult.verificationCode) {
        setVerificationCode(registerResult.verificationCode);
        setVerificationStep(true);
        setError('');
        toast.success(`Registration successful! Please check your email for the verification code. For development, the code is: ${registerResult.verificationCode}`);
      } else {
        // If no verification code in response, try to send one
        const result = await sendVerificationCode(studentEmail);
        
        if (!result.success) {
          setError(result.message || 'Failed to send verification code');
          return;
        }
        
        setVerificationStep(true);
        setError('');
        toast.success(`Verification code sent to ${studentEmail}. Please check your email.`);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again.');
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enteredCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      // Call the verify email endpoint
      const response = await fetch(`${config.apiUrl}/students/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: studentEmail, 
          code: enteredCode 
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Invalid verification code');
        return;
      }

      toast.success('Email verified successfully! You can now log in.');
      setIsRegistering(false);
      setVerificationStep(false);
      setStudentName('');
      setStudentEmail('');
      setStudentPassword('');
      setConfirmPassword('');
      setEnteredCode('');
      setVerificationCode('');
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify email. Please try again.');
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !studentEmail || !studentPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!studentEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (studentPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (studentPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await registerStudent(studentName, studentEmail, studentPassword);
      
      if (!result.success) {
        setError(result.message);
        return;
      }

      toast.success('Registration successful! Please log in.');
      setIsRegistering(false);
      setStudentName('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again.');
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherId || !password) {
      setError('Please enter both ID and password');
      return;
    }

    try {
      const result = await teacherApi.authenticateTeacher(teacherId, password);
      
      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.teacher) {
        login(result.teacher, 'teacher');
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    }
  };

  const handleBack = () => {
    if (verificationStep) {
      setVerificationStep(false);
    } else {
      // Navigate back to login selection page
      navigate('/login-selection');
    }
  };

  const handleGoHome = () => {
    // Navigate to home page
    navigate('/', { replace: true });
  };

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
        <motion.h1 
          className="text-3xl font-bold text-center text-indigo-800 mb-6"
          variants={itemVariants}
        >
          Faculty Timetable Portal
        </motion.h1>
        
        <motion.button
          onClick={handleGoHome}
          className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Go to Home Page"
        >
          <Home size={24} />
        </motion.button>
        
        {!selectedRole ? (
          <div className="space-y-6">
            <motion.p 
              className="text-gray-600 text-center mb-6"
              variants={itemVariants}
            >
              Please select your role to continue
            </motion.p>
            
            <motion.button 
              onClick={() => handleRoleSelect('student')}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <User size={20} />
              <span>Login as Student</span>
            </motion.button>
            
            <motion.button 
              onClick={() => handleRoleSelect('teacher')}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <School size={20} />
              <span>Login as Teacher</span>
            </motion.button>
          </div>
        ) : selectedRole === 'student' ? (
          <div className="space-y-6">
            {!isRegistering ? (
              <>
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  variants={itemVariants}
                >
                  Login to access teacher schedules and manage your appointments
                </motion.p>
                
                <motion.form 
                  onSubmit={handleStudentLogin} 
                  className="space-y-4"
                  variants={itemVariants}
                >
                  <div>
                    <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail size={16} className="mr-2" />
                      Email Address
                    </label>
                    <input
                      id="studentEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Lock size={16} className="mr-2" />
                      Password
                    </label>
                    <input
                      id="studentPassword"
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter your password"
                    />
                    <div className="flex justify-end mt-1">
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <motion.button 
                    type="submit"
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </motion.button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Register
                      </button>
                    </p>
                  </div>
                </motion.form>
              </>
            ) : verificationStep ? (
              <>
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  variants={itemVariants}
                >
                  Enter the verification code sent to your email
                </motion.p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start">
                  <AlertCircle size={20} className="text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    A verification code has been sent to <strong>{studentEmail}</strong>. 
                    Please check your email and enter the code below to verify your account.
                  </p>
                </div>
                
                <p className="text-xs text-gray-600 mb-4">
                  Didn't receive the code? Check your spam folder or click the "Resend Verification Code" button below to get a new code.
                </p>
                
                <motion.form 
                  onSubmit={handleVerifyAndRegister} 
                  className="space-y-4"
                  variants={itemVariants}
                >
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <motion.button 
                    type="submit"
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Verify & Complete Registration
                  </motion.button>
                  
                  <motion.button 
                    type="button"
                    onClick={async () => {
                      try {
                        setResendingCode(true);
                        setCodeResent(false);
                        setError('');
                        
                        const result = await sendVerificationCode(studentEmail);
                        
                        if (result.success) {
                          setCodeResent(true);
                          toast.success(`New verification code sent to ${studentEmail}. Please check your email.`);
                        } else {
                          setError(result.message || 'Failed to resend verification code');
                        }
                      } catch (err) {
                        console.error('Error resending verification code:', err);
                        setError('Failed to resend verification code');
                      } finally {
                        setResendingCode(false);
                      }
                    }}
                    className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-blue-600 py-2 px-4 rounded-lg border border-blue-200 transition duration-300 mt-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={resendingCode}
                  >
                    {resendingCode ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Mail size={18} className="mr-2" />
                        Resend Verification Code
                      </>
                    )}
                  </motion.button>
                  
                  {codeResent && (
                    <p className="text-xs text-green-600 text-center mt-2 flex items-center justify-center">
                      <CheckCircle size={14} className="mr-1" />
                      New verification code sent. Please check your email.
                    </p>
                  )}
                </motion.form>
              </>
            ) : (
              <>
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  variants={itemVariants}
                >
                  Create a new student account
                </motion.p>
                
                <motion.form 
                  onSubmit={handleSendVerificationCode} 
                  className="space-y-4"
                  variants={itemVariants}
                >
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User size={16} className="mr-2" />
                      Full Name
                    </label>
                    <input
                      id="studentName"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail size={16} className="mr-2" />
                      Email Address
                    </label>
                    <input
                      id="registerEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Lock size={16} className="mr-2" />
                      Password
                    </label>
                    <input
                      id="registerPassword"
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Create a password"
                    />
                  </div>
                  
                  <div>
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
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <motion.button 
                    type="submit"
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail size={18} className="mr-2" />
                    Send Verification Code
                  </motion.button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </motion.form>
              </>
            )}
            
            <motion.button 
              type="button"
              onClick={handleBack}
              className="w-full flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.p 
              className="text-gray-600 text-center mb-4"
              variants={itemVariants}
            >
              Enter your teacher credentials to login
            </motion.p>
            
            <motion.form 
              onSubmit={handleTeacherLogin} 
              className="space-y-4"
              variants={itemVariants}
            >
              <div>
                <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User size={16} className="mr-2" />
                  Teacher ID
                </label>
                <input
                  id="teacherId"
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Enter your ID"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Lock size={16} className="mr-2" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <motion.button 
                type="submit"
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </motion.button>
              
              <motion.button 
                type="button"
                onClick={handleBack}
                className="w-full flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </motion.button>
            </motion.form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;