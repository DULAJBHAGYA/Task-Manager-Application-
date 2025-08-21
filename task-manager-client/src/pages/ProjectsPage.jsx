import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useProjects } from '../contexts/ProjectContext';
import apiService from '../services/api';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../contexts/AuthContext';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject,
    filters,
    updateFilters
  } = useProjects();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [logoutConfirmModal, setLogoutConfirmModal] = useState({ isOpen: false });
  const { logout } = useAuth();

  // Handle filter changes
  const handleSearchChange = (value) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value) => {
    updateFilters({ status: value === 'all' ? '' : value });
  };

  const addProject = async (projectData) => {
    const result = await createProject(projectData);
    if (result.success) {
      setShowAddProject(false);
      setModal({
        isOpen: true,
        title: 'Success!',
        message: 'Project created successfully.',
        type: 'success'
      });
    } else {
      setModal({
        isOpen: true,
        title: 'Error',
        message: `Failed to create project: ${result.error}`,
        type: 'error'
      });
    }
  };

  const updateProjectHandler = async (projectId, updatedData) => {
    const result = await updateProject(projectId, updatedData);
    if (result.success) {
      setEditingProject(null);
      setModal({
        isOpen: true,
        title: 'Success!',
        message: 'Project updated successfully.',
        type: 'success'
      });
    } else {
      setModal({
        isOpen: true,
        title: 'Error',
        message: `Failed to update project: ${result.error}`,
        type: 'error'
      });
    }
  };

  const deleteProjectHandler = (projectId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: async () => {
        const result = await deleteProject(projectId);
        if (result.success) {
          setModal({
            isOpen: true,
            title: 'Success!',
            message: 'Project deleted successfully.',
            type: 'success'
          });
        } else {
          setModal({
            isOpen: true,
            title: 'Error',
            message: `Failed to delete project: ${result.error}`,
            type: 'error'
          });
        }
      }
    });
  };

  const changeProjectStatus = async (projectId, newStatus) => {
    const result = await updateProject(projectId, { status: newStatus });
    if (result.success) {
      setModal({
        isOpen: true,
        title: 'Success!',
        message: `Project status updated to ${newStatus}.`,
        type: 'success'
      });
    } else {
      setModal({
        isOpen: true,
        title: 'Error',
        message: `Failed to update project status: ${result.error}`,
        type: 'error'
      });
    }
  };

  const handleLogoutClick = () => {
    setLogoutConfirmModal({
      isOpen: true,
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      onConfirm: async () => {
        await logout();
        navigate('/');
      }
    });
  };

  // Use projects directly from context (they're already filtered by the backend)
  const filteredProjects = projects;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressStatus = (progress) => {
    if (progress === 100) return 'Completed';
    if (progress >= 80) return 'Almost Done';
    if (progress >= 50) return 'Halfway There';
    if (progress >= 25) return 'Getting Started';
    return 'Just Started';
  };

  const getTaskStatusCounts = (tasks) => {
    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    };
    
    tasks.forEach(task => {
      switch (task.status) {
        case 'Pending':
          counts.pending++;
          break;
        case 'In Progress':
          counts.inProgress++;
          break;
        case 'Completed':
          counts.completed++;
          break;
        case 'Cancelled':
          counts.cancelled++;
          break;
      }
    });
    
    return counts;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogoutClick={handleLogoutClick} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <TopBar setSidebarOpen={setSidebarOpen} setShowAddProject={setShowAddProject} />

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredProjects.length}</p>
                </div>
              </div>
            </div>

            {/* Completed Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {filteredProjects.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {filteredProjects.filter(p => p.status === 'In Progress').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {filteredProjects.length > 0 
                      ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / filteredProjects.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filters.search || filters.status !== '' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new project.'
                }
              </p>
              {!filters.search && filters.status === '' && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Project
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{project.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProjectHandler(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Project Description */}
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <div className="flex items-center space-x-2">
                          <span className={getProgressTextColor(project.progress)}>{project.progress}%</span>
                          {project.progress > 0 && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              <span className="text-xs text-green-600">+{project.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{getProgressStatus(project.progress)}</p>
                        {project.progress === 100 && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-green-600 font-medium">Project Complete!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Task Status Breakdown */}
                    {project.tasks && project.tasks.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Task Breakdown</span>
                          <span className="text-xs text-gray-500">{project.tasks.length} total tasks</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {(() => {
                            const statusCounts = getTaskStatusCounts(project.tasks);
                            return (
                              <>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-gray-600">In Progress:</span>
                                  <span className="font-medium">{statusCounts.inProgress}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-gray-600">Completed:</span>
                                  <span className="font-medium">{statusCounts.completed}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="text-gray-600">Pending:</span>
                                  <span className="font-medium">{statusCounts.pending}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-gray-600">Cancelled:</span>
                                  <span className="font-medium">{statusCounts.cancelled}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">End Date:</span>
                        <p className="text-gray-900">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</p>
                      </div>
                    </div>

                    {/* Team Members */}
                    {project.members && project.members.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Team:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.members.slice(0, 3).map((member, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {member.user ? `${member.user.firstName} ${member.user.lastName}` : member.role}
                            </span>
                          ))}
                          {project.members.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{project.members.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Task Summary */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Task Summary</span>
                        <span className="text-indigo-600 font-medium">
                          {project.taskStats && project.taskStats.total > 0 ? Math.round((project.taskStats.completed / project.taskStats.total) * 100) : 0}% Complete
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium text-green-600">{project.taskStats ? project.taskStats.completed : 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Active:</span>
                          <span className="font-medium text-blue-600">
                            {project.tasks ? project.tasks.filter(t => t.status === 'In Progress').length : 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-medium text-gray-600">
                            {project.tasks ? project.tasks.filter(t => t.status === 'Pending').length : 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Change Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.status !== 'Planning' && (
                        <button
                          onClick={() => changeProjectStatus(project.id, 'Planning')}
                          className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
                        >
                          Mark Planning
                        </button>
                      )}
                      {project.status !== 'In Progress' && (
                        <button
                          onClick={() => changeProjectStatus(project.id, 'In Progress')}
                          className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {project.status !== 'Completed' && (
                        <button
                          onClick={() => changeProjectStatus(project.id, 'Completed')}
                          className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Project</h3>
            </div>
            <AddProjectForm onSubmit={addProject} onCancel={() => setShowAddProject(false)} />
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Project</h3>
            </div>
            <EditProjectForm 
              project={editingProject} 
              onSubmit={updateProjectHandler} 
              onCancel={() => setEditingProject(null)} 
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <ConfirmationModal
        isOpen={logoutConfirmModal.isOpen}
        onClose={() => setLogoutConfirmModal({ ...logoutConfirmModal, isOpen: false })}
        onConfirm={logoutConfirmModal.onConfirm}
        title={logoutConfirmModal.title}
        message={logoutConfirmModal.message}
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="warning"
      />
    </div>
  );
};

// Add Project Form Component
const AddProjectForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter project name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter project description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Project
        </button>
      </div>
    </form>
  );
};

// Edit Project Form Component
const EditProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    endDate: project.endDate
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(project.id, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Project
        </button>
      </div>
    </form>
  );
};

export default ProjectsPage; 