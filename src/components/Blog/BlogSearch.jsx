import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Blog.css';

const BlogSearch = ({ onSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <motion.div
      className="blog-search"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="ابحث في المقالات..."
            value={localSearchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {localSearchTerm && (
            <button
              onClick={clearSearch}
              className="clear-search-btn"
            >
              ✖
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogSearch; 