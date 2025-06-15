import React, { useState } from 'react';
import './ProductDescription.css';

const ProductDescription = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'وصف المنتج', icon: '📝' },
    { id: 'specifications', label: 'المواصفات', icon: '⚙️' }
  ];

  const productDescription = {
    description: `
      لابتوب Asus Vivobook I5 1355U هو الخيار المثالي للمحترفين والطلاب الذين يبحثون عن أداء متميز وتصميم عصري. 
      يأتي هذا اللابتوب بمعالج Intel Core i5 من الجيل الثالث عشر الذي يوفر سرعة استثنائية في معالجة المهام المتعددة.
      
      مع ذاكرة وصول عشوائي سعة 8 جيجابايت وقرص تخزين SSD بسعة 512 جيجابايت، ستحصل على تجربة استخدام سلسة وسريعة 
      سواء في العمل أو الترفيه أو الدراسة.
      
      الشاشة عالية الدقة 15.6 بوصة تعرض الألوان بوضوح مذهل، مما يجعلها مثالية لمشاهدة الأفلام والعمل على التصاميم.
      البطارية طويلة المدى تضمن لك العمل لساعات طويلة دون الحاجة للشحن المستمر.
    `,
    specifications: {
      'المعالج': 'Intel Core i5-1355U (الجيل 13)',
      'ذاكرة الوصول العشوائي': '8 جيجابايت DDR4',
      'التخزين': '512 جيجابايت SSD',
      'حجم الشاشة': '15.6 بوصة Full HD',
      'دقة الشاشة': '1920 x 1080 بكسل',
      'كارت الرسوميات': 'Intel Iris Xe Graphics',
      'نظام التشغيل': 'Windows 11 Home',
      'البطارية': '42Wh Li-ion',
      'الوزن': '2.5 كيلوجرام',
      'الأبعاد': '35.9 x 23.2 x 1.99 سم',
      'المنافذ': 'USB 3.2, USB-C, HDMI, مقبس الصوت',
      'الشبكة': 'Wi-Fi 6, Bluetooth 5.0'
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="description-content">
            <h3>وصف تفصيلي للمنتج</h3>
            <p>{productDescription.description}</p>
            
            <div className="key-features">
              <h4>المميزات الرئيسية:</h4>
              <ul>
                <li>معالج Intel Core i5 عالي الأداء</li>
                <li>ذاكرة تخزين SSD فائقة السرعة</li>
                <li>شاشة Full HD بألوان زاهية</li>
                <li>تصميم نحيف وخفيف الوزن</li>
                <li>بطارية طويلة المدى</li>
                <li>منافذ متعددة للاتصال</li>
              </ul>
            </div>
          </div>
        );
      
      case 'specifications':
        return (
          <div className="specifications-content">
            <h3>المواصفات التقنية</h3>
            <div className="specs-grid">
              {Object.entries(productDescription.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
                     </div>
         );
       
       default:
         return null;
    }
  };

  return (
    <div className="product-description-section">
      <div className="container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription; 