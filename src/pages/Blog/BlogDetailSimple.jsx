import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById } from '../../constants/blogData';

const BlogDetailSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    console.log('Loading blog with id:', id);
    const foundBlog = getBlogById(id);
    console.log('Found blog:', foundBlog);
    setBlog(foundBlog);
  }, [id]);

  if (!blog) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>المقال غير موجود</h2>
        <p>عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
        <Link to="/blog">العودة إلى المدونة</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', direction: 'rtl' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/">الرئيسية</Link>
        <span> ← </span>
        <Link to="/blog">المدونة</Link>
        <span> ← </span>
        <span>{blog.title}</span>
      </nav>

      {/* Article Header */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{blog.title}</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>{blog.excerpt}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <span>👤 {blog.author}</span>
          <span>📅 {blog.publishDate}</span>
          <span>⏱️ {blog.readTime}</span>
        </div>
      </header>

      {/* Article Image */}
      <div style={{ marginBottom: '2rem' }}>
        <img 
          src={blog.image} 
          alt={blog.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
        />
      </div>

      {/* Article Content */}
      <main>
        <div 
          style={{ 
            lineHeight: '1.8', 
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {/* Tags */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
          <h4>الكلمات المفتاحية:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
            {blog.tags.map((tag, index) => (
              <span 
                key={index} 
                style={{ 
                  background: '#f0f0f0', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: '#e2e8f0', 
            border: 'none', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '25px',
            marginLeft: '1rem',
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          ← العودة
        </button>
        <Link 
          to="/blog"
          style={{ 
            background: '#4299e1', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '25px',
            textDecoration: 'none'
          }}
        >
          جميع المقالات
        </Link>
      </div>
    </div>
  );
};

export default BlogDetailSimple; 