import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>لقمان الغزال</h3>
            <p>نحن نقدم أفضل المنتجات والخدمات لعملائنا الكرام</p>
          </div>
          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="/">الرئيسية</a></li>
              <li><a href="/products">المنتجات</a></li>
              <li><a href="/about">من نحن</a></li>
              <li><a href="/contact">اتصل بنا</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <p>الهاتف: +20 128 826 6400</p>
            <p>البريد الإلكتروني: info@luban-elgazal.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 لقمان الغزال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 