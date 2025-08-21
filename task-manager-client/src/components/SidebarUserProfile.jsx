import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const SidebarUserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials(user?.firstName, user?.lastName)}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-700 truncate">
            {getUserName()}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
        <button 
          onClick={() => setShowConfirmation(true)}
          className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
          title="Sign Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleLogout}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmText="Sign Out"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon="warning"
        />
      )}
    </div>
  );
};

export default SidebarUserProfile; 