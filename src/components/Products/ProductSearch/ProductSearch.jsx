import React from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import './ProductSearch.css';

const ProductSearch = ({ searchTerm, onSearchChange, isLoading = false, placeholder = "ابحث عن المنتجات..." }) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="product-search">
      <div className={`search-container ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <FaSpinner className="search-icon loading-spinner" />
        ) : (
          <FaSearch className="search-icon" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          disabled={isLoading}
        />
        {searchTerm && !isLoading && (
          <button
            onClick={handleClearSearch}
            className="clear-search-btn"
            type="button"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSearch; 