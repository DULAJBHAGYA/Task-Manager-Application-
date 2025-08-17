import React from 'react';

const TaskCard = ({ task, setEditingTask, deleteTask, changeTaskStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="text-gray-600 mb-3">{task.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setEditingTask(task)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Status Change Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {task.status !== 'Pending' && (
            <button
              onClick={() => changeTaskStatus(task.id, 'Pending')}
              className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
            >
              Mark Pending
            </button>
          )}
          {task.status !== 'In Progress' && (
            <button
              onClick={() => changeTaskStatus(task.id, 'In Progress')}
              className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            >
              Mark In Progress
            </button>
          )}
          {task.status !== 'Completed' && (
            <button
              onClick={() => changeTaskStatus(task.id, 'Completed')}
              className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 