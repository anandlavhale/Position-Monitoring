import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TeacherProvider } from './context/TeacherContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { StudentProvider } from './context/StudentContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import LoginSelection from './components/LoginSelection';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

// Protected route component that redirects to home if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    setIsAuth(storedUser && storedRole ? true : isAuthenticated);
    setIsLoading(false);
  }, [isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/login-selection" element={<LoginSelection />} />
    <Route path="/login" element={<LoginPage role="student" />} />
    <Route path="/teacher-login" element={<LoginPage role="teacher" />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <Router>
      <TeacherProvider>
        <StudentProvider>
          <AuthProvider>
            <AppointmentProvider>
              <Toaster 
                position="top-right" 
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }} 
              />
              <AppRoutes />
            </AppointmentProvider>
          </AuthProvider>
        </StudentProvider>
      </TeacherProvider>
    </Router>
  );
}

export default App;