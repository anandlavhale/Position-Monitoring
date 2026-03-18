import React, { createContext, useState, useContext, useEffect } from 'react';
import { Teacher, Student, UserRole } from '../types';

interface AuthContextType {
  user: Teacher | Student | null;
  role: UserRole;
  login: (user: Teacher | Student | null, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Teacher | Student | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role') as UserRole;
    
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user: Teacher | Student | null, userRole: UserRole) => {
    setUser(user);
    setRole(userRole);
    setIsAuthenticated(true);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', userRole || '');
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};