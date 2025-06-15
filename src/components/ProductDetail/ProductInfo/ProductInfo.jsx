import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart, FaPlus, FaMinus, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaGift, FaPaypal } from 'react-icons/fa';
import ReviewsModal from '../../common/ReviewsModal/ReviewsModal';
import './ProductInfo.css';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half" />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };



  return (
    <div className="product-info">
      {/* Brand */}
      <div className="product-brand">{product.brand}</div>
      
      {/* Title */}
      <h1 className="product-title">{product.name}</h1>
      
      {/* Rating & Reviews */}
      <div className="product-rating">
        <div 
          className="stars-container"
          onClick={() => setIsReviewsModalOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          {renderStars(product.rating)}
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount} تقييم)</span>
        </div>
      </div>
      
      {/* Features */}
      <div className="product-features">
        {product.features.map((feature, index) => (
          <div key={index} className="feature-item">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Product Weight */}
      <div className="product-weight">
        <span className="weight-label">الوزن:</span>
        <span className="weight-value">2.5 كيلو</span>
      </div>
      
      {/* Price Section */}
      <div className="price-section">
        <div className="price-container">
          <span className="current-price">${product.salePrice}</span>
          <span className="original-price">${product.originalPrice}</span>
        </div>
        
                 {/* Countdown Timer */}
         <div className="countdown-timer">
           <div className="timer-item">
             <span className="timer-value">{timeLeft.days}</span>
             <span className="timer-label">يوم</span>
           </div>
           <div className="timer-separator">:</div>
           <div className="timer-item">
             <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
             <span className="timer-label">ساعة</span>
           </div>
           <div className="timer-separator">:</div>
           <div className="timer-item">
             <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
             <span className="timer-label">دقيقة</span>
           </div>
           <div className="timer-separator">:</div>
           <div className="timer-item">
             <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
             <span className="timer-label">ثانية</span>
           </div>
         </div>
      </div>
      
      {/* Stock Status */}
      <div className="stock-status">
        <span className={`stock-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'متوفر' : 'غير متوفر'}
        </span>
      </div>
      
      {/* Quantity & Actions */}
      <div className="product-actions">
        <div className="quantity-selector">
          <button 
            className="qty-btn"
            onClick={() => handleQuantityChange('decrease')}
            disabled={quantity <= 1}
          >
            <FaMinus />
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            className="qty-btn"
            onClick={() => handleQuantityChange('increase')}
          >
            <FaPlus />
          </button>
        </div>
        
        <button className="add-to-cart-btn">
          <FaShoppingCart />
          <span>إضافة للسلة</span>
        </button>
        
        <button className="buy-now-btn">
          اشتري الآن
        </button>
      </div>
      

      

      

      
      {/* Reviews Modal */}
      <ReviewsModal 
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        product={{
          name: product.name,
          image: product.images?.[0] || 'https://via.placeholder.com/100'
        }}
      />
    </div>
  );
};

export default ProductInfo; 