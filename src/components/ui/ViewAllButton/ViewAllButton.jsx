import React from 'react';
import styles from './ViewAllButton.module.css';

const ViewAllButton = ({ 
  text = "عرض الكل", 
  onClick, 
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  ...props 
}) => {
  const buttonClasses = [
    styles.viewAllBtn,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.viewAllSection}>
      <button 
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        <span className={styles.btnText}>{text}</span>
        <svg 
          className={styles.btnArrow} 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M15 18L9 12L15 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ViewAllButton; 