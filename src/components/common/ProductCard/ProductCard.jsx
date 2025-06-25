import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaQuestionCircle,
  FaUser,
  FaStar,
  FaStarHalfAlt,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import useWishlistStore from "../../../stores/wishlistStore";
import useCartStore from "../../../stores/cartStore";
import { useCurrency } from "../../../hooks";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product, onRatingClick, showTimer = true }) => {
  // All React hooks must be called before any early returns
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // إضافة console.log للتحقق من المنتجات التي عليها خصم
  React.useEffect(() => {
    if (product.discount_details) {
      console.log('منتج عليه خصم:', {
        اسم_المنتج: product.name,
        السعر_الأصلي: product.selling_price,
        تفاصيل_الخصم: product.discount_details,
        نوع_الخصم: product.discount_details.type,
        قيمة_الخصم: product.discount_details.value,
        السعر_النهائي: product.discount_details.final_price,
        مبلغ_التوفير: product.discount_details.discount_amount
      });
    }
  }, [product]);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  // حالة الإشعارات
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'remove'

  // حالة التايمر
  const [timeLeft, setTimeLeft] = useState(null);

  // تحويل التاريخ إلى كائن Date
  const calculateTimeLeft = () => {
    if (!product.discount_details?.end_at) return null;

    const endDate = new Date(product.discount_details.end_at);
    const now = new Date();
    const difference = endDate - now;

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  useEffect(() => {
    if (product.discount_details?.timing_type === 'scheduled') {
      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        if (!newTimeLeft) {
          clearInterval(timer);
        }
        setTimeLeft(newTimeLeft);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product]);

  // Get dynamic labels from product discount hashtags - moved before early return
  const deliveryLabels = React.useMemo(() => {
    if (!product) return [];
    if (
      product.discount_info?.has_discount &&
      product.discount_info.active_discount?.hashtags?.length > 0
    ) {
      return product.discount_info.active_discount.hashtags;
    }
    // Return empty array if no hashtags available
    return [];
  }, [product]);

  // Check if we should show the animated text
  const shouldShowDeliveryLabel = deliveryLabels.length > 0;

  // دالة لإظهار الإشعار
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

  // التحقق من وجود المنتج
  if (!product) {
    return null;
  }
  const isFavorite = isInWishlist(product.id);
  const isProductInCart = isInCart(product.id);

  const handleFavoriteToggle = () => {
    console.log("ProductCard: محاولة تغيير حالة المفضلة للمنتج:", product);
    const wasAdded = toggleWishlist(product);

    // يمكن إضافة إشعار هنا
    if (wasAdded) {
      console.log(
        "تم إضافة المنتج للمفضلة:",
        product.name,
        "البيانات الكاملة:",
        product
      );
      showNotification("تم إضافة المنتج للمفضلة", "success");
    } else {
      console.log("تم حذف المنتج من المفضلة:", product.name);
      showNotification("تم حذف المنتج من المفضلة", "remove");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    console.log("ProductCard: محاولة إضافة المنتج:", product);

    if (isProductInCart) {
      // Remove from cart if already in cart
      const success = removeFromCart(product.id);
      if (success) {
        console.log("تم إزالة المنتج من السلة:", product.name);
        showNotification("تم إزالة المنتج من السلة", "remove");
      }
    } else {
      // Add to cart if not in cart
      const success = addToCart(product);
      if (success) {
        console.log(
          "تم إضافة المنتج للسلة:",
          product.name,
          "البيانات الكاملة:",
          product
        );
        showNotification("تم إضافة المنتج للسلة", "success");
      }
    }
  };

  const handleRatingClick = () => {
    console.log(
      "ProductCard: handleRatingClick called for product:",
      product.name
    );
    if (onRatingClick) {
      console.log("ProductCard: calling onRatingClick callback");
      onRatingClick(product);
    } else {
      console.log("ProductCard: no onRatingClick callback provided");
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className={styles.starFilled} size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <FaStarHalfAlt key={i} className={styles.starHalf} size={16} />
        );
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
        <div
          className={`${styles.notification} ${
            notificationType === "remove"
              ? styles.notificationRemove
              : styles.notificationSuccess
          }`}
        >
          {notificationType === "success" ? (
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
          {timeLeft && showTimer && (
            <div className={`${styles.timer} ${
              timeLeft.hours === 0 && timeLeft.minutes < 30 ? styles.timerUrgent : ''
            }`}>
              <FaClock style={{ marginLeft: '4px' }} />
              {timeLeft.days > 0 ? (
                `${timeLeft.days} يوم ${timeLeft.hours} ساعة`
              ) : (
                `${timeLeft.hours}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
              )}
            </div>
          )}
          {product.label?.name && (
            <div
              className={styles.bestSeller}
              style={{
                backgroundColor: product.label.color || "#4CAF50",
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
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className={styles.imagePlaceholder} style={{ display: "none" }}>
          صورة المنتج
        </div>
      </div>

      {/* Favorite Button */}
      <button
        className={`${styles.favoriteBtn} ${
          isFavorite ? styles.favoriteActive : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteToggle();
        }}
      >
        <FaHeart size={20} color={isFavorite ? "#ff4757" : "#ddd"} />
      </button>

      {/* Discount Badge */}
      {product.discount_details && (
        <div className={styles.discountBadge}>
          {product.discount_details.type === 'percentage' ? (
            <>خصم {product.discount_details.value}%</>
          ) : (
            <>خصم {formatPrice(product.discount_details.value)}</>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className={styles.productInfo}>
        {/* Product Name with weight */}
        <div className={styles.productNameContainer}>
          <h3 className={styles.productName}>{product.name}</h3>
          {product.weight &&
            product.weight !== null &&
            product.weight !== undefined &&
            product.weight !== "" &&
            product.weight !== "N/A" &&
            product.weight.toString().trim() !== "" && (
              <span className={styles.productWeight}>{product.weight}</span>
            )}
        </div>

        {/* Rating directly under product name */}
        <div
          className={styles.rating}
          onClick={(e) => {
            e.stopPropagation();
            handleRatingClick();
          }}
        >
          <div className={styles.stars}>{renderStars(product.rating)}</div>
          <span className={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>

        {/* Price under rating */}
        <div className={styles.priceContainer}>
          {product.discount_details ? (
            <span className={styles.discountedPrice}>
              {formatPrice(product.discount_details.final_price)}
            </span>
          ) : (
            <span className={styles.discountedPrice}>
              {formatPrice(product.selling_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={styles.stockStatus}>
          <span className={product.inStock ? styles.inStock : styles.outOfStock}>
            {product.inStock ? (
              <>
                <FaCheck size={14} style={{ marginLeft: '4px' }} />
                متوفر
              </>
            ) : (
              <>
                <FaTimes size={14} style={{ marginLeft: '4px' }} />
                غير متوفر
              </>
            )}
          </span>
          {product.inStock && product.stock_info && (
            <span className={styles.stockQuantity}>
              الكمية المتوفرة: {product.stock_info.total_available}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.cardFooter}>
        <button
          className={`${styles.addToCartBtn} ${
            isProductInCart ? styles.removeFromCartBtn : ""
          }`}
          onClick={handleAddToCart}
        >
          {isProductInCart ? "إزالة من السلة" : "أضف للسلة"}
        </button>
        {shouldShowDeliveryLabel && (
          <div className={styles.deliveryLabel}>{displayText}</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
