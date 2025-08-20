import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import FiltersAndSearch from '../components/FiltersAndSearch';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import EditTaskForm from '../components/EditTaskForm';
import { useTasks } from '../contexts/TaskContext';

const DashboardPage = () => {
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    loadTasks,
    filters,
    updateFilters
  } = useTasks();

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tasks are automatically loaded by TaskContext on mount

  const addTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowAddTask(false);
    } else {
      alert('Failed to create task: ' + result.error);
    }
  };

  const updateTaskHandler = async (taskId, updatedData) => {
    const result = await updateTask(taskId, updatedData);
    if (result.success) {
      setEditingTask(null);
    } else {
      alert('Failed to update task: ' + result.error);
    }
  };

  const deleteTaskHandler = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (!result.success) {
        alert('Failed to delete task: ' + result.error);
      }
    }
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    const result = await updateTask(taskId, { status: newStatus });
    if (!result.success) {
      alert('Failed to update task status: ' + result.error);
    }
  };

  // Handle filter changes
  const handleSearchChange = (value) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value) => {
    updateFilters({ status: value === 'all' ? '' : value });
  };

  const handleSortChange = (value) => {
    let sortBy = 'createdAt';
    let sortOrder = 'DESC';
    
    if (value === 'status') {
      sortBy = 'status';
      sortOrder = 'ASC';
    } else if (value === 'priority') {
      sortBy = 'priority';
      sortOrder = 'DESC';
    }
    
    updateFilters({ sortBy, sortOrder });
  };

  // Use tasks directly from context (they're already filtered by the backend)
  const filteredTasks = tasks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <TopBar setSidebarOpen={setSidebarOpen} setShowAddTask={setShowAddTask} />

        {/* Error Display */}
        {error && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => window.location.reload()}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading tasks...
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <FiltersAndSearch 
          searchTerm={filters.search}
          setSearchTerm={handleSearchChange}
          statusFilter={filters.status || 'all'}
          setStatusFilter={handleStatusFilterChange}
          sortBy={filters.sortBy === 'createdAt' ? 'date' : filters.sortBy}
          setSortBy={handleSortChange}
        />

        {/* Task List */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <TaskList 
            filteredTasks={filteredTasks}
            setEditingTask={setEditingTask}
            deleteTask={deleteTaskHandler}
            changeTaskStatus={changeTaskStatus}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Task</h3>
            </div>
            <AddTaskForm onSubmit={addTask} onCancel={() => setShowAddTask(false)} />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
            </div>
            <EditTaskForm 
              task={editingTask} 
              onSubmit={updateTaskHandler} 
              onCancel={() => setEditingTask(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 