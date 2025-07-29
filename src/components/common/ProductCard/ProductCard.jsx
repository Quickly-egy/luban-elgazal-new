import React, { useState, useEffect, useSyncExternalStore } from "react";
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
import useLocationStore from "../../../stores/locationStore";
import styles from "./ProductCard.module.css";
import { toast } from "react-toastify";

const ProductCard = ({ product, onRatingClick, showTimer = true }) => {
  // All React hooks must be called before any early returns
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // Get country directly from store
  const { countryCode } = useLocationStore();
const { currencyInfo } = useCurrency();
const CURRENCY_TO_SAR_RATE = {
  SAR: 1,
  AED: 0.98,
  QAR: 1.03,
  OMR: 9.74,
  BHD: 9.95,
  KWD: 12.2,
};
  // Calculate price directly without caching
  // const calculatePrice = React.useCallback((prod, country) => {
  //   if (!prod || !country) {
  
  //     return null;
  //   }

  //   // Debug for main product only (reduced logging)


  //   // Direct calculation without any hooks or memoization
  //   if (prod.prices && typeof prod.prices === "object") {
  //     const currencyMapping = {
  //       SA: "sar",
  //       AE: "aed",
  //       QA: "qar",
  //       KW: "kwd",
  //       BH: "bhd",
  //       OM: "omr",
  //       USD: "usd",
  //     };

  //     const currencyCode = currencyMapping[country.toUpperCase()];
  //     const priceData = prod.prices[currencyCode];

     

  //     if (priceData) {
  //       const result = {
  //         originalPrice: parseFloat(priceData.price || 0),
  //         finalPrice: parseFloat(priceData.final_price || priceData.price || 0),
  //         discountAmount: parseFloat(priceData.discount_amount || 0),
  //       };

  //       return result;
  //     }
  //   }

  //   // Fallback to selling_price
  //   const fallbackResult = {
  //     originalPrice: parseFloat(prod.selling_price || 0),
  //     finalPrice: parseFloat(prod.selling_price || 0),
  //     discountAmount: 0,
  //   };

  

  //   return fallbackResult;
  // }, []);
const calculatePrice = React.useCallback((prod, country) => {
  if (!prod || !country) return null;

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
  const priceData = prod.prices?.[currencyCode];

  const sarToLocal = 1 / (CURRENCY_TO_SAR_RATE[currencyInfo.currency] || 1);

  let originalPrice = parseFloat(priceData?.price || prod.selling_price || 0);
  let finalPrice = parseFloat(priceData?.final_price || priceData?.price || prod.selling_price || 0);
  let discountAmount = parseFloat(priceData?.discount_amount || 0);

  // إذا كان الخصم ثابتًا من السيرفر بالريال السعودي، نحوله إلى العملة المحلية
  if (
    prod.discount_details &&
    prod.discount_details.type === "fixed" &&
    prod.discount_details.value > 0
  ) {
    const fixedDiscountSAR = prod.discount_details.value;
    const fixedDiscountLocal = fixedDiscountSAR * sarToLocal;
    finalPrice = originalPrice - fixedDiscountLocal;
    discountAmount = fixedDiscountLocal;
  }

  return {
    originalPrice: Math.max(originalPrice, 0),
    finalPrice: Math.max(finalPrice, 0),
    discountAmount: Math.max(discountAmount, 0),
  };
}, [currencyInfo.currency]);

  // إضافة console.log للتحقق من المنتجات التي عليها خصم
  React.useEffect(() => {
    if (product.discount_details) {
      const originalPrice = product.selling_price;
      const discountValue = product.discount_details.value;
      const finalPrice = product.discount_details.final_price;
      const calculatedFinalPrice =
        originalPrice - (originalPrice * discountValue) / 100;
    }
  }, [product]);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  // حالة التايمر
  const [timeLeft, setTimeLeft] = useState(null);

  // تحديث العداد كل ثانية
  useEffect(() => {
    // تحويل التاريخ إلى كائن Date
    const calculateTimeLeft = () => {
      // Check if there's an active offer with an end time
      if (!product.discount_details?.end_at) {
        return null;
      }

      // تحويل التاريخ بطريقة أكثر مرونة
      let endDate;
      try {
        const dateString = product.discount_details.end_at;
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



      if (difference <= 0) return null;

      // حساب إجمالي الساعات (بما في ذلك الأيام المحولة لساعات)
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Only return time values if there's an active discount
      if (product.discount_details?.value > 0) {
        return { hours: totalHours, minutes, seconds };
      }
      return null;
    };

    if (
      showTimer &&
      product.discount_details?.end_at &&
      product.discount_details?.value > 0
    ) {
  

      const updateTimer = () => {
        const newTimeLeft = calculateTimeLeft();
        
        setTimeLeft(newTimeLeft);
      };

      // تحديث أولي
      updateTimer();

      // تحديث كل ثانية
      const timer = setInterval(updateTimer, 1000);

      return () => {
     
        clearInterval(timer);
      };
    } else {
      // إذا لم تكن هناك شروط للتايمر، امسح التايمر
  
      setTimeLeft(null);
    }
  }, [product, showTimer]);

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

  // التحقق من وجود المنتج
  if (!product) {
    return null;
  }

  // Get product data
  const rating = product.reviews_info?.average_rating || 0;
  const reviewsCount = product.reviews_info?.total_reviews || 0;
  
  // تحديث منطق فحص توفر المنتج ليشمل جميع الحالات
  const stockQuantity = product.stock_info?.total_available || product.warehouse_info?.total_available || 0;
  const stockStatus = product.stock_status;
  const inStock = (product.stock_info?.in_stock || false) && 
                  stockStatus !== "out_of_stock" && 
                  stockQuantity > 0;
  const mainImage = product.main_image_url || product.image;

  const isFavorite = isInWishlist(product.id);
  const isProductInCart = isInCart(product.id);

  const handleFavoriteToggle = () => {
    // منع إضافة المنتجات غير المتوفرة للمفضلة
    if (!inStock && !isFavorite) {
      toast.error("لا يمكن إضافة منتج نفذ مخزونه للمفضلة");
      return;
    }

    const wasAdded = toggleWishlist(product);

    if (wasAdded) {
      toast.success("تم إضافة المنتج للمفضلة");
    } else {
      toast.error("تم حذف المنتج من المفضلة");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();



    // التحقق من توفر المنتج في المخزون
    if (!inStock) {
      toast.error("عذراً، هذا المنتج نفذ من المخزون");
      return;
    }

    if (isProductInCart) {
      // Remove from cart if already in cart
      const success = removeFromCart(product.id);
      if (success) {

       toast.error("تم إزالة المنتج من السلة");
      }
      
    } else {
      // Add to cart if not in cart
      // حساب السعر المناسب للسلة حسب الدولة المختارة
      const priceData = calculatePrice(product, countryCode);
      let discountedPrice, originalPrice, discountPercentage;

      if (priceData) {
        discountedPrice = priceData.finalPrice;
        originalPrice = priceData.originalPrice;
        discountPercentage =
          priceData.discountAmount > 0
            ? Math.round(
                (priceData.discountAmount / priceData.originalPrice) * 100
              )
            : 0;
      } else {
        // Fallback to original logic
        discountedPrice =
          product.discount_details && product.discount_details.value > 0
            ? product.selling_price * (1 - product.discount_details.value / 100)
            : product.selling_price;
        originalPrice = product.selling_price;
        discountPercentage = product.discount_details?.value || 0;
      }

      const cartProduct = {
        ...product,
        price: discountedPrice,
        discountedPrice: discountedPrice,
        originalPrice: originalPrice,
        category: product.category || "غير محدد",
        rating: rating,
        reviewsCount: reviewsCount,
        image: mainImage,
        inStock: inStock,
        discountPercentage: discountPercentage,
        // إضافة كائن prices للاستخدام في السلة
        prices: product.prices || null,
        price_sar: product.price_sar,
        price_aed: product.price_aed,
        price_qar: product.price_qar,
        price_kwd: product.price_kwd,
        price_bhd: product.price_bhd,
        price_omr: product.price_omr,
      };

      const success = addToCart(cartProduct);
      if (success) {
      
        toast.success("تم إضافة المنتج للسلة");
      }
    }
  };

  const handleRatingClick = () => {
  
    if (onRatingClick) {
  
      onRatingClick(product);
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
    <div
      key={`${product.id}-${countryCode}`}
      className={`${styles.productCard} ${!inStock ? styles.outOfStock : ''}`}
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className={styles.imageContainer}>
        {/* Timer and Discount Badge - Now inside image container */}
        <div className={styles.cardHeader}>
          {timeLeft && showTimer && (
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
          {product.label?.name && (
            <div
              className={styles.bestSeller}
              style={{
                backgroundColor: product.label.color || "#00bd7e",
                color: "#fff",
              }}
            >
              {product.label.name}
            </div>
          )}
        </div>

        <img
          src={mainImage}
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Favorite Button */}
        <button
          className={`${styles.favoriteBtn} ${
            isFavorite ? styles.favoriteActive : ""
          } ${!inStock ? styles.disabled : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          disabled={!inStock && !isFavorite}
          title={!inStock && !isFavorite ? "المنتج نفذ من المخزون" : ""}
        >
          <FaHeart size={20} color={isFavorite ? "#ff4757" : (!inStock ? "#bbb" : "#ddd")} />
        </button>
        
{product.discount_details && product.discount_details.value > 0 && (
  <div className={styles.discountBadge}>
    {product.discount_details.type === "percentage"
      ? `خصم %${Math.max(product.discount_details.value)}`
      : (() => {
          const priceData = calculatePrice(product, countryCode);
          const sarToLocal =
            1 / (CURRENCY_TO_SAR_RATE[currencyInfo.currency] || 1);

          return priceData && priceData.discountAmount > 0
            ? `خصم ${formatPrice(Math.max(priceData.discountAmount))}`
            : `خصم ${formatPrice((product.discount_details.value * sarToLocal))}`;
        })()}
  </div>
)}

      </div>

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
          <div className={styles.stars}>{renderStars(rating)}</div>
          <span className={styles.reviewsCount}>({reviewsCount})</span>
        </div>

        {/* Price directly under rating */}
        <div className={styles.priceContainer} key={`price-${countryCode}`}>
          {(() => {
            // Calculate fresh price every render
            const priceData = calculatePrice(product, countryCode);

         
            if (!priceData) {
              // Fallback to original logic if no price data
              return product.discount_details &&
                product.discount_details.value > 0 ? (
                <>
                  <span
                    key={`fallback-final-${countryCode}`}
                    className={styles.discountedPrice}
                  >
                    {formatPrice(
                      product.discount_details.type === "percentage"
                        ? product.selling_price *
                            (1 - product.discount_details.value / 100)
                        : product.selling_price - product.discount_details.value
                    )}
                  </span>
                  <span
                    key={`fallback-orig-${countryCode}`}
                    className={styles.originalPrice}
                  >
                    {formatPrice(product.selling_price)}
                  </span>
                </>
              ) : (
                <span
                  key={`fallback-final-${countryCode}`}
                  className={styles.discountedPrice}
                >
                  {formatPrice(product.selling_price)}
                </span>
              );
            }

            // Use country-specific pricing
            const hasDiscount = priceData.discountAmount > 0;

            return hasDiscount ? (
              <>
                <span
                  key={`final-${countryCode}-${priceData.finalPrice}`}
                  className={styles.discountedPrice}
                >
          {formatPrice(Math.round(priceData.finalPrice))}
                </span>
                <span 
                  key={`orig-${countryCode}-${priceData.originalPrice}`}
                  className={styles.originalPrice}
                >
                  {formatPrice(priceData.originalPrice)}
                </span>
              </>
            ) : (
             <span
  key={`final-${countryCode}-${priceData.finalPrice}`}
  className={styles.discountedPrice}
>
  {formatPrice(Math.max(priceData.finalPrice))}
</span>

            );
          })()}
        </div>

        {/* Stock Status */}
        <div className={styles.stockStatus}>
          {!inStock && (
            <span className={styles.outOfStock}>
              <FaTimes size={14} style={{ marginLeft: "4px" }} />
              نفذ المخزون
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.cardFooter}>
        {/* Special Discount Animation - only show if product has discount */}
        {product.discount_details && product.discount_details.value > 0 && (
          <div className={styles.specialDiscountText}>خصم خاص</div>
        )}

        <button
          className={`${styles.addToCartBtn} ${
            isProductInCart ? styles.removeFromCartBtn : ""
          }`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          {isProductInCart ? "إزالة من السلة" : "أضف للسلة"}
        </button>

        {shouldShowDeliveryLabel && (
          <div className={styles.deliveryLabel}>{deliveryLabels[0]}</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
