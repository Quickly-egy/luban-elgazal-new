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
import useAuthStore from "../../../stores/authStore";
import { useCurrency } from "../../../hooks";
import "./ProductInfo.css";

// Import payment method images
import visaImage from "../../../assets/payment methods/فيزا .png";
import mastercardImage from "../../../assets/payment methods/ماستر كارد.png";
import applePayImage from "../../../assets/payment methods/Apple_Pay_logo.svg.png";
import tabbyImage from "../../../assets/payment methods/تابي .png";
import samsungPayImage from "../../../assets/payment methods/سامسونج باي.png";
import madaImage from "../../../assets/payment methods/مدى.png";

const ProductInfo = ({ product }) => {
  const { formatPrice, getProductPrice } = useCurrency();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const {
    addToCart,
    removeFromCart,
    isInCart,
    getItemQuantity,
    updateQuantity: updateCartQuantity,
    cartItems,
  } = useCartStore();
  const isFavorite = isInWishlist(product?.id);
  const isProductInCart = isInCart(product?.id);

  // Update quantity when cart changes
  useEffect(() => {
    if (isProductInCart && product?.id) {
      const cartQuantity = getItemQuantity(product.id);
      setQuantity(cartQuantity);
    }
  }, [cartItems, product?.id, isProductInCart, getItemQuantity]);

  // دالة لإظهار الإشعار
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

  // دالة لزيادة الكمية
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (isProductInCart && product?.id) {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  // دالة لتقليل الكمية
  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (isProductInCart && product?.id) {
        updateCartQuantity(product.id, newQuantity);
      }
    }
  };

  // دالة لحساب الوقت المتبقي من تاريخ انتهاء الخصم
  const calculateTimeLeft = () => {
    if (!product?.discount_details?.end_at) return null;

    const now = new Date().getTime();
    const endTime = new Date(
      product.discount_details.end_at.replace(" ", "T")
    ).getTime();
    const difference = endTime - now;

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  // تحديث العداد كل ثانية
  useEffect(() => {
    if (product?.discount_details?.timing_type === "scheduled") {
      const updateTimer = () => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
      };

      // تحديث أولي
      updateTimer();

      // تحديث كل ثانية
      const timer = setInterval(updateTimer, 1000);

      return () => clearInterval(timer);
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
    
    // التحقق من توفر المنتج في المخزون قبل الإضافة
    if (!product.inStock && !isProductInCart) {
      showNotification("عذراً، هذا المنتج نفذ من المخزون", "remove");
      return;
    }

    if (isProductInCart) {
      const success = removeFromCart(product.id);
      if (success) {
        if (product.type === "package") {
          showNotification("تم إزالة الباقة من السلة", "remove");
        } else {
          showNotification("تم إزالة المنتج من السلة", "remove");
        }
        setQuantity(1); // Reset quantity when removing from cart
      }
    } else {
      // للباقات: إضافة بدون quantity (مثل PackageCard)
      if (product.type === "package") {
      
        const success = addToCart(product);
        if (success) {
          showNotification("تم إضافة الباقة للسلة", "success");
        }
      } else {
        // للمنتجات العادية: إضافة مع quantity
        const success = addToCart(product, quantity);
        if (success) {
          showNotification(`تم إضافة ${quantity} من المنتج للسلة`, "success");
          // No need to setQuantity here as it will be updated by the useEffect when cartItems changes
        }
      }
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    // منع إضافة المنتجات غير المتوفرة للمفضلة
    if (!product.inStock && !isFavorite) {
      showNotification("لا يمكن إضافة منتج نفذ مخزونه للمفضلة", "remove");
      return;
    }

    const wasAdded = toggleWishlist(product);
    if (wasAdded) {
      showNotification("تم إضافة المنتج للمفضلة", "success");
    } else {
      showNotification("تم حذف المنتج من المفضلة", "remove");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // التحقق من توفر المنتج في المخزون
    if (!product.inStock) {
      showNotification("عذراً، هذا المنتج نفذ من المخزون", "remove");
      return;
    }

    // التحقق من تسجيل الدخول قبل الشراء
    if (!token || !user) {
      showNotification("يجب تسجيل الدخول أولاً للشراء", "remove");
      return;
    }

    // Add the product to cart first with selected quantity
    const success = addToCart(product, quantity);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="product-category">{product.category || "غير محدد"}</div>

        {product.discount_details && (
          <div className="discount-section">
            <div className="discount-badge-standalone">
              {product.discount_details.type === "percentage"
                ? `خصم ${product.discount_details.value}%`
                : `خصم ${formatPrice(product.discount_details.value)}`}
            </div>
          </div>
        )}
      </div>
      {/* Discount Badge - Moved here after rating */}

      {/* Title */}
      <h1 className="product-title">{product.name}</h1>

      {/* Tiny Package Products - Only show for packages */}
      {product.type === "package" &&
        product.products &&
        product.products.length > 0 && (
          <div className="tiny-package-products">
            {product.products.map((packageProduct) => (
              <div key={packageProduct.id} className="tiny-product-item">
                <div className="tiny-product-image">
                  <img
                    src={packageProduct.image || packageProduct.main_image_url}
                    alt={packageProduct.name}
                    onError={(e) => {
                      e.target.src = "/images/default-product.jpg";
                    }}
                  />
                </div>
                <div className="tiny-product-name">
                  <span className="tiny-product-quantity">
                    ×{packageProduct.quantity || 1}
                  </span>
                  {packageProduct.name}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Rating & Reviews */}
      <div className="product-info-row">
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
        <div className="product-rating">
          <div
            className="stars-container"
            onClick={() => setIsReviewsModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            {renderStars(product.rating)}
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">
              ({product.reviewsCount} تقييم)
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="product-features">
          {product.type==="package"?product.features.slice(0,length-1)?.map((feature, index) => (
          <div key={index} className="feature-item">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </div>
        )) :product.features?.map((feature, index) => (
          <div key={index} className="feature-item">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-container">
          <div className="price-info">
            {(() => {
              const priceData = getProductPrice(product);
              if (priceData) {
                return (
                  <>
                    <span className="current-price">
                      {formatPrice(priceData.finalPrice)}
                    </span>
                    {priceData.discountAmount > 0 && (
                      <span className="original-price">
                        {formatPrice(priceData.originalPrice)}
                      </span>
                    )}
                  </>
                );
              } else {
                // Fallback to original logic
                return (
                  <>
                    <span className="current-price">
                      {formatPrice(
                        product.discount_details?.final_price ||
                          product.selling_price ||
                          0
                      )}
                    </span>
                    {product.discount_details && (
                      <span className="original-price">
                        {formatPrice(product.selling_price || 0)}
                      </span>
                    )}
                  </>
                );
              }
            })()}
          </div>

          {/* Compact Timer next to price */}
          {product?.discount_details?.timing_type === "scheduled" &&
            timeLeft && (
              <div className="compact-timer">
                <FaBolt className="timer-icon" />
                <div className="timer-display">
                  <span className="timer-unit">
                    <span className="timer-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className="timer-label">ثانية</span>
                  </span>
                  <span className="timer-unit">
                    <span className="timer-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className="timer-label">دقيقة</span>
                  </span>
                  <span className="timer-unit">
                    <span className="timer-number">{String(timeLeft.hours + (timeLeft.days * 24)).padStart(2, "0")}</span>
                    <span className="timer-label">ساعة</span>
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Product Weight */}

      {/* Stock Status */}
      <div className="stock-status">
        <span
          className={`stock-indicator ${
            product.inStock ? "in-stock" : "out-of-stock"
          }`}
        >
          {product.inStock ? "" : "نفذ المخزون"}
        </span>
      </div>

      {/* Actions */}
      <div className="product-actions">
        {/* Quantity Selector */}

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
        {product.inStock && (
          <div className="quantity-selector-action">
            <div className="quantity-controls">
              <button
                className="quantity-btn decrease"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn increase"
                onClick={increaseQuantity}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}
        <button
          className={`wishlist-btn ${isFavorite ? "active" : ""}`}
          onClick={handleToggleWishlist}
          disabled={!product.inStock && !isFavorite}
          title={!product.inStock && !isFavorite ? "المنتج نفذ من المخزون" : ""}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
          <span>{isFavorite ? "في المفضلة" : "أضف للمفضلة"}</span>
        </button>
      </div>
      {/* Tabby Payment Options */}
      <div className="tabby-payment-section">
        <div className="tabby-logo">
          <svg
            className="tabby-svg"
            width="126"
            height="40"
            viewBox="0 0 126 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M125.49 7.88041L117.042 40.0008H110.615L112.717 32.0977H106.844L100.54 7.90098H107.419L112.882 31.5216L119.042 7.90098V7.88041H125.49ZM18.0709 11.3165V6.72818L4.59987 8.78573C8.39887 7.98329 10.5756 4.93811 10.5756 1.89294V0H3.75793V8.90918L0 9.50587V14.0942L3.75793 13.5181V15.6579L0.0205351 16.2341V20.6166L3.75793 20.0405V25.3078C3.98382 29.8962 7.00248 32.6327 11.9514 32.6327C13.7175 32.6327 15.4835 32.2623 17.1058 31.5628L17.1468 31.5422V25.8016L17.0647 25.8428C16.0995 26.316 15.0317 26.5629 13.9639 26.5629C11.664 26.5629 10.206 26.1926 10.206 24.3202V19.0323L18.0915 17.8184V13.4358L10.206 14.6497V12.5099L18.0709 11.3165ZM38.3596 8.95033L44.8077 7.96271V32.1389H38.3596V24.4437C38.1132 29.567 34.9303 32.6121 29.7349 32.6121C26.7573 32.6121 24.2931 31.4599 22.6297 29.2789C20.9664 27.0979 20.0834 23.9087 20.0834 20.0199C20.0834 16.1312 20.9664 12.942 22.6297 10.761C24.2931 8.57997 26.7573 7.42775 29.7349 7.42775C34.9303 7.42775 38.1132 10.4523 38.3596 15.5551V8.95033ZM38.7087 20.0199C38.7087 17.8184 38.1543 15.946 37.107 14.6086C36.0392 13.2506 34.499 12.5305 32.6714 12.5305C28.8929 12.5305 26.6341 15.3287 26.6341 20.0199C26.6341 24.7111 28.8929 27.4683 32.6714 27.4683C36.3472 27.4683 38.7087 24.5465 38.7087 20.0199ZM73.2899 20.0199C73.2899 27.9003 69.6757 32.6121 63.5973 32.6121C58.4019 32.6121 55.219 29.5875 54.9726 24.4437V32.1389H48.5245V1.91352L54.9726 0.925896V15.5551C55.219 10.4523 58.4019 7.42775 63.5973 7.42775C69.6757 7.42775 73.2899 12.1395 73.2899 20.0199ZM66.7187 20.0199C66.7187 15.3287 64.4598 12.5305 60.6813 12.5305C58.8537 12.5305 57.3136 13.2506 56.2457 14.6086C55.1984 15.9254 54.644 17.7978 54.644 20.0199C54.644 24.5465 57.0055 27.4683 60.6813 27.4683C64.4598 27.4683 66.7187 24.6906 66.7187 20.0199ZM100.519 20.0199C100.519 27.9003 96.9053 32.6121 90.8269 32.6121C85.6315 32.6121 82.4486 29.5875 82.2021 24.4437V32.1389H75.7747V1.91352L82.2227 0.925896V15.5551C82.4691 10.4523 85.652 7.42775 90.8474 7.42775C96.9053 7.42775 100.54 12.1395 100.519 20.0199ZM93.9482 20.0199C93.9482 15.3287 91.6894 12.5305 87.9109 12.5305C86.0833 12.5305 84.5432 13.2506 83.4753 14.6086C82.428 15.9254 81.8736 17.7978 81.8736 20.0199C81.8736 24.5465 84.2351 27.4683 87.9109 27.4683C91.6894 27.4683 93.9482 24.6906 93.9482 20.0199Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="tabby-description">
          <span className="tabby-amount">
            ابتداء من{" "}
            {(() => {
              const priceData = getProductPrice(product);
              const finalPrice = priceData 
                ? priceData.finalPrice 
                : (product.discount_details?.final_price || product.selling_price || 0);
              return formatPrice(finalPrice / 4);
            })()}
          </span>
          <span className="tabby-terms">
            أو على 4 دفعات بدون فوائد. متوافق مع أحكام الشريعة.
          </span>
          <button className="tabby-learn-more">لمعرفة المزيد</button>
        </div>
      </div>
      {/* Payment Security & Guarantees */}
      <div className="payment-security-section">
        <div className="guarantee-item">
          <div className="guarantee-text">ضمان مدفوعات آمنة 100%</div>
        </div>
        <div className="payment-methods">
          <div className="payment-method">
            <img src={visaImage} alt="Visa" className="payment-method-img" />
          </div>
          <div className="payment-method">
            <img
              src={mastercardImage}
              alt="Mastercard"
              className="payment-method-img"
            />
          </div>
          <div className="payment-method">
            <img src={madaImage} alt="Mada" className="payment-method-img" />
          </div>
          <div className="payment-method">
            <img
              src={samsungPayImage}
              alt="Samsung Pay"
              className="payment-method-img"
            />
          </div>
          <div className="payment-method">
            <img
              src={applePayImage}
              alt="Apple Pay"
              className="payment-method-img"
            />
          </div>
          <div className="payment-method">
            <img src={tabbyImage} alt="Tabby" className="payment-method-img" />
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