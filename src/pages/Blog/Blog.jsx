import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import BlogCard from '../../components/Blog/BlogCard';
import BlogFilter from '../../components/Blog/BlogFilter';

import { blogData, getBlogsByCategory } from '../../constants/blogData';
import '../../components/Blog/Blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const filteredBlogs = useMemo(() => {
    return getBlogsByCategory(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };



  return (
    <div className="blog-page">
      {/* Hero Section */}
      <motion.section
        className="blog-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">📝 مدونة لقمان الغزال</h1>
            <p className="hero-description">
              اكتشف أحدث المقالات والأخبار في عالم التكنولوجيا وريادة الأعمال والتطوير المهني
            </p>
          </div>
        </div>
      </motion.section>

      <div className="container">


        {/* Filter Section */}
        <BlogFilter 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />

        {/* Results Info */}
        <motion.div
          className="results-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p>
            عرض مقالات فئة <strong>{activeCategory}</strong>: 
            <span className="results-count"> {filteredBlogs.length} مقال</span>
          </p>
        </motion.div>

        {/* Blog Grid */}
        <section className="blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))
          ) : (
            <motion.div
              className="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="no-results-content">
                <span className="no-results-icon">🔍</span>
                <h3>لا توجد نتائج</h3>
                <p>
                  لا توجد مقالات في فئة {activeCategory} حالياً
                </p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setActiveCategory('الكل');
                  }}
                >
                  عرض جميع المقالات
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Load More Button (for future pagination) */}
        {filteredBlogs.length > 0 && filteredBlogs.length >= 6 && (
          <motion.div
            className="load-more-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button className="load-more-btn">
              تحميل المزيد من المقالات
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog; 