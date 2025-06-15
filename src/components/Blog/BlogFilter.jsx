import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../constants/blogData';
import './Blog.css';

const BlogFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="blog-filter">
      <h3 className="filter-title">تصفية حسب الفئة</h3>
      <div className="filter-buttons">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilter; 