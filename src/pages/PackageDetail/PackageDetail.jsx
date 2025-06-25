import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaCheck,
  FaTimes,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import useWishlistStore from "../../stores/wishlistStore";
import useCartStore from "../../stores/cartStore";
import useProductsStore from "../../stores/productsStore";
import { useCurrency } from "../../hooks";
import "./PackageDetail.css";

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // Store hooks
  const { getPackageById } = useProductsStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  // State
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const pkg = getPackageById(parseInt(id));
        if (pkg) {
          setPackageData(pkg);
        } else {
          // If package not found in store, might need to fetch from API
          console.error("Package not found");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, getPackageById]);

  if (loading) {
    return (
      <div className="package-detail">
        <div className="container">
          <div className="loading">جاري تحميل تفاصيل الباقة...</div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-detail">
        <div className="container">
          <div className="error-message">
            <h2>الباقة غير موجودة</h2>
            <p>عذراً، لا يمكن العثور على الباقة المطلوبة.</p>
            <button
              onClick={() => navigate("/products")}
              className="back-button"
            >
              <FaArrowRight /> العودة للمنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPrice =
    packageData.calculated_price > 0
      ? packageData.calculated_price
      : packageData.total_price;

  // Transform package data for cart/wishlist
  const packageForStore = {
    id: packageData.id,
    name: packageData.name,
    price: displayPrice,
    discountedPrice: displayPrice,
    originalPrice: packageData.total_price,
    image:
      packageData.products[0]?.main_image_url || "/images/default-package.jpg",
    category: packageData.category?.name || "الباقات",
    description: packageData.description,
    inStock: true,
    rating: 5,
    reviewsCount: 0,
    weight: "",
    type: "package",
    products: packageData.products,
  };

  const isFavorite = isInWishlist(packageData.id);
  const isPackageInCart = isInCart(packageData.id);

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFavoriteToggle = () => {
    const wasAdded = toggleWishlist(packageForStore);
    if (wasAdded) {
      showNotification("تم إضافة الباقة للمفضلة", "success");
    } else {
      showNotification("تم حذف الباقة من المفضلة", "remove");
    }
  };

  const handleAddToCart = () => {
    if (isPackageInCart) {
      const success = removeFromCart(packageData.id);
      if (success) {
        showNotification("تم إزالة الباقة من السلة", "remove");
      }
    } else {
      const success = addToCart(packageForStore);
      if (success) {
        showNotification("تم إضافة الباقة للسلة", "success");
      }
    }
  };

  return (
    <div className="package-detail">
      <div className="container">
        {/* Notification */}
        {notification && (
          <div
            className={`notification ${
              notificationType === "remove"
                ? "notification-remove"
                : "notification-success"
            }`}
          >
            {notificationType === "success" ? <FaCheck /> : <FaTimes />}
            <span>{notification}</span>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate("/")}>الرئيسية</button>
          <span>/</span>
          <button onClick={() => navigate("/products")}>المنتجات</button>
          <span>/</span>
          <span>تفاصيل الباقة</span>
        </nav>

        <div className="package-detail-content">
          {/* Package Info */}
          <div className="package-info">
            <div className="package-header">
              <h1 className="package-title">{packageData.name}</h1>
              {packageData.category && (
                <span className="package-category">
                  {packageData.category.name}
                </span>
              )}
            </div>

            <div className="package-description">
              <p>{packageData.description}</p>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="current-price">{formatPrice(displayPrice)}</div>
              {packageData.calculated_price > 0 &&
                packageData.calculated_price < packageData.total_price && (
                  <div className="price-info">
                    <span className="original-price">
                      {formatPrice(packageData.total_price)}
                    </span>
                    <span className="savings">
                      وفرت{" "}
                      {formatPrice(
                        packageData.total_price - packageData.calculated_price
                      )}
                    </span>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className={`add-to-cart-btn ${
                  isPackageInCart ? "remove-from-cart" : ""
                }`}
                onClick={handleAddToCart}
              >
                {isPackageInCart ? "إزالة من السلة" : "أضف للسلة"}
              </button>

              <button
                className={`wishlist-btn ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteToggle}
              >
                <FaHeart />
                {isFavorite ? "إزالة من المفضلة" : "أضف للمفضلة"}
              </button>
            </div>
          </div>

          {/* Package Products */}
          <div className="package-products">
            <h2>المنتجات المضمنة في الباقة</h2>
            <div className="products-grid">
              {packageData.products.map((product) => (
                <div key={product.id} className="product-item">
                  <div className="product-image">
                    <img src={product.main_image_url} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-details">
                      <span className="product-quantity">
                        الكمية: {product.quantity}
                      </span>
                      <span className="product-price">
                        {formatPrice(product.selling_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
