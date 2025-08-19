import React from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    const baseStyles = "fixed inset-0 z-50 flex items-center justify-center";
    return baseStyles;
  };

  const getOverlayStyles = () => {
    return "fixed inset-0 bg-black bg-opacity-50 transition-opacity";
  };

  const getContentStyles = () => {
    const baseStyles = "bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all";
    return baseStyles;
  };

  const getIconStyles = () => {
    const baseStyles = "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-100 text-green-600`;
      case 'error':
        return `${baseStyles} bg-red-100 text-red-600`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 text-yellow-600`;
      default:
        return `${baseStyles} bg-blue-100 text-blue-600`;
    }
  };

  const getTitleStyles = () => {
    const baseStyles = "text-lg font-semibold text-center mb-2";
    switch (type) {
      case 'success':
        return `${baseStyles} text-green-800`;
      case 'error':
        return `${baseStyles} text-red-800`;
      case 'warning':
        return `${baseStyles} text-yellow-800`;
      default:
        return `${baseStyles} text-gray-800`;
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "w-full px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case 'error':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={getModalStyles()}>
      <div className={getOverlayStyles()} onClick={onClose}></div>
      <div className={getContentStyles()}>
        <div className="p-6">
          <div className={getIconStyles()}>
            {getIcon()}
          </div>
          
          <h3 className={getTitleStyles()}>
            {title}
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className={getButtonStyles()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 