import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import SidebarUserProfile from './SidebarUserProfile';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <SidebarLogo setSidebarOpen={setSidebarOpen} />
        <SidebarNavigation />
        <SidebarUserProfile />
      </div>
    </div>
  );
};

export default Sidebar; 