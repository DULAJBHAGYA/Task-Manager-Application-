import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
  const [selectedProject, setSelectedProject] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedProjects = localStorage.getItem('projects');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Calculate statistics based on time range
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return {
      tasks: tasks.filter(task => new Date(task.createdAt) >= startDate),
      projects: projects.filter(project => new Date(project.createdAt) >= startDate)
    };
  };

  const { tasks: filteredTasks, projects: filteredProjects } = getFilteredData();

  // Calculate statistics
  const calculateStats = () => {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = filteredTasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress').length;
    
    const totalProjects = filteredProjects.length;
    const completedProjects = filteredProjects.filter(project => project.status === 'Completed').length;
    const activeProjects = filteredProjects.filter(project => project.status === 'In Progress').length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalProjects,
      completedProjects,
      activeProjects,
      completionRate,
      projectCompletionRate
    };
  };

  const stats = calculateStats();

  // Get priority distribution
  const getPriorityDistribution = () => {
    const priorityCounts = { High: 0, Medium: 0, Low: 0 };
    filteredTasks.forEach(task => {
      priorityCounts[task.priority]++;
    });
    return priorityCounts;
  };

  // Get status distribution
  const getStatusDistribution = () => {
    const statusCounts = { 'Pending': 0, 'In Progress': 0, 'Completed': 0 };
    filteredTasks.forEach(task => {
      statusCounts[task.status]++;
    });
    return statusCounts;
  };

  // Get project status distribution
  const getProjectStatusDistribution = () => {
    const statusCounts = { 'Planning': 0, 'In Progress': 0, 'On Hold': 0, 'Completed': 0 };
    filteredProjects.forEach(project => {
      statusCounts[project.status]++;
    });
    return statusCounts;
  };

  // Get recent activity
  const getRecentActivity = () => {
    const allItems = [
      ...filteredTasks.map(task => ({
        ...task,
        type: 'task',
        date: new Date(task.createdAt)
      })),
      ...filteredProjects.map(project => ({
        ...project,
        type: 'project',
        date: new Date(project.createdAt)
      }))
    ];
    
    return allItems
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
  };

  const priorityDistribution = getPriorityDistribution();
  const statusDistribution = getStatusDistribution();
  const projectStatusDistribution = getProjectStatusDistribution();
  const recentActivity = getRecentActivity();

  // Generate chart data for priority distribution
  const generatePriorityChart = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981'];
    const labels = Object.keys(priorityDistribution);
    const data = Object.values(priorityDistribution);
    
    return { labels, data, colors };
  };

  // Generate chart data for status distribution
  const generateStatusChart = () => {
    const colors = ['#F59E0B', '#3B82F6', '#10B981'];
    const labels = Object.keys(statusDistribution);
    const data = Object.values(statusDistribution);
    
    return { labels, data, colors };
  };

  // Generate chart data for project status
  const generateProjectChart = () => {
    const colors = ['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'];
    const labels = Object.keys(projectStatusDistribution);
    const data = Object.values(projectStatusDistribution);
    
    return { labels, data, colors };
  };

  const priorityChart = generatePriorityChart();
  const statusChart = generateStatusChart();
  const projectChart = generateProjectChart();

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
        <TopBar setSidebarOpen={setSidebarOpen} />

        {/* Reports Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Track your productivity and project progress</p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>

            {/* Project Completion */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Project Completion</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.projectCompletionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Task Priority Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Priority Distribution</h3>
              <div className="space-y-3">
                {priorityChart.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: priorityChart.colors[index] }}
                      ></div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {priorityChart.data[index]} ({priorityChart.data[index] > 0 ? Math.round((priorityChart.data[index] / stats.totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status Distribution</h3>
              <div className="space-y-3">
                {statusChart.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: statusChart.colors[index] }}
                      ></div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {statusChart.data[index]} ({statusChart.data[index] > 0 ? Math.round((statusChart.data[index] / stats.totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Status Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projectChart.labels.map((label, index) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{projectChart.data[index]}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                  <div 
                    className="w-full h-2 rounded-full mt-2"
                    style={{ backgroundColor: projectChart.colors[index] }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent activity found for the selected time range.
                </div>
              ) : (
                recentActivity.map((item, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        item.type === 'task' ? 'bg-indigo-100' : 'bg-blue-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          item.type === 'task' ? 'text-indigo-600' : 'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.type === 'task' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.type === 'task' ? 'Task' : 'Project'} • {item.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 