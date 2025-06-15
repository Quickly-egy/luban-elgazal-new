import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import FAQ from '../pages/FAQ/FAQ';
import Contact from '../pages/Contact/Contact';
import Blog from '../pages/Blog/Blog';
import BlogDetailSimple from '../pages/Blog/BlogDetailSimple';
import TestDetail from '../pages/Blog/TestDetail';

const RoutesComponent = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetailSimple />} />
          <Route path="*" element={<div>صفحة غير موجودة - الرابط: {window.location.pathname}</div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default RoutesComponent;
