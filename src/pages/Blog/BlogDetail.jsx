import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogCard from '../../components/Blog/BlogCard';
import { getBlogById, getRelatedBlogs } from '../../constants/blogData';
import '../../components/Blog/Blog.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);



  useEffect(() => {
   
    const foundBlog = getBlogById(id);
  
    if (foundBlog) {
      setBlog(foundBlog);
      const related = getRelatedBlogs(id, foundBlog.category);
      setRelatedBlogs(related);
    } else {
   
      setBlog(null);
    }
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!blog) {
    return (
      <div className="blog-not-found">
        <div className="container">
          <div className="not-found-content">
            <span className="not-found-icon">📄</span>
            <h2>المقال غير موجود</h2>
            <p>عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
            <Link to="/blog" className="back-to-blog-btn">
              العودة إلى المدونة
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <motion.section
        className="blog-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">📖 تفاصيل المقال</h1>
            <p className="hero-description">
              اقرأ المقال كاملاً واستفد من المحتوى المفيد والمعلومات القيمة
            </p>
          </div>
        </div>
      </motion.section>

      {/* Breadcrumb */}
      <div className="container">
        <motion.nav className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span>←</span>
          <Link to="/blog">المدونة</Link>
          <span>←</span>
          <span className="current">{blog.title}</span>
        </motion.nav>
      </div>

      {/* Article Header */}
      <motion.header className="article-header">
        <div className="container">
          <div className="article-header-content">
            <div className="article-category">{blog.category}</div>
            <h1 className="article-title">{blog.title}</h1>
            <p className="article-excerpt">{blog.excerpt}</p>
            
            <div className="article-meta">
              <div className="meta-item">
                <span className="meta-icon">👤</span>
                <span>{blog.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>{formatDate(blog.publishDate)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Article Image */}
      <motion.div className="article-image-container">
        <div className="container">
          <img loading="lazy" src={blog.image} alt={blog.title} className="article-image" />
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.main className="article-content">
        <div className="container">
          <div className="content-wrapper">
            <article className="article-body">
              <div 
                className="article-text"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              <div className="article-tags">
                <h4>الكلمات المفتاحية:</h4>
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </article>

            <aside className="article-sidebar">
              <div className="sidebar-widget">
                <h3>عن الكاتب</h3>
                <div className="author-info">
                  <div className="author-avatar">👤</div>
                  <div className="author-details">
                    <h4>{blog.author}</h4>
                    <p>كاتب ومتخصص في مجال {blog.category}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.main>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <motion.section className="related-articles">
          <div className="container">
            <h2 className="section-title">مقالات ذات صلة</h2>
            <div className="related-grid">
              {relatedBlogs.map((relatedBlog, index) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Navigation */}
      <motion.div className="article-navigation">
        <div className="container">
          <div className="nav-buttons">
            <button onClick={() => navigate(-1)} className="nav-btn back-btn">
              ← العودة
            </button>
            <Link to="/blog" className="nav-btn blog-btn">
              جميع المقالات
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail; 