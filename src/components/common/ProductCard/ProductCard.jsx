import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaQuestionCircle, FaUser, FaStar, FaStarHalfAlt, FaCheck, FaTimes } from 'react-icons/fa';
import useWishlistStore from '../../../stores/wishlistStore';
import useCartStore from '../../../stores/cartStore';
import { useCurrency } from '../../../hooks';
import styles from './ProductCard.module.css';

const ProductCard = ({
  product,
  onRatingClick,
  showTimer = true
}) => {
  // التحقق من وجود المنتج
  if (!product) {
    return null;
  }
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const isFavorite = isInWishlist(product.id);
  const isProductInCart = isInCart(product.id);

  // حالة الإشعارات
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'remove'

  const [timeLeft, setTimeLeft] = useState({
    hours: 32,
    minutes: 19,
    seconds: 11
  });
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Get dynamic labels from product discount hashtags
  const deliveryLabels = React.useMemo(() => {
    if (product.discount_info?.has_discount && product.discount_info.active_discount?.hashtags?.length > 0) {
      return product.discount_info.active_discount.hashtags;
    }
    // Return empty array if no hashtags available
    return [];
  }, [product.discount_info]);

  // Check if we should show the animated text
  const shouldShowDeliveryLabel = deliveryLabels.length > 0;

  // دالة لإظهار الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

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
    // Only run animation if there are hashtags to display
    if (!shouldShowDeliveryLabel || deliveryLabels.length === 0) {
      setDisplayText('');
      return;
    }

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
  }, [displayText, currentLabelIndex, isTyping, shouldShowDeliveryLabel, deliveryLabels]);

  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  const handleFavoriteToggle = () => {
    console.log('ProductCard: محاولة تغيير حالة المفضلة للمنتج:', product);
    const wasAdded = toggleWishlist(product);

    // يمكن إضافة إشعار هنا
    if (wasAdded) {
      console.log('تم إضافة المنتج للمفضلة:', product.name, 'البيانات الكاملة:', product);
      showNotification('تم إضافة المنتج للمفضلة', 'success');
    } else {
      console.log('تم حذف المنتج من المفضلة:', product.name);
      showNotification('تم حذف المنتج من المفضلة', 'remove');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    console.log('ProductCard: محاولة إضافة المنتج:', product);

    if (isProductInCart) {
      // Remove from cart if already in cart
      const success = removeFromCart(product.id);
      if (success) {
        console.log('تم إزالة المنتج من السلة:', product.name);
        showNotification('تم إزالة المنتج من السلة', 'remove');
      }
    } else {
      // Add to cart if not in cart
      const success = addToCart(product);
      if (success) {
        console.log('تم إضافة المنتج للسلة:', product.name, 'البيانات الكاملة:', product);
        showNotification('تم إضافة المنتج للسلة', 'success');
      }
    }
  };

  const handleRatingClick = () => {
    console.log('ProductCard: handleRatingClick called for product:', product.name);
    if (onRatingClick) {
      console.log('ProductCard: calling onRatingClick callback');
      onRatingClick(product);
    } else {
      console.log('ProductCard: no onRatingClick callback provided');
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, {
      state: { product }
    });
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
    <div className={styles.productCard} onClick={handleProductClick}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${notificationType === 'remove' ? styles.notificationRemove : styles.notificationSuccess}`}>
          {notificationType === 'success' ? (
            <FaCheck className={styles.notificationIcon} />
          ) : (
            <FaTimes className={styles.notificationIcon} />
          )}
          <span>{notification}</span>
        </div>
      )}

      {/* Product Image */}
      <div className={styles.imageContainer}>
        {/* Timer and Discount Badge - Now inside image container */}
        <div className={styles.cardHeader}>
          {showTimer && (
            <div className={`${styles.timer} ${timeLeft.hours === 0 && timeLeft.minutes < 10 ? styles.timerUrgent : ''}`}>
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </div>
          )}
          {product.label?.name && (
            <div
              className={styles.bestSeller}
              style={{
                backgroundColor: product.label.color || '#4CAF50'
              }}
            >
              {product.label.name}
            </div>
          )}
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
        <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
          صورة المنتج
        </div>
      </div>

      {/* Favorite Button */}
      <button
        className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteToggle();
        }}
      >
        <FaHeart
          size={20}
          color={isFavorite ? '#ff4757' : '#ddd'}
        />
      </button>

      {/* Discount Badge */}
      {product.discount_info?.has_discount && (
        <div className={styles.discountBadge}>
          {product.discount_info.active_discount?.type === 'percentage'
            ? `خصم ${product.discount_info.discount_percentage}%`
            : `خصم ${product.discount_info.savings}`
          }
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
        <div className={styles.rating} onClick={(e) => {
          e.stopPropagation();
          handleRatingClick();
        }}>
          <div className={styles.stars}>
            {renderStars(product.rating)}
          </div>
          <span className={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>

        {/* Price under rating */}
        <div className={styles.priceContainer}>
          <span className={styles.discountedPrice}>
            {formatPrice(product.selling_price || product.discountedPrice || 0)}
          </span>
          {product.discount_info?.has_discount && (
            <span className={styles.originalPrice}>
              {formatPrice(product.original_price || product.originalPrice || 0)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.cardFooter}>
        <button
          className={`${styles.addToCartBtn} ${isProductInCart ? styles.removeFromCartBtn : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {isProductInCart ? 'إزالة من السلة' : 'أضف للسلة'}
        </button>
        {shouldShowDeliveryLabel && (
          <div className={styles.deliveryLabel}>
            {displayText}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
