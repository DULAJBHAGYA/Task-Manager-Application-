import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DevNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-medium mb-2">Dev Navigation</div>
        <div className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              location.pathname === '/' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => navigate('/auth')}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              location.pathname === '/auth' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Auth
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              location.pathname === '/dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/projects')}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              location.pathname === '/projects' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevNavigation; 