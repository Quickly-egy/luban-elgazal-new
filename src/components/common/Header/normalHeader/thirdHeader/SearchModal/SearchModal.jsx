import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../../../../../hooks";
import useWishlistStore from "../../../../../../stores/wishlistStore";
import useCartStore from "../../../../../../stores/cartStore";
import styles from "./SearchModal.module.css";

const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, isInCart } = useCartStore();

  // Mock search results - في التطبيق الحقيقي، ستأتي من API
  const mockResults = [
    {
      id: 1,
      name: "شامبو طبيعي مغذي للشعر الجاف",
      price: 89,
      originalPrice: 120,
      image: "/images/hair-care-product.jpg",
      category: "العناية بالشعر",
      rating: 4.5,
      reviewsCount: 128,
      inStock: true,
      discount_info: {
        has_discount: true,
        discount_percentage: 25,
        savings: "31",
      },
      reviews_info: {
        average_rating: 4.5,
        total_reviews: 128,
        rating_stars: "★★★★☆",
      },
      formatted_selling_price: "89 ج.م",
      formatted_original_price: "120 ج.م",
    },
    {
      id: 2,
      name: "كريم مرطب للوجه بالصبار",
      price: 125,
      originalPrice: 150,
      image: "/images/hair-care-product.jpg",
      category: "العناية بالبشرة",
      rating: 4.8,
      reviewsCount: 95,
      inStock: true,
      discount_info: {
        has_discount: true,
        discount_percentage: 17,
        savings: "25",
      },
      reviews_info: {
        average_rating: 4.8,
        total_reviews: 95,
        rating_stars: "★★★★★",
      },
      formatted_selling_price: "125 ج.م",
      formatted_original_price: "150 ج.م",
    },
    {
      id: 3,
      name: "زيت اللافندر العطري الطبيعي",
      price: 75,
      originalPrice: 90,
      image: "/images/hair-care-product.jpg",
      category: "الزيوت العطرية",
      rating: 4.3,
      reviewsCount: 67,
      inStock: false,
      discount_info: {
        has_discount: true,
        discount_percentage: 17,
        savings: "15",
      },
      reviews_info: {
        average_rating: 4.3,
        total_reviews: 67,
        rating_stars: "★★★★☆",
      },
      formatted_selling_price: "75 ج.م",
      formatted_original_price: "90 ج.م",
    },
  ];

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setIsLoading(true);
      // محاكاة API call
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  const handleProductClick = (product) => {
    onClose();
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product.inStock) return;

    addToCart(product);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleViewAllResults = () => {
    onClose();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.searchDropdown}>
      {/* Results dropdown */}
      <div className={styles.searchResults}>
        {searchQuery ? (
          <div className={styles.searchResultsContainer}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>جاري البحث...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <h4>نتائج البحث ({searchResults.length})</h4>
                  <button
                    onClick={handleViewAllResults}
                    className={styles.viewAllButton}
                  >
                    عرض جميع النتائج
                  </button>
                </div>
                <div className={styles.resultsList}>
                  {searchResults.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className={styles.productItem}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className={styles.productImage}>
                        <img src={product.image} alt={product.name} />
                        {product.discount_info?.has_discount && (
                          <div className={styles.discountBadge}>
                            -{product.discount_info.discount_percentage}%
                          </div>
                        )}
                      </div>

                      <div className={styles.productDetails}>
                        <div className={styles.productCategory}>
                          {product.category}
                        </div>
                        <h5 className={styles.productName}>{product.name}</h5>

                        <div className={styles.productPrice}>
                          <span className={styles.price}>
                            {formatPrice(product.price)}
                          </span>
                          {product.discount_info &&
                            product.discount_info.has_discount && (
                              <span className={styles.originalPrice}>
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                        </div>

                        <div
                          className={`${styles.stockStatus} ${
                            product.inStock ? styles.inStock : styles.outOfStock
                          }`}
                        >
                          {product.inStock ? "متوفر" : "غير متوفر"}
                        </div>
                      </div>

                      <div className={styles.productActions}>
                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className={`${styles.actionButton} ${
                            styles.wishlistButton
                          } ${isInWishlist(product.id) ? styles.active : ""}`}
                          title={
                            isInWishlist(product.id)
                              ? "إزالة من المفضلة"
                              : "إضافة للمفضلة"
                          }
                        >
                          {isInWishlist(product.id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`${styles.actionButton} ${
                            styles.cartButton
                          } ${!product.inStock ? styles.disabled : ""}`}
                          disabled={!product.inStock}
                          title={product.inStock ? "إضافة للسلة" : "غير متوفر"}
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <FaSearch />
                </div>
                <h4>لا توجد نتائج</h4>
                <p>لم نتمكن من العثور على منتجات تطابق بحثك "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchModal;
