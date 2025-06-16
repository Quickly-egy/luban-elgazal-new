import React from 'react';
import { motion } from 'framer-motion';
import './Blog.css';

const BlogFilter = ({ activeCategory, onCategoryChange, data }) => {
  // Extract unique categories from data
  const categories = React.useMemo(() => {
    if (!data) return [];
    const uniqueCategories = new Set();
    data.forEach(article => {
      if (article.news_category?.name) {
        uniqueCategories.add(article.news_category.name);
      }
    });
    return Array.from(uniqueCategories);
  }, [data]);

  if (!data) return null;

  return (
    <div className="blog-filter">
      <h3 className="filter-title">تصفية حسب الفئة</h3>
      <div className="filter-buttons">
        <motion.button
          key="الكل"
          className={`filter-btn ${activeCategory === "الكل" ? 'active' : ''}`}
          onClick={() => onCategoryChange("الكل")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          الكل
        </motion.button>
        {categories.map((categoryName, index) => (
          <motion.button
            key={categoryName}
            className={`filter-btn ${activeCategory === categoryName ? 'active' : ''}`}
            onClick={() => onCategoryChange(categoryName)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoryName}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilter; 