import React from 'react';
import { useStore } from '../../../store/useStore';
import { formatPrice } from '../../../utils/formatters';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);
  
  const handleAddToCart = () => {
    addToCart(product);
    alert('تم إضافة المنتج للسلة بنجاح!');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/placeholder.jpg'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="price">{formatPrice(product.price)}</span>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          إضافة للسلة
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 