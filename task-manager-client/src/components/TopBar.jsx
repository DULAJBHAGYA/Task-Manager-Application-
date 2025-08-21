import React from 'react';
import { useLocation } from 'react-router-dom';

const TopBar = ({ setSidebarOpen, setShowAddProject, setShowAddTask, setShowAddEvent }) => {
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';
  const isCalendarPage = location.pathname === '/calendar';
  const isReportsPage = location.pathname === '/reports';
  const isSettingsPage = location.pathname === '/settings';
  
  const handleAddClick = () => {
    if (isProjectsPage) {
      setShowAddProject(true);
    } else if (isCalendarPage) {
      setShowAddEvent(true);
    } else if (isReportsPage || isSettingsPage) {
      // Reports and Settings pages don't have an add action
      return;
    } else {
      setShowAddTask(true);
    }
  };

  const getButtonText = () => {
    if (isProjectsPage) {
      return (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Project
        </>
      );
    } else if (isCalendarPage) {
      return (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </>
      );
    } else if (isReportsPage || isSettingsPage) {
      return null; // No button for reports or settings pages
    }
    return (
      <>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Task
      </>
    );
  };

  const getPageTitle = () => {
    if (isProjectsPage) {
      return "Project Management";
    } else if (isCalendarPage) {
      return "Calendar";
    } else if (isReportsPage) {
      return "Reports";
    } else if (isSettingsPage) {
      return "Settings";
    }
    return "Task Dashboard";
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">{getPageTitle()}</h2>
          </div>
          {!isReportsPage && !isSettingsPage && (
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {getButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar; 