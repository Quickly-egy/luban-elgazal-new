import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaCheck, FaTimes, FaStar } from "react-icons/fa";
import useWishlistStore from "../../../stores/wishlistStore";
import useCartStore from "../../../stores/cartStore";
import { useCurrency } from "../../../hooks";
import styles from "./PackageCard.module.css";

const PackageCard = ({ packageData }) => {
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
  } = packageData;

  const navigate = useNavigate();

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { formatPrice } = useCurrency();

  // Notification state
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  if (!is_active) {
    return null;
  }

  const displayPrice =
    calculated_price > 0
      ? parseFloat(calculated_price)
      : parseFloat(total_price);

  // Transform package data to be compatible with cart/wishlist stores
  const packageForStore = {
    id: id,
    name: name,
    price: displayPrice,
    discountedPrice: displayPrice,
    originalPrice: parseFloat(total_price),
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
        showNotification("تم إزالة الباقة من السلة", "remove");
      }
    } else {
      // Add to cart if not in cart
      const success = addToCart(packageForStore);
      if (success) {
        showNotification("تم إضافة الباقة للسلة", "success");
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

      {/* Card Header with Badges */}
      <div className={styles.cardHeader}>
        {/* Package Badge (replaces timer) */}
        <div className={styles.bestSeller}>باقة مميزة</div>
      </div>

      {/* Product Image */}
      <div className={styles.imageContainer}>
        <img
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

      {/* Favorite Button - Same position as ProductCard */}
      <button
        className={`${styles.favoriteBtn} ${
          isFavorite ? styles.favoriteActive : ""
        }`}
        onClick={handleFavoriteToggle}
      >
        <FaHeart size={20} color={isFavorite ? "#ff4757" : "#ddd"} />
      </button>

      {/* Discount Badge */}
      {calculated_price > 0 &&
        parseFloat(calculated_price) < parseFloat(total_price) && (
          <div className={styles.discountBadge}>
            خصم{" "}
            {Math.round(
              ((parseFloat(total_price) - parseFloat(calculated_price)) /
                parseFloat(total_price)) *
                100
            )}
            %
          </div>
        )}

      {/* Product Info - Same structure as ProductCard */}
      <div className={styles.productInfo}>
        {/* Product Name with package count */}
        <div className={styles.productNameContainer}>
          <h3 className={styles.productName}>{name}</h3>
          <span className={styles.productWeight}>{products.length} منتجات</span>
        </div>

        {/* Rating - Now using reviews_info */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {renderStars(reviews_info?.average_rating || 5)}
          </div>
          <span className={styles.reviewsCount}>
            {reviews_info?.total_reviews > 0
              ? `${reviews_info.total_reviews} تقييم`
              : "باقة مختارة"}
          </span>
        </div>

        {/* Price - Same structure as ProductCard */}
        <div className={styles.priceContainer}>
          <span className={styles.discountedPrice}>
            {formatPrice(displayPrice)}
          </span>
          {calculated_price > 0 &&
            parseFloat(calculated_price) < parseFloat(total_price) && (
              <span className={styles.originalPrice}>
                {formatPrice(parseFloat(total_price))}
              </span>
            )}
        </div>

        {/* Delivery Label Area - Package contents info */}
        <div className={styles.deliveryLabel}>
          يحتوي على {products.length} منتجات متنوعة
        </div>
      </div>

      {/* Action Buttons - Same as ProductCard */}
      <div className={styles.cardFooter}>
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
