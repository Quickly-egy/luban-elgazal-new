import React from 'react';
import BannerManager from '../../components/admin/BannerManager/BannerManager';
import FooterAdBanner from '../ProductDetail/FooterBanner';
import './TestBanner.css';

/**
 * صفحة اختبار البنرات - للتطوير والاختبار
 */
const TestBanner = () => {
  return (
    <div className="test-banner-page">
      <div className="container">
        <div className="page-header">
          <h1>🎨 اختبار البنرات الإعلانية</h1>
          <p>هذه الصفحة للاختبار والتطوير فقط</p>
        </div>

        <div className="test-sections">
          {/* عرض البنر كما يظهر في الموقع */}
          <section className="banner-preview-section">
            <h2>📋 معاينة البنر في الموقع</h2>
            <div className="banner-demo">
              <FooterAdBanner />
            </div>
          </section>

          {/* إدارة البنرات */}
          <section className="banner-management-section">
            <h2>⚙️ إدارة البنرات</h2>
            <BannerManager />
          </section>

          {/* معلومات للمطور */}
          <section className="developer-info">
            <h2>💻 معلومات للمطور</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>🔧 الاستخدام</h3>
                <p>البنر يعتمد على وجود حقل <code>banner_image_url</code> في بيانات المنتجات من API</p>
              </div>
              
              <div className="info-card">
                <h3>📂 الملفات</h3>
                <ul>
                  <li><code>src/hooks/useBanner.js</code> - Hook لجلب البنرات</li>
                  <li><code>src/pages/ProductDetail/FooterBanner.jsx</code> - مكون البنر</li>
                  <li><code>src/components/admin/BannerManager/BannerManager.jsx</code> - إدارة البنرات</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>🎯 المميزات</h3>
                <ul>
                  <li>جلب البنرات من API تلقائياً</li>
                  <li>عرض بنر عشوائي من المنتجات</li>
                  <li>إمكانية تغيير البنر يدوياً</li>
                  <li>fallback للبنر الافتراضي</li>
                  <li>معلومات تشخيص في وضع التطوير</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>🔄 API Expected Format</h3>
                <pre>{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "banner_image_url": "https://...",
      "description": "...",
      "prices": {
        "sar": {
          "price": "100",
          "symbol": "ر.س"
        }
      }
    }
  ]
}`}</pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TestBanner;