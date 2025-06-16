import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  title = "عذراً، حدث خطأ", 
  message = "يرجى المحاولة مرة أخرى لاحقاً",
  onRetry
}) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 