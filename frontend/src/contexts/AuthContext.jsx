import React, { createContext, useContext, useEffect, useState } from 'react';

import axiosInstance from '../utils/axiosConfig';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);

      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setError('');
      setLoading(true);

      const response = await axiosInstance.post('/auth/signup', {
        username,
        email,
        password
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove token from axios headers
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
