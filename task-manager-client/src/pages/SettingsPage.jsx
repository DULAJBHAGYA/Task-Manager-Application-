import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmationModal from '../components/ConfirmationModal';
import apiService from '../services/api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, updateSettings } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutConfirmModal, setLogoutConfirmModal] = useState({ isOpen: false });
  const [deleteProfileModal, setDeleteProfileModal] = useState({ isOpen: false });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Form data state
  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      avatar: null
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC'
    }
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        profile: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          avatar: user.avatar || null
        },
        preferences: {
          theme: user.theme || 'light',
          language: user.language || 'en',
          timezone: user.timezone || 'UTC'
        }
      });
    }
  }, [user]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Handle real-time theme changes
    if (section === 'preferences' && field === 'theme') {
      changeTheme(value);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update profile
      await updateProfile(formData.profile);
      
      // Update settings
      await updateSettings(formData.preferences);
      
      setModal({
        isOpen: true,
        title: 'Success',
        message: 'Settings updated successfully!',
        type: 'success'
      });
      
      setIsEditing(false);
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to update settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        profile: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          avatar: user.avatar || null
        },
        preferences: {
          theme: user.theme || 'light',
          language: user.language || 'en',
          timezone: user.timezone || 'UTC'
        }
      });
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleLogoutClick = () => {
    setLogoutConfirmModal({
      isOpen: true,
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      onConfirm: async () => {
        await logout();
        navigate('/');
      }
    });
  };

  const handleDeleteProfile = () => {
    setDeleteProfileModal({
      isOpen: true,
      title: 'Delete Profile',
      message: 'Are you sure you want to delete your profile? This action cannot be undone and will permanently remove all your data including tasks, projects, and account information.',
      onConfirm: async () => {
        try {
          await apiService.deleteUserProfile();
          localStorage.clear();
          navigate('/');
        } catch (error) {
          console.error('Error deleting profile:', error);
          setModal({
            isOpen: true,
            title: 'Error',
            message: 'Failed to delete profile',
            type: 'error'
          });
        }
      }
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'preferences', name: 'Preferences' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogoutClick={handleLogoutClick} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <TopBar setSidebarOpen={setSidebarOpen} />

        {/* Settings Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
            </div>
            
            {!isEditing && (
              <button
                onClick={startEditing}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Edit Settings
              </button>
            )}
            
            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={isEditing ? formData.profile.firstName : user.firstName}
                      onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={isEditing ? formData.profile.lastName : user.lastName}
                      onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={isEditing ? formData.profile.email : user.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Delete Profile Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Delete Profile</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Permanently delete your profile and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteProfile}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Application Preferences</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <select
                      value={isEditing ? formData.preferences.theme : theme}
                      onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select
                      value={isEditing ? formData.preferences.language : user.language}
                      onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select
                      value={isEditing ? formData.preferences.timezone : user.timezone}
                      onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={logoutConfirmModal.isOpen}
        onClose={() => setLogoutConfirmModal({ ...logoutConfirmModal, isOpen: false })}
        onConfirm={logoutConfirmModal.onConfirm}
        title={logoutConfirmModal.title}
        message={logoutConfirmModal.message}
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="warning"
      />

      {/* Delete Profile Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteProfileModal.isOpen}
        onClose={() => setDeleteProfileModal({ ...deleteProfileModal, isOpen: false })}
        onConfirm={deleteProfileModal.onConfirm}
        title={deleteProfileModal.title}
        message={deleteProfileModal.message}
        confirmText="Delete Profile"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="warning"
      />

      {/* Success/Error Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={() => {
          if (modal.type === 'success') {
            setIsEditing(false);
          }
          setModal({ ...modal, isOpen: false });
        }}
        title={modal.title}
        message={modal.message}
        confirmText="OK"
        cancelText="Cancel"
        confirmButtonClass={modal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        icon={modal.type}
      />
    </div>
  );
};

export default SettingsPage; 