const API_BASE_URL = 'http://localhost:5002/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// API service class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUserProfile() {
    return this.request('/users/profile', {
      method: 'DELETE',
    });
  }

  async getUserSettings() {
    return this.request('/users/settings');
  }

  async updateUserSettings(settingsData) {
    return this.request('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Task methods
  async getAllTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return this.request(endpoint);
  }

  async getTaskById(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats() {
    return this.request('/tasks/stats');
  }

  async getTasksForCalendar(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks/calendar?${queryString}` : '/tasks/calendar';
    return this.request(endpoint);
  }

  // Project methods
  async getAllProjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    return this.request(endpoint);
  }

  async getProjectById(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectStats() {
    return this.request('/projects/stats');
  }

  async searchUsers(query, projectId = null) {
    const params = { query };
    const queryString = new URLSearchParams(params).toString();
    const endpoint = projectId 
      ? `/projects/${projectId}/search-users?${queryString}`
      : `/projects/search-users?${queryString}`;
    return this.request(endpoint);
  }

  async addProjectMember(projectId, userId, role = 'Developer') {
    return this.request(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  async removeProjectMember(projectId, userId) {
    return this.request(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Event methods
  async getAllEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    return this.request(endpoint);
  }

  async getEventById(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Report methods
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reports?${queryString}` : '/reports';
    return this.request(endpoint);
  }

  async getDashboardAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reports/dashboard?${queryString}` : '/reports/dashboard';
    return this.request(endpoint);
  }

  async getTaskAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reports/tasks?${queryString}` : '/reports/tasks';
    return this.request(endpoint);
  }

  async getProjectAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reports/projects?${queryString}` : '/reports/projects';
    return this.request(endpoint);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 