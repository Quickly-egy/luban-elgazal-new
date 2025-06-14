import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <h1>مرحباً بك في لقمان الغزال</h1>
          <p>نقدم لك أفضل المنتجات والخدمات</p>
          <button className="cta-button">تصفح المنتجات</button>
        </section>
        
        <section className="features">
          <div className="feature-grid">
            <div className="feature-card">
              <h3>جودة عالية</h3>
              <p>منتجاتنا مصنوعة بأعلى معايير الجودة</p>
            </div>
            <div className="feature-card">
              <h3>خدمة ممتازة</h3>
              <p>نوفر خدمة عملاء متميزة على مدار الساعة</p>
            </div>
            <div className="feature-card">
              <h3>أسعار تنافسية</h3>
              <p>أفضل الأسعار في السوق مع جودة عالية</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 