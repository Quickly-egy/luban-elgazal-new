import React from 'react';
import './ProductDescription.css';

const ProductDescription = ({ product }) => {
  // استخدام الوصف من API أو وصف افتراضي
  const description = product?.description || `
    ${product?.name || 'هذا المنتج'} هو خيار ممتاز يتميز بالجودة العالية والأداء المتميز. 
    تم تصميمه بعناية فائقة لتلبية احتياجاتك ومتطلباتك اليومية.
    
    يوفر هذا المنتج تجربة استخدام استثنائية بفضل مكوناته عالية الجودة والتقنيات المتطورة المستخدمة في تصنيعه.
    
    مناسب للاستخدام اليومي ويضمن لك الحصول على أفضل النتائج مع الاستمتاع بالراحة والأمان.
  `;

  // المميزات: بعضها من API والباقي ثابت
  const features = [
    ...(product?.features || []),
    'منتج أصلي 100%',
    'جودة عالية مضمونة',
    'ضمان الشركة المصنعة',
    'خدمة عملاء متميزة',
    'شحن سريع وآمن'
  ];

  return (
    <div className="product-description-section">
      <div className="container">
        <div className="description-header">
          <h2>وصف المنتج</h2>
        </div>
        
        <div className="description-content">
          <h3>وصف تفصيلي للمنتج</h3>
          <p>{description}</p>
          
          <div className="key-features">
            <h4>المميزات الرئيسية:</h4>
            <ul>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default ProductDescription; 