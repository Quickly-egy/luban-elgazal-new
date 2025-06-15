import React, { useState, useEffect } from 'react';
import { FaHeart, FaQuestionCircle, FaUser, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from './ProductCard.module.css';

const ProductCard = ({ 
  product = {
    id: 1,
    name: "باقة العناية بالشعر",
    weight: "250g",
    image: "/images/hair-care-product.jpg",
    originalPrice: 8711.25,
    discountedPrice: 3750,
    discountPercentage: 57,
    rating: 4,
    reviewsCount: 93,
    inStock: true
  },
  onRatingClick,
  showTimer = true
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 32,
    minutes: 19,
    seconds: 11
  });
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const deliveryLabels = [
    'توصيل مجاني',
    'توصيل سريع',
    'شحن مجاني'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer has reached 00:00:00
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let typingTimer;
    const currentText = deliveryLabels[currentLabelIndex];
    
    if (isTyping) {
      // كتابة النص
      if (displayText.length < currentText.length) {
        typingTimer = setTimeout(() => {
          setDisplayText(prev => currentText.slice(0, prev.length + 1));
        }, 100);
      } else {
        // انتظار ثم بدء المسح
        typingTimer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      // مسح النص
      if (displayText.length > 0) {
        typingTimer = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, 50);
      } else {
        // الانتقال للنص التالي
        setCurrentLabelIndex(prevIndex => 
          (prevIndex + 1) % deliveryLabels.length
        );
        setIsTyping(true);
      }
    }

    return () => clearTimeout(typingTimer);
  }, [displayText, currentLabelIndex, isTyping]);

  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // إضافة المنتج للسلة
    console.log('إضافة المنتج للسلة:', product.id);
  };

  const handleRatingClick = () => {
    if (onRatingClick) {
      onRatingClick(product);
    }
  };



  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className={styles.starFilled} size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className={styles.starHalf} size={16} />);
      } else {
        stars.push(<FaStar key={i} className={styles.starEmpty} size={16} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.productCard}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        {/* Timer and Discount Badge - Now inside image container */}
        <div className={styles.cardHeader}>
          {showTimer && (
            <div className={`${styles.timer} ${timeLeft.hours === 0 && timeLeft.minutes < 10 ? styles.timerUrgent : ''}`}>
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </div>
          )}
          <div className={styles.bestSeller}>الأكثر مبيعاً</div>
        </div>
        
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.productImage}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.imagePlaceholder} style={{display: 'none'}}>
          صورة المنتج
        </div>
      </div>

      {/* Favorite Button */}
      <button 
        className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
        onClick={handleFavoriteToggle}
      >
        <FaHeart 
          size={20} 
          color={isFavorite ? '#ff4757' : '#ddd'}
        />
      </button>

      {/* Discount Badge */}
      {product.discountPercentage && (
        <div className={styles.discountBadge}>
          خصم {product.discountPercentage}%
        </div>
      )}

      {/* Product Info */}
      <div className={styles.productInfo}>
        {/* Product Name with weight */}
        <div className={styles.productNameContainer}>
          <h3 className={styles.productName}>{product.name}</h3>
          <span className={styles.productWeight}>{product.weight}</span>
        </div>

        {/* Rating directly under product name */}
        <div className={styles.rating} onClick={handleRatingClick}>
          <div className={styles.stars}>
            {renderStars(product.rating)}
          </div>
          <span className={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>

        {/* Price under rating */}
        <div className={styles.priceContainer}>
          <span className={styles.discountedPrice}>
            EGP {product.discountedPrice.toLocaleString('en-US')}
          </span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              EGP {product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.cardFooter}>
        <button 
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          أضف للسلة
        </button>
        <div className={styles.deliveryLabel}>
          {displayText}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 