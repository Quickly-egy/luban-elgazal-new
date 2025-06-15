import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Blog.css';

const BlogCard = ({ blog, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = (e) => {
    console.log('Clicked on blog:', blog.id, blog.title);
  };

  return (
    <motion.article
      className="blog-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/blog/${blog.id}`} className="blog-card-link" onClick={handleClick}>
        <div className="blog-card-image">
          <img src={blog.image} alt={blog.title} />
          <div className="blog-card-category">
            {blog.category}
          </div>
        </div>
        
        <div className="blog-card-content">
          <div className="blog-card-meta">
            <span className="blog-card-author">👤 {blog.author}</span>
            <span className="blog-card-date">📅 {formatDate(blog.publishDate)}</span>
            <span className="blog-card-read-time">⏱️ {blog.readTime}</span>
          </div>
          
          <h3 className="blog-card-title">{blog.title}</h3>
          <p className="blog-card-excerpt">{blog.excerpt}</p>
          
          <div className="blog-card-tags">
            {blog.tags.slice(0, 3).map((tag, tagIndex) => (
              <span key={tagIndex} className="blog-card-tag">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="blog-card-footer">
            <span className="read-more">اقرأ المزيد ←</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard; 