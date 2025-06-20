import React, { useState } from 'react';
import { useCurrency } from '../../hooks';
import './FrequentlyBought.css';

const FrequentlyBought = () => {
  const { formatPrice } = useCurrency();

  // Mock data for frequently bought together products
  const products = [
    {
      id: 1,
      name: 'منتج العناية بالشعر الأساسي',
      price: 299,
      originalPrice: 399,
      image: '/images/hair-care-product.jpg',
      discount: 25
    },
    {
      id: 2,
      name: 'شامبو طبيعي مغذي',
      price: 89,
      originalPrice: 120,
      image: '/images/hair-care-product.jpg',
      discount: 15
    },
    {
      id: 3,
      name: 'بلسم مرطب للشعر',
      price: 75,
      originalPrice: 95,
      image: '/images/hair-care-product.jpg',
      discount: 20
    },
    {
      id: 4,
      name: 'زيت طبيعي للشعر',
      price: 150,
      originalPrice: 200,
      image: '/images/hair-care-product.jpg',
      discount: 25
    }
  ];

  // State to track selected products (first product is always selected)
  const [selectedProducts, setSelectedProducts] = useState([true, false, false, false]);

  const handleProductToggle = (index) => {
    if (index === 0) return; // Can't deselect the main product

    const newSelected = [...selectedProducts];
    newSelected[index] = !newSelected[index];
    setSelectedProducts(newSelected);
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
    <div className="frequently-bought">
      <div className="container">
        <div className="frequently-bought-header">
          <h2>منتجات يتم شراؤها معاً</h2>
          <p>احصل على أفضل النتائج عند شراء هذه المنتجات معاً</p>
        </div>

        <div className="products-container">
          <div className="products-selection">
      
          </div>

          <div className="summary-section">
            <div className="product-list">
              <div className="main-product">
                <span>هذا المنتج: {products[0].name}</span>
                <span className="price">
                  {formatPrice(products[0].price)}
                  <span className="original-price">{formatPrice(products[0].originalPrice)}</span>
                </span>
              </div>

              {products.slice(1).map((product, index) =>
                selectedProducts[index + 1] && (
                  <div key={product.id} className="additional-product">
                    <span>{product.name}</span>
                    <span className="price">{formatPrice(product.price)}</span>
                  </div>
                )
              )}
            </div>

            <div className="total-section">
              <div className="total-price">
                <span className="total-label">الإجمالي:</span>
                <span className="total-amount">{formatPrice(calculateTotal())}</span>
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