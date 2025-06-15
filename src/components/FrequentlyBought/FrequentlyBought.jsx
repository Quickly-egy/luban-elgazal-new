import React, { useState } from 'react';
import './FrequentlyBought.css';

const FrequentlyBought = () => {
  const [selectedProducts, setSelectedProducts] = useState([true, true, true]);

  const products = [
    {
      id: 1,
      name: 'لابتوب Asus Vivobook I5 1355U، 8GB رام، 512GB SSD',
      price: 999,
      originalPrice: 1536,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
      isMainProduct: true
    },
    {
      id: 2,
      name: 'تنورة جينز نسائية من LV مع تفاصيل جلدية',
      price: 1390,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'حذاء رياضي Nike Air Max للرجال والنساء',
      price: 148,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop'
    }
  ];

  const handleProductToggle = (index) => {
    if (index === 0) return; // Main product cannot be unchecked
    const newSelection = [...selectedProducts];
    newSelection[index] = !newSelection[index];
    setSelectedProducts(newSelection);
  };

  const calculateTotal = () => {
    return products.reduce((total, product, index) => {
      return selectedProducts[index] ? total + product.price : total;
    }, 0);
  };

  const getSelectedCount = () => {
    return selectedProducts.filter(Boolean).length;
  };

  return (
    <div className="frequently-bought-section">
      <div className="container">
        <h2 className="section-title">المنتجات المشتراة معاً بكثرة</h2>
        
        <div className="frequently-bought-content">
          <div className="products-row">
            {products.map((product, index) => (
              <React.Fragment key={product.id}>
                <div className={`product-card ${!selectedProducts[index] ? 'unselected' : ''}`}>
                  <div className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProducts[index]}
                      onChange={() => handleProductToggle(index)}
                      disabled={index === 0}
                    />
                  </div>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="product-price">
                      <span className="current-price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < products.length - 1 && (
                  <div className="plus-icon">+</div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="summary-section">
            <div className="product-list">
              <div className="main-product">
                <span>هذا المنتج: {products[0].name}</span>
                <span className="price">
                  ${products[0].price} 
                  <span className="original-price">${products[0].originalPrice}</span>
                </span>
              </div>
              
              {products.slice(1).map((product, index) => 
                selectedProducts[index + 1] && (
                  <div key={product.id} className="additional-product">
                    <span>{product.name}</span>
                    <span className="price">${product.price}</span>
                  </div>
                )
              )}
            </div>
            
            <div className="total-section">
              <div className="total-price">
                <span className="total-label">الإجمالي:</span>
                <span className="total-amount">${calculateTotal().toLocaleString()}</span>
              </div>
              
              <button className="add-all-btn">
                إضافة الكل للسلة ({getSelectedCount()} منتجات)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBought; 