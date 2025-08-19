import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Load tasks with current filters
  const loadTasks = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters
      };

      const response = await apiService.getAllTasks(params);
      
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.message);
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load task statistics
  const loadStats = async () => {
    try {
      const response = await apiService.getTaskStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load task stats:', error);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createTask(taskData);
      
      // Add the new task to the list
      setTasks(prevTasks => [response.data.task, ...prevTasks]);
      
      // Reload stats
      await loadStats();
      
      return { success: true, task: response.data.task };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateTask(id, taskData);
      
      // Update the task in the list
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? response.data.task : task
        )
      );
      
      // Reload stats
      await loadStats();
      
      return { success: true, task: response.data.task };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deleteTask(id);
      
      // Remove the task from the list
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      // Reload stats
      await loadStats();
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get a single task by ID
  const getTaskById = async (id) => {
    try {
      const response = await apiService.getTaskById(id);
      return { success: true, task: response.data.task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Change page
  const changePage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load initial data
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  // Reload tasks when filters change
  useEffect(() => {
    loadTasks(pagination.currentPage);
  }, [filters, pagination.currentPage]);

  const value = {
    // State
    tasks,
    loading,
    error,
    stats,
    filters,
    pagination,
    
    // Actions
    loadTasks,
    loadStats,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    updateFilters,
    clearFilters,
    changePage,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 