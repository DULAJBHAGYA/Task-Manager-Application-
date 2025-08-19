import React from 'react';

const SidebarLogo = ({ setSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <img 
          src="/images/logo.png" 
          alt="TaskMate Logo" 
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-indigo-600">TaskMate</h1>
      </div>
      <button 
        onClick={() => setSidebarOpen(false)}
        className="lg:hidden text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default SidebarLogo; 