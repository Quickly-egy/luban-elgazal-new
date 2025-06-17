import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import './SuccessNotification.css';

const SuccessNotification = ({ 
  isVisible, 
  message, 
  onClose, 
  duration = 4000,
  type = 'success' // 'success', 'info', 'warning'
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'info':
        return <FaCheckCircle className="notification-icon info" />;
      default:
        return <FaCheckCircle className="notification-icon success" />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'success';
    }
  };

  return (
    <div className={`success-notification ${getTypeClass()}`}>
      <div className="notification-content">
        {getIcon()}
        <div className="notification-message">
          {message}
        </div>
        <button 
          className="notification-close"
          onClick={onClose}
          type="button"
        >
          <FaTimes />
        </button>
      </div>
      <div className="notification-progress">
        <div 
          className="progress-bar" 
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
};

export default SuccessNotification; 