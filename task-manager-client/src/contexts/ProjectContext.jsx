import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import websocketService from '../services/websocket';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Refs to prevent multiple simultaneous requests
  const loadingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // Load projects with current filters
  const loadProjects = async (page = 1) => {
    if (loadingRef.current) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...filters
        };

        const response = await apiService.getAllProjects(params);
        
        setProjects(response.data.projects);
        setPagination(response.data.pagination);
      } catch (error) {
        setError(error.message);
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    }, 300);
  };

  // Load project statistics
  const loadStats = async () => {
    try {
      const response = await apiService.getProjectStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load project stats:', error);
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createProject(projectData);
      
      // Add the new project to the list
      setProjects(prevProjects => [response.data.project, ...prevProjects]);
      
      // Reload stats
      await loadStats();
      
      return { success: true, project: response.data.project };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a project
  const updateProject = async (id, projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateProject(id, projectData);
      
      // Update the project in the list
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id ? response.data.project : project
        )
      );
      
      return { success: true, project: response.data.project };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deleteProject(id);
      
      // Remove the project from the list
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      
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

  // Get a single project by ID
  const getProjectById = async (id) => {
    try {
      const response = await apiService.getProjectById(id);
      return { success: true, project: response.data.project };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Search users
  const searchUsers = async (query, projectId = null) => {
    try {
      const response = await apiService.searchUsers(query, projectId);
      return { success: true, users: response.data.users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add project member
  const addProjectMember = async (projectId, userId, role = 'Developer') => {
    try {
      const response = await apiService.addProjectMember(projectId, userId, role);
      
      // Update the project in the list with new members
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId ? response.data.project : project
        )
      );
      
      return { success: true, project: response.data.project };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Remove project member
  const removeProjectMember = async (projectId, userId) => {
    try {
      await apiService.removeProjectMember(projectId, userId);
      
      // Update the project in the list
      const updatedProject = await getProjectById(projectId);
      if (updatedProject.success) {
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === projectId ? updatedProject.project : project
          )
        );
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      sortBy: 'updatedAt',
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
    loadProjects();
    loadStats();
    
            // TODO: Enable WebSocket for real-time updates when backend supports it
        // const token = localStorage.getItem('token');
        // if (token) {
        //   websocketService.connect(token);
        //   
        //   // Subscribe to real-time updates
        //   const unsubscribeProjectUpdate = websocketService.subscribe('PROJECT_UPDATED', (project) => {
        //     setProjects(prevProjects => 
        //       prevProjects.map(p => p.id === project.id ? project : p)
        //     );
        //   });
        //   
        //   const unsubscribeProjectCreated = websocketService.subscribe('PROJECT_CREATED', (project) => {
        //     setProjects(prevProjects => [project, ...prevProjects]);
        //   });
        //   
        //   const unsubscribeProjectDeleted = websocketService.subscribe('PROJECT_DELETED', (projectId) => {
        //     setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        //   });
        //   
        //   const unsubscribeMemberAdded = websocketService.subscribe('MEMBER_ADDED', (data) => {
        //     setProjects(prevProjects => 
        //       prevProjects.map(p => p.id === data.projectId ? data.project : p)
        //     );
        //   });
        //   
        //   const unsubscribeMemberRemoved = websocketService.subscribe('MEMBER_REMOVED', (data) => {
        //     setProjects(prevProjects => 
        //       prevProjects.map(p => p.id === data.projectId ? data.project : p)
        //     );
        //   });
        //   
        //   // Cleanup subscriptions on unmount
        //   return () => {
        //     unsubscribeProjectUpdate();
        //     unsubscribeProjectCreated();
        //     unsubscribeProjectDeleted();
        //     unsubscribeMemberAdded();
        //     unsubscribeMemberRemoved();
        //   };
        // }
  }, []);

  // Reload projects when filters change
  useEffect(() => {
    loadProjects(pagination.currentPage);
  }, [filters.status, filters.search, filters.sortBy, filters.sortOrder, pagination.currentPage]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const value = {
    // State
    projects,
    loading,
    error,
    stats,
    filters,
    pagination,
    
    // Actions
    loadProjects,
    loadStats,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    searchUsers,
    addProjectMember,
    removeProjectMember,
    updateFilters,
    clearFilters,
    changePage,
    clearError
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 