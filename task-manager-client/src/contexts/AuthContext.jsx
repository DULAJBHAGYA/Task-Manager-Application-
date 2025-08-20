import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import websocketService from '../services/websocket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          apiService.setToken(token);
          const response = await apiService.getCurrentUser();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        apiService.setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Signup function
  const signup = async (userData) => {
    try {
      setError(null);
      const response = await apiService.signup(userData);
      const { user: newUser, token } = response.data;
      
      apiService.setToken(token);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Signin function
  const signin = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.signin(credentials);
      const { user: loggedInUser, token } = response.data;
      
      apiService.setToken(token);
      setUser(loggedInUser);
      
      return { success: true, user: loggedInUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.setToken(null);
      setUser(null);
      setError(null);
      websocketService.disconnect();
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await apiService.updateUserProfile(userData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 