import React from 'react';

const TopBanner = () => {
  return (
    <div className="top-banner">
      <div className="container">
        <div className="banner-content">
          <span className="banner-item">
            <i className="fas fa-shipping-fast"></i>
            شحن مجاني للطلبيات أكثر من 100 ريال 🚀
          </span>
          <span className="banner-item">
            <i className="fas fa-shield-alt"></i>
            ضمان الجودة 💯 100%
          </span>
          <span className="banner-item">
            <i className="fas fa-gift"></i>
            هدايا مجانية مع كل طلب 💝
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBanner; 