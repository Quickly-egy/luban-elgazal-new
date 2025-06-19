import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaShoppingCart, FaEye, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../../../../../hooks';
import useWishlistStore from '../../../../../../stores/wishlistStore';
import useCartStore from '../../../../../../stores/cartStore';
import styles from './SearchModal.module.css';

const SearchModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const searchInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        'منتجات العناية بالشعر',
        'شامبو طبيعي',
        'كريم مرطب',
        'زيوت عطرية'
    ]);

    // Zustand store hooks
    const { isInWishlist, toggleWishlist } = useWishlistStore();
    const { addToCart, isInCart } = useCartStore();

    // Mock search results - في التطبيق الحقيقي، ستأتي من API
    const mockResults = [
        {
            id: 1,
            name: 'شامبو طبيعي مغذي للشعر الجاف',
            price: 89,
            originalPrice: 120,
            image: '/images/hair-care-product.jpg',
            category: 'العناية بالشعر',
            rating: 4.5,
            reviewsCount: 128,
            inStock: true,
            discount_info: {
                has_discount: true,
                discount_percentage: 25,
                savings: '31'
            },
            reviews_info: {
                average_rating: 4.5,
                total_reviews: 128,
                rating_stars: '★★★★☆'
            },
            formatted_selling_price: '89 ج.م',
            formatted_original_price: '120 ج.م'
        },
        {
            id: 2,
            name: 'كريم مرطب للوجه بالصبار',
            price: 125,
            originalPrice: 150,
            image: '/images/hair-care-product.jpg',
            category: 'العناية بالبشرة',
            rating: 4.8,
            reviewsCount: 95,
            inStock: true,
            discount_info: {
                has_discount: true,
                discount_percentage: 17,
                savings: '25'
            },
            reviews_info: {
                average_rating: 4.8,
                total_reviews: 95,
                rating_stars: '★★★★★'
            },
            formatted_selling_price: '125 ج.م',
            formatted_original_price: '150 ج.م'
        },
        {
            id: 3,
            name: 'زيت اللافندر العطري الطبيعي',
            price: 75,
            originalPrice: 90,
            image: '/images/hair-care-product.jpg',
            category: 'الزيوت العطرية',
            rating: 4.3,
            reviewsCount: 67,
            inStock: false,
            discount_info: {
                has_discount: true,
                discount_percentage: 17,
                savings: '15'
            },
            reviews_info: {
                average_rating: 4.3,
                total_reviews: 67,
                rating_stars: '★★★★☆'
            },
            formatted_selling_price: '75 ج.م',
            formatted_original_price: '90 ج.م'
        }
    ];

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm.trim()) {
            setIsLoading(true);
            // محاكاة API call
            const timer = setTimeout(() => {
                const filtered = mockResults.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSearchResults(filtered);
                setIsLoading(false);
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() && !recentSearches.includes(term)) {
            setRecentSearches(prev => [term, ...prev.slice(0, 3)]);
        }
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
        navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.searchModalOverlay} onClick={onClose}>
            <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.searchHeader}>
                    <div className={styles.searchInputContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="ابحث عن المنتجات..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className={styles.clearButton}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.searchContent}>
                    {!searchTerm ? (
                        <div className={styles.recentSearches}>
                            <h3>عمليات البحث الأخيرة</h3>
                            <div className={styles.recentSearchesList}>
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearch(search)}
                                        className={styles.recentSearchItem}
                                    >
                                        <FaSearch />
                                        <span>{search}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.searchResults}>
                            {isLoading ? (
                                <div className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    <span>جاري البحث...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <>
                                    <div className={styles.resultsHeader}>
                                        <h3>نتائج البحث ({searchResults.length})</h3>
                                        <button
                                            onClick={handleViewAllResults}
                                            className={styles.viewAllButton}
                                        >
                                            عرض جميع النتائج
                                        </button>
                                    </div>
                                    <div className={styles.resultsList}>
                                        {searchResults.map((product) => (
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
                                                    <h4 className={styles.productName}>
                                                        {product.name}
                                                    </h4>

                                                    {product.reviews_info && product.reviews_info.total_reviews > 0 && (
                                                        <div className={styles.reviewsInfo}>
                                                            <span className={styles.stars}>{product.reviews_info.rating_stars}</span>
                                                            <span className={styles.reviewCount}>
                                                                ({product.reviews_info.total_reviews} تقييم)
                                                            </span>
                                                            <span className={styles.rating}>
                                                                {product.reviews_info.average_rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className={styles.productPrice}>
                                                        <span className={styles.price}>{formatPrice(product.price)}</span>
                                                        {product.discount_info && product.discount_info.has_discount && (
                                                            <>
                                                                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                                                                <span className={styles.discount}>
                                                                    وفر {formatPrice(product.originalPrice - product.price)}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Stock Status */}
                                                    <div className={`${styles.stockStatus} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                                                        {product.inStock ? 'متوفر' : 'غير متوفر'}
                                                    </div>
                                                </div>

                                                <div className={styles.productActions}>
                                                    <button
                                                        onClick={(e) => handleToggleWishlist(e, product)}
                                                        className={`${styles.actionButton} ${styles.wishlistButton} ${isInWishlist(product.id) ? styles.active : ''}`}
                                                        title={isInWishlist(product.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                                                    >
                                                        {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        className={`${styles.actionButton} ${styles.cartButton} ${!product.inStock ? styles.disabled : ''}`}
                                                        disabled={!product.inStock}
                                                        title={product.inStock ? 'إضافة للسلة' : 'غير متوفر'}
                                                    >
                                                        <FaShoppingCart />
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductClick(product);
                                                        }}
                                                        className={`${styles.actionButton} ${styles.viewButton}`}
                                                        title="عرض التفاصيل"
                                                    >
                                                        <FaEye />
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
                                    <h3>لا توجد نتائج</h3>
                                    <p>لم نتمكن من العثور على منتجات تطابق بحثك "{searchTerm}"</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className={styles.clearSearchButton}
                                    >
                                        مسح البحث
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal; 