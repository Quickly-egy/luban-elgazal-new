import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';

const MainHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const getCartItemsCount = useStore((state) => state.getCartItemsCount);
  const cartItemsCount = getCartItemsCount();

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="main-header">
      <div className="container">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-section">
            <img src="/src/assets/images/logo.webp" alt="لقمان الغزال" className="logo-img" />
          </div>

          {/* Search Section */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Actions Section */}
          <div className="actions-section">
            <div className="country-flag">
              <span className="flag-emoji">🇪🇬</span>
              <span className="country-text">جميع الثقافات</span>
            </div>

            <div className="auth-buttons">
              <button className="create-account-btn">
                <i className="fas fa-user-plus"></i>
                إنشاء حساب
              </button>
              <a href="/login" className="login-link">
                <i className="fas fa-sign-in-alt"></i>
                تسجيل الدخول
              </a>
            </div>

            <div className="user-actions">
              <a href="/cart" className="action-link cart-link">
                <i className="fas fa-shopping-cart"></i>
                {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
              </a>
              <a href="/wishlist" className="action-link wishlist-link">
                <i className="fas fa-heart"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader; 