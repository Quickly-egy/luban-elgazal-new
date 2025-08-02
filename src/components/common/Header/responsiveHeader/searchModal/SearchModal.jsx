import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaClock, FaArrowLeft, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../../../../hooks';
import useWishlistStore from '../../../../../stores/wishlistStore';
import useCartStore from '../../../../../stores/cartStore';
import useProductsStore from '../../../../../stores/productsStore';
import styles from './searchModal.module.css';

export default function SearchModal({ showSearchModal, setShowSearchModal }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const searchInputRef = useRef(null);

  // Zustand store hooks
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { searchProducts, loadProducts, isLoading, error, cachedProducts } = useProductsStore();

  // Load products when component mounts
  useEffect(() => {
    const loadProduct = async () => {
      if (!cachedProducts || cachedProducts.length === 0) {
        await loadProducts();
      }
      setInitialLoading(false);
    };
    
    loadProduct();
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim() && !initialLoading) {
      const results = searchProducts(searchQuery);
      setSearchResults(results || []);
      setSuggestions([]);
    } else {
      setSearchResults([]);
      // Generate suggestions when no search query
      if (searchQuery.length > 0) {
        const filtered = suggestionsList.filter(item => 
          item.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }
  }, [searchQuery, initialLoading]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [showSearchModal]);

  // Suggestions data
  const suggestionsList = [
    'عطور رجالية',
    'عطور نسائية', 
    'عود طبيعي',
    'بخور فاخر',
    'مسك أبيض',
    'عنبر خالص',
    'ورد طائفي',
    'زعفران أصلي',
    'عطر فرنسي',
    'بخور هندي',
    'مسك أسود',
    'عنبر أزرق'
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle product click
  const handleProductClick = (product) => {
    setShowSearchModal(false);
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product);
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Handle view all results
  const handleViewAllResults = () => {
    setShowSearchModal(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle search submission
  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      // Navigate to products page with search
      setShowSearchModal(false);
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        
        // Auto-focus input after voice recognition
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('البحث الصوتي غير مدعوم في هذا المتصفح');
    }
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Remove single history item
  const removeHistoryItem = (item) => {
    const newHistory = searchHistory.filter(historyItem => historyItem !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSearchModal(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchModal(false);
    }
  };

  // Prevent background scroll
  useEffect(() => {
    if (showSearchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearchModal]);

  return (
    <aside 
      className={`${styles.searchModal} ${showSearchModal ? styles.show : ""}`} 
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.searchHeader}>
          <button className={styles.backBtn} onClick={() => setShowSearchModal(false)}>
            <FaArrowLeft />
          </button>
          <div className={styles.searchInputContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <button 
              className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
              onClick={handleVoiceSearch}
              title="البحث الصوتي"
            >
              <IoMdMicrophone />
            </button>
          </div>
          <button className={styles.closeBtn} onClick={() => setShowSearchModal(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.searchContent}>
          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className={styles.section}>
              <div className={styles.resultsHeader}>
                <h4 className={styles.sectionTitle}>نتائج البحث ({searchResults.length})</h4>
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
            </div>
          )}

          {/* Loading */}
          {(initialLoading || isLoading) && searchQuery && (
            <div className={styles.section}>
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>جاري البحث...</span>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && !searchResults.length && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>اقتراحات البحث</h4>
              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSearch(suggestion)}
                  >
                    <FaSearch className={styles.suggestionIcon} />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !searchQuery && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>
                  <FaClock className={styles.titleIcon} />
                  عمليات البحث الأخيرة
                </h4>
                <button className={styles.clearBtn} onClick={clearHistory}>
                  مسح الكل
                </button>
              </div>
              <div className={styles.historyList}>
                {searchHistory.map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <button
                      className={styles.historyText}
                      onClick={() => handleSearch(item)}
                    >
                      <FaClock className={styles.historyIcon} />
                      <span>{item}</span>
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeHistoryItem(item)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery.length > 0 && !searchResults.length && !suggestions.length && !initialLoading && !isLoading && (
            <div className={styles.section}>
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h4>لا توجد نتائج مطابقة</h4>
                <p>جرب البحث بكلمات مختلفة</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.section}>
              <div className={styles.error}>{error}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
