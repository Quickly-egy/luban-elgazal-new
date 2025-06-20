import React from 'react';
import './CashBack.css';

const CashBack = () => {
  return (
    <div className="cashback-section">
      <div className="container">
        <div className="banner-container">
          <img 
            src="/images/cashback-banner.jpg" 
            alt="بنر إعلاني" 
            className="banner-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="image-placeholder" style={{ display: 'none' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="currentColor"/>
            </svg>
            <p>صورة البنر الإعلاني</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashBack; 