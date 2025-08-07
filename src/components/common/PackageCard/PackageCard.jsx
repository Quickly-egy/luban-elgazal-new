import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaCheck, FaTimes, FaStar, FaClock } from "react-icons/fa";
import useWishlistStore from "../../../stores/wishlistStore";
import useCartStore from "../../../stores/cartStore";
import useProductsStore from "../../../stores/productsStore";
import { useCurrency } from "../../../hooks";
import useLocationStore from "../../../stores/locationStore";
import styles from "./PackageCard.module.css";
import { toast } from "react-toastify";

const PackageCard = ({ packageData, onRatingClick }) => {
  const {
    id,
    name,
    description,
    total_price,
    calculated_price,
    products,
    category,
    is_active,
    main_image_url,
    secondary_image_urls,
    reviews_info,
    prices,
  } = packageData;

  const navigate = useNavigate();

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { formatPrice, currencyInfo } = useCurrency();

  // الحصول على كود الدولة الحالي
  const { countryCode } = useLocationStore();

  // Currency conversion rates
  const CURRENCY_TO_SAR_RATE = {
    SAR: 1,
    AED:1,
    QAR:1,
    OMR: 1,
    BHD: 1,
    KWD: 1,
  };

  // State for discounts from API
  const [discountList, setDiscountList] = useState([]);

  // Notification state
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const { getProductDiscount, fetchDiscounts } = useProductsStore();
  // State for timer
  const [timeLeft, setTimeLeft] = useState(null);

  // Function to get current discount for the current country
  const getCurrentDiscount = React.useCallback(() => {
    if (!discountList.length || !countryCode) return null;
    
    // Find discount item for current package
    const packageDiscount = discountList.find(discount => 
      discount.package?.id === packageData.id
    );
    
    if (!packageDiscount?.country_discounts?.length) return null;
    
    // Find discount for current country
    const countryDiscount = packageDiscount.country_discounts.find(
      discount => discount.country_code === countryCode
    );
    
    return countryDiscount || null;
  }, [discountList, countryCode, packageData.id]);

  // Fetch discounts using store
  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts, currencyInfo.currency]);

  // Timer effect for scheduled discounts
  useEffect(() => {
    // Test date parsing
    if (packageData.discount_details?.end_at) {
      const testEndDate = new Date(
        packageData.discount_details.end_at.replace(" ", "T")
      );
      const now = new Date();
    }

    const calculateTimeLeft = () => {
      // Check if there's an active scheduled discount with an end time
      if (
        !packageData.discount_details?.end_at ||
        packageData.discount_details?.timing_type !== "scheduled"
      ) {
        return null;
      }

      // Parse the date
      let endDate;
      try {
        const dateString = packageData.discount_details.end_at;
        if (dateString.includes("T")) {
          endDate = new Date(dateString);
        } else {
          endDate = new Date(dateString.replace(" ", "T"));
        }
      } catch (error) {
        return null;
      }

      const now = new Date();
      const difference = endDate - now;

      if (difference <= 0) {
        return null;
      }

      // Calculate hours (including days converted to hours), minutes, and seconds
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const timeResult = { hours: totalHours, minutes, seconds };

      // Only return time values if there's an active discount
      if (packageData.discount_details?.value > 0) {
        return timeResult;
      }
      return null;
    };

    if (
      packageData.discount_details?.end_at &&
      packageData.discount_details?.timing_type === "scheduled" &&
      packageData.discount_details?.value > 0
    ) {
      const updateTimer = () => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
      };

      // Initial update
      updateTimer();

      // Update every second
      const timer = setInterval(updateTimer, 1000);

      return () => {
        clearInterval(timer);
      };
    } else {
      // Clear timer if no scheduled discount
      setTimeLeft(null);
    }
  }, [packageData]);

  if (!is_active) {
    return null;
  }

  // تطبيق نفس منطق حساب السعر المستخدم في ProductCard - مع إعادة الحساب عند تغيير الدولة
  const calculatePackagePrice = React.useCallback(
    (packageData, country) => {
      if (!packageData || !country) {
        return null;
      }

      // أولاً، استخدام prices object إذا كان متوفراً
      if (packageData.prices && typeof packageData.prices === "object") {
        const currencyMapping = {
          SA: "sar",
          AE: "aed",
          QA: "qar",
          KW: "kwd",
          BH: "bhd",
          OM: "omr",
          USD: "usd",
        };

        const currencyCode = currencyMapping[country.toUpperCase()];
        const priceData = packageData.prices[currencyCode];

        if (priceData && priceData.price) {
          let originalPrice = parseFloat(priceData.price || 0);
          let finalPrice = parseFloat(priceData.final_price || priceData.price || 0);
          let discountAmount = parseFloat(priceData.discount_amount || 0);

          // Check for discount from new API first
          const apiDiscount = getCurrentDiscount();
          if (apiDiscount) {
            const discountValue = parseFloat(apiDiscount.discount_value);
            const sarToLocal = 1 / (CURRENCY_TO_SAR_RATE[currencyInfo.currency] || 1);
            
            if (apiDiscount.discount_type === "percentage") {
              discountAmount = (originalPrice * discountValue) / 100;
              finalPrice = originalPrice - discountAmount;
            } else if (apiDiscount.discount_type === "fixed") {
              // Fixed discount - convert from SAR if needed
              const fixedDiscountLocal = currencyInfo.currency === "SAR" 
                ? discountValue 
                : discountValue * sarToLocal;
              discountAmount = fixedDiscountLocal;
              finalPrice = originalPrice - fixedDiscountLocal;
            }
          }

          const result = {
            originalPrice: Math.max(originalPrice, 0),
            finalPrice: Math.max(finalPrice, 0),
            discountAmount: Math.max(discountAmount, 0),
            discountType: apiDiscount?.discount_type || packageData.discount_details?.type,
            discountValue: apiDiscount?.discount_value || packageData.discount_details?.value,
          };

          return result;
        }
      }

      // Fallback إلى total_price و calculated_price
      let originalPrice = parseFloat(packageData.total_price || 0);
      let calculatedPrice = parseFloat(packageData.calculated_price || 0);
      let finalPrice = calculatedPrice > 0 ? calculatedPrice : originalPrice;
      let discountAmount = originalPrice - finalPrice;

      // Check for discount from new API
      const apiDiscount = getCurrentDiscount();
      if (apiDiscount) {
        const discountValue = parseFloat(apiDiscount.discount_value);
        const sarToLocal = 1 / (CURRENCY_TO_SAR_RATE[currencyInfo.currency] || 1);
        
        if (apiDiscount.discount_type === "percentage") {
          discountAmount = (originalPrice * discountValue) / 100;
          finalPrice = originalPrice - discountAmount;
        } else if (apiDiscount.discount_type === "fixed") {
          // Fixed discount - convert from SAR if needed
          const fixedDiscountLocal = currencyInfo.currency === "SAR" 
            ? discountValue 
            : discountValue * sarToLocal;
          discountAmount = fixedDiscountLocal;
          finalPrice = originalPrice - fixedDiscountLocal;
        }
      }

      const fallbackResult = {
        originalPrice: originalPrice,
        finalPrice: Math.max(finalPrice, 0),
        discountAmount: Math.max(0, discountAmount),
        discountType: apiDiscount?.discount_type || packageData.discount_details?.type,
        discountValue: apiDiscount?.discount_value || packageData.discount_details?.value,
      };

      return fallbackResult;
    },
    [countryCode, getCurrentDiscount, currencyInfo.currency]
  ); // إضافة countryCode للـ dependencies

  // حساب السعر الحالي للباقة حسب الدولة - مع إعادة الحساب عند تغيير الدولة
  const priceData = React.useMemo(() => {
    const result = calculatePackagePrice(packageData, countryCode);
    return result;
  }, [calculatePackagePrice, packageData, countryCode]);

  const displayPrice = priceData
    ? priceData.finalPrice
    : calculated_price > 0
    ? parseFloat(calculated_price)
    : parseFloat(total_price);

  const originalPrice = priceData
    ? priceData.originalPrice
    : parseFloat(total_price);

  // Check if package has any discount (from API or original)
  const currentDiscount = getCurrentDiscount();
  const hasDiscount = currentDiscount || 
    (priceData
      ? priceData.discountAmount > 0 && priceData.finalPrice < priceData.originalPrice
      : calculated_price > 0 && parseFloat(calculated_price) < parseFloat(total_price));

  // Transform package data to be compatible with cart/wishlist stores
  const packageForStore = {
    id: id,
    name: name,
    price: displayPrice,
    discountedPrice: displayPrice,
    originalPrice: originalPrice,
    selling_price: displayPrice, // Add selling_price for cart compatibility
    image:
      main_image_url ||
      products[0]?.main_image_url ||
      "/images/default-package.jpg",
    category: category?.name || "الباقات",
    description: description,
    inStock: true,
    rating: reviews_info?.average_rating || 5, // Use reviews_info rating if available
    reviewsCount: reviews_info?.total_reviews || 0,
    weight: `${products.length} منتجات`,
    type: "package", // Identify as package
    products: products, // Include contained products
    prices: prices, // إضافة prices object للاستخدام في السلة
  };

  const isFavorite = isInWishlist(id);
  const isPackageInCart = isInCart(id);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wasAdded = toggleWishlist(packageForStore);

    if (wasAdded) {
      showNotification("تم إضافة الباقة للمفضلة", "success");
    } else {
      showNotification("تم حذف الباقة من المفضلة", "remove");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPackageInCart) {
      // Remove from cart if already in cart
      const success = removeFromCart(id);
      if (success) {
        // showNotification("تم إزالة الباقة من السلة", "remove");
      }
      toast.error("تم إزالة الباقة من السلة", "remove");
    } else {
      // Add to cart if not in cart
      const success = addToCart(packageForStore);
      if (success) {
        toast.success("تم إضافة الباقة للسلة", "success");
      }
    }
  };

  const handleProductClick = () => {
    navigate(`/package/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className={styles.starFilled} size={16} />);
      } else {
        stars.push(<FaStar key={i} className={styles.starEmpty} size={16} />);
      }
    }
    return stars;
  };

  const handleRatingClick = () => {
    if (onRatingClick) {
      onRatingClick(packageData);
    }
  };

  // Render discount badge
  const renderDiscountBadge = () => {
    if (currentDiscount) {
      // Use API discount
      if (currentDiscount.discount_type === "percentage") {
        return `خصم %${currentDiscount.discount_value}`;
      } else {
        // Fixed discount
        const discountValue = parseFloat(currentDiscount.discount_value);
        const sarToLocal = 1 / (CURRENCY_TO_SAR_RATE[currencyInfo.currency] || 1);
        const localDiscount = currencyInfo.currency === "SAR" 
          ? discountValue 
          : discountValue * sarToLocal;
        return `خصم ${formatPrice(localDiscount)}`;
      }
    } else if (priceData && priceData.discountAmount > 0) {
      // Use original discount
      if (packageData.discount_details?.type === "percentage") {
        return `خصم ${Math.round(
          (priceData.discountAmount / priceData.originalPrice) * 100
        )}%`;
      } else {
        return `خصم ${formatPrice(priceData.discountAmount)}`;
      }
    }
    return null;
  };

  return (
    <div className={styles.productCard}>
      {/* Product Image */}
      <div className={styles.imageContainer} onClick={handleProductClick}>
        {/* Timer and Package Badge - Now inside image container */}
        <div className={styles.cardHeader}>
          {timeLeft &&
            packageData.discount_details?.timing_type === "scheduled" && (
              <div className={styles.timer}>
                <span className={styles.timeUnit}>
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className={styles.timeSeparator}>:</span>
                <span className={styles.timeUnit}>
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className={styles.timeSeparator}>:</span>
                <span className={styles.timeUnit}>
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            )}
          {/* Package Badge */}
          <div className={styles.bestSeller}>
            <p>باقة مميزة</p>
          </div>
        </div>

        <img
          loading="lazy"
          src={
            main_image_url ||
            products[0]?.main_image_url ||
            "/images/default-package.jpg"
          }
          alt={name}
          className={styles.productImage}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className={styles.imagePlaceholder} style={{ display: "none" }}>
          صورة الباقة
        </div>
      </div>

      {/* Discount Badge */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Favorite Button - Same position as ProductCard */}
        <button
          className={`${styles.favoriteBtn} ${
            isFavorite ? styles.favoriteActive : ""
          }`}
          onClick={handleFavoriteToggle}
        >
          <FaHeart size={20} color={isFavorite ? "#ff4757" : "#ddd"} />
        </button>
        
        {/* Updated Discount Badge */}
        {hasDiscount && (
          <div className={styles.discountBadge}>
            {renderDiscountBadge()}
          </div>
        )}
      </div>

      {/* Product Info - Same structure as ProductCard */}
      <div className={styles.productInfo}>
        {/* Product Name with package count */}
        <div className={styles.productNameContainer}>
          <h3 className={styles.productName}>{name}</h3>
          <span className={styles.productWeight}>{products.length} منتجات</span>
        </div>

        {/* Rating - Now using reviews_info */}
        <div
          className={styles.rating}
          onClick={(e) => {
            e.stopPropagation();
            handleRatingClick()
          }}
        >
          <div className={styles.stars}>
            {renderStars(reviews_info?.average_rating || 5)}
          </div>
          <span className={styles.reviewsCount}>
            {reviews_info?.total_reviews > 0 && `${reviews_info.total_reviews} تقييم`}
          </span>
        </div>

        {/* Price - Same structure as ProductCard with country-specific pricing */}
        <div className={styles.priceContainer} key={`price-${countryCode}`}>
          {(() => {
            if (hasDiscount) {
              return (
                <>
                  <span
                    key={`final-${countryCode}-${displayPrice}`}
                    className={styles.discountedPrice}
                  >
                    {formatPrice(displayPrice)}
                  </span>
                  <span
                    key={`orig-${countryCode}-${originalPrice}`}
                    className={styles.originalPrice}
                  >
                    {formatPrice(originalPrice)}
                  </span>
                </>
              );
            } else {
              return (
                <span
                  key={`final-${countryCode}-${displayPrice}`}
                  className={styles.discountedPrice}
                >
                  {formatPrice(displayPrice)}
                </span>
              );
            }
          })()}
        </div>
      </div>

      {/* Action Buttons - Same as ProductCard */}
      <div className={styles.cardFooter}>
        {/* Special Discount Animation - show if any discount exists */}
        {hasDiscount && (
          <div className={styles.specialDiscountText}>خصم خاص</div>
        )}

        <button
          className={`${styles.addToCartBtn} ${
            isPackageInCart ? styles.removeFromCartBtn : ""
          }`}
          onClick={handleAddToCart}
          disabled={!is_active}
        >
          {isPackageInCart ? "إزالة من السلة" : "أضف للسلة"}
        </button>
      </div>
    </div>
  );
};

export default PackageCard;