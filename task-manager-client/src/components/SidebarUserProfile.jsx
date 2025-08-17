import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarUserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">User</p>
          <button 
            onClick={() => navigate('/')}
            className="text-xs text-gray-500 hover:text-indigo-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile; 