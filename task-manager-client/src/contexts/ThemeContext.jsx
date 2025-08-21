import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user, updateSettings } = useAuth();
  const [theme, setTheme] = useState('light');

  // Initialize theme from user preferences or system preference
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update Tailwind's dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (user?.theme === 'auto') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user?.theme]);

  // Change theme function
  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    
    // Update user settings if user is logged in
    if (user) {
      try {
        await updateSettings({ theme: newTheme });
      } catch (error) {
        console.error('Failed to update theme setting:', error);
      }
    }
  };

  const value = {
    theme,
    changeTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isAuto: theme === 'auto'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 