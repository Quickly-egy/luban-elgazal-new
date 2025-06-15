import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './ProductSearch.css';

const ProductSearch = ({ searchTerm, onSearchChange }) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="product-search">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
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