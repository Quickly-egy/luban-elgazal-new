import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGift,
  FaPaypal,
  FaCheck,
  FaTimes,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReviewsModal from "../../common/ReviewsModal/ReviewsModal";
import useWishlistStore from "../../../stores/wishlistStore";
import useCartStore from "../../../stores/cartStore";
import { useCurrency } from "../../../hooks";
import "./ProductInfo.css";

const ProductInfo = ({ product }) => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasActiveDiscount, setHasActiveDiscount] = useState(false);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const isFavorite = isInWishlist(product?.id);
  const isProductInCart = isInCart(product?.id);

  // دالة لإظهار الإشعار
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

  // دالة لحساب الوقت المتبقي من تاريخ انتهاء الخصم
  const calculateTimeLeft = (endDate) => {
    const now = new Date().getTime();
    const endTime = new Date(endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  // Countdown timer effect
  useEffect(() => {
    // التحقق من وجود خصم نشط مجدول
    const activeDiscount = product?.discount_info?.active_discount;
    const hasDiscount = product?.discount_info?.has_discount;

    if (hasDiscount && activeDiscount && activeDiscount.end_at && activeDiscount.timing_type === 'scheduled') {
      setHasActiveDiscount(true);
      
      // حساب الوقت المتبقي مرة واحدة في البداية
      const initialTimeLeft = calculateTimeLeft(activeDiscount.end_at);
      setTimeLeft(initialTimeLeft);

      // تحديث العداد كل ثانية
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(activeDiscount.end_at);
        setTimeLeft(newTimeLeft);

        // إذا انتهى الوقت، إيقاف العداد
        if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
          setHasActiveDiscount(false);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setHasActiveDiscount(false);
    }
  }, [product]);

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

  const handleAddToCart = () => {
    if (!product) return;

    if (isProductInCart) {
      const success = removeFromCart(product.id);
      if (success) {
        showNotification("تم إزالة المنتج من السلة", "remove");
      }
    } else {
      const success = addToCart({ ...product, quantity: 1 });
      if (success) {
        showNotification("تم إضافة المنتج للسلة", "success");
      }
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const wasAdded = toggleWishlist(product);
    if (wasAdded) {
      showNotification("تم إضافة المنتج للمفضلة", "success");
    } else {
      showNotification("تم حذف المنتج من المفضلة", "remove");
    }
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock) return;

    // Add the product to cart first
    const success = addToCart({ ...product, quantity: 1 });
    if (success) {
      // Navigate to checkout page
      navigate("/checkout");
    }
  };

  if (!product) {
    return <div>جاري تحميل معلومات المنتج...</div>;
  }

  return (
    <div className="product-info">
      {/* Notification */}
      {notification && (
        <div
          className={`notification ${
            notificationType === "remove"
              ? "notification-remove"
              : "notification-success"
          }`}
        >
          {notificationType === "success" ? (
            <FaCheck className="notification-icon" />
          ) : (
            <FaTimes className="notification-icon" />
          )}
          <span>{notification}</span>
        </div>
      )}

      {/* Brand */}
      <div className="product-brand">{product.brand}</div>

      {/* Category */}
      <div className="product-category">{product.category || "غير محدد"}</div>

      {/* Title */}
      <h1 className="product-title">{product.name}</h1>

      {/* Rating & Reviews */}
      <div className="product-rating">
        <div
          className="stars-container"
          onClick={() => setIsReviewsModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          {renderStars(product.rating)}
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount} تقييم)</span>
        </div>
      </div>

      {/* Discount Badge - Moved here after rating */}
      {product.discount_info?.has_discount && (
        <div className="discount-section">
          <div className="discount-badge-standalone">
            {product.discount_info.active_discount?.type === "percentage"
              ? `خصم ${product.discount_info.discount_percentage}%`
              : `خصم ${product.discount_info.savings}`}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="product-features">
        {product.features?.map((feature, index) => (
          <div key={index} className="feature-item">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-container">
          <span className="current-price">
            {formatPrice(product.salePrice || product.selling_price || 0)}
          </span>
          {product.discount_info?.has_discount && (
            <span className="original-price">
              {formatPrice(
                product.original_price || product.originalPrice || 0
              )}
            </span>
          )}
        </div>

        {/* Countdown Timer - يظهر فقط عند وجود خصم نشط مجدول */}
        {hasActiveDiscount && (
          <div className="countdown-section">
            <div className="countdown-header">
              <FaBolt className="countdown-icon" />
              <span className="countdown-text">ينتهي العرض خلال:</span>
            </div>
            <div className="countdown-timer">
              <div className="timer-item">
                <span className="timer-value">{timeLeft.days}</span>
                <span className="timer-label">يوم</span>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-item">
                <span className="timer-value">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="timer-label">ساعة</span>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-item">
                <span className="timer-value">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="timer-label">دقيقة</span>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-item">
                <span className="timer-value">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="timer-label">ثانية</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Weight */}
      {product.weight &&
        product.weight !== null &&
        product.weight !== undefined &&
        product.weight !== "" &&
        product.weight !== "N/A" &&
        product.weight.toString().trim() !== "" && (
          <div className="product-weight">
            <span className="weight-label">الوزن:</span>
            <span className="weight-value">{product.weight}</span>
          </div>
        )}

      {/* Stock Status */}
      <div className="stock-status">
        <span
          className={`stock-indicator ${
            product.inStock ? "in-stock" : "out-of-stock"
          }`}
        >
          {product.inStock ? "" : "غير متوفر"}
        </span>
      </div>

      {/* Tabby Payment Options */}
      <div className="tabby-payment-section">
        <div className="tabby-logo">
          <span className="tabby-text">tabby</span>
        </div>
        <div className="tabby-description">
          <span className="tabby-amount">
            ابتداء من {formatPrice((product.salePrice || product.selling_price || 0) / 4)} 
          </span>
          <span className="tabby-terms">
            أو على 4 دفعات بدون فوائد. متوافق مع أحكام الشريعة. 
          </span>
          <button className="tabby-learn-more">
            لمعرفة المزيد
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="product-actions">
        <button
          className="buy-now-btn"
          onClick={handleBuyNow}
          disabled={!product.inStock}
        >
          <FaBolt />
          <span>شراء الآن</span>
        </button>

        <button
          className={`add-to-cart-btn ${
            isProductInCart ? "remove-from-cart" : ""
          }`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <FaShoppingCart />
          <span>{isProductInCart ? "إزالة من السلة" : "إضافة للسلة"}</span>
        </button>

        <button
          className={`wishlist-btn ${isFavorite ? "active" : ""}`}
          onClick={handleToggleWishlist}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
          <span>{isFavorite ? "في المفضلة" : "أضف للمفضلة"}</span>
        </button>
      </div>

      {/* Payment Security & Guarantees */}
      <div className="payment-security-section">
        {/* Return Guarantee */}
        <div className="guarantee-item">
          <span className="guarantee-text">ضمان استبدال واسترجاع لمدة 14 يوم</span>
        </div>
        
        {/* Payment Security */}
        <div className="payment-security-item">
          <span className="security-text">ضمان مدفوعات آمنة</span>
          <div className="payment-methods">
            <div className="payment-method mastercard">
              <span className="card-circle red"></span>
              <span className="card-circle orange"></span>
            </div>
            <div className="payment-method tabby-mini">
              <span className="tabby-mini-text">tabby</span>
            </div>
            <div className="payment-method visa">
              <span className="visa-text">VISA</span>
            </div>
            <div className="payment-method mada">
              <span className="mada-text">مدى</span>
              <span className="mada-en">mada</span>
            </div>
            <div className="payment-method applepay">
              <span className="apple-icon">🍎</span>
              <span className="pay-text">Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductInfo;
