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
import useProductsStore from "../../../../../../stores/productsStore";
import styles from "./SearchModal.module.css";

const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [searchResults, setSearchResults] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart, isInCart } = useCartStore();
  const { searchProducts, loadProducts, isLoading, error, cachedProducts } = useProductsStore();

  // جلب المنتجات عند تحميل المكون
  useEffect(() => {
    const loadProduct = async () => {
      if (!cachedProducts || cachedProducts.length === 0) {
        await loadProducts();
      }
      setInitialLoading(false);
    };
    
    loadProduct();
  }, []);

  // البحث في المنتجات عند تغيير قيمة البحث
  useEffect(() => {
 
    if (searchQuery && searchQuery.trim() && !initialLoading) {
    
      const results = searchProducts(searchQuery);

      setSearchResults(results || []);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, initialLoading]);


  

  const handleProductClick = (product) => {
    onClose();
    navigate(`/product/${product.id}`, {
      state: { product },
    });
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
      <div className={styles.searchResults}>
        {searchQuery ? (
          <div className={styles.searchResultsContainer}>
            {initialLoading || isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>جاري البحث...</span>
              </div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : searchResults.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <h4>نتائج البحث ({searchResults.length})</h4>
                  <button onClick={handleViewAllResults} className={styles.viewAllButton}>
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
                        <img loading="lazy" src={product.image} alt={product.name} />
                      </div>

                      <div className={styles.productDetails}>
                        {product.category && (
                          <div className={styles.productCategory}>
                            {product.category}
                          </div>
                        )}
                        <h5 className={styles.productName}>{product.name}</h5>

                        <div className={styles.productPrice}>
                          {product.discount_details ? (
                            <>
                              <span className={styles.originalPrice}>
                                {formatPrice(product.selling_price)}
                              </span>
                              <span className={styles.discountedPrice}>
                                {formatPrice(product.discount_details.final_price)}
                              </span>
                            </>
                          ) : (
                            <span className={styles.price}>
                              {formatPrice(product.selling_price)}
                            </span>
                          )}
                        </div>

                        <div className={styles.productActions}>
                          <button
                            className={`${styles.actionButton} ${styles.cartButton}`}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!product.inStock}
                          >
                            <FaShoppingCart />
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.wishlistButton} ${
                              isInWishlist(product.id) ? styles.active : ""
                            }`}
                            onClick={(e) => handleToggleWishlist(e, product)}
                          >
                            {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <span>لا توجد نتائج للبحث</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchModal;
