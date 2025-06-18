import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp, IoClose } from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa';
import { productsAPI } from '../../../../../../services/api';
import styles from './SearchModal.module.css';

const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounced search function
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch(searchQuery, 1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const performSearch = async (query, page = 1) => {
        if (!query || query.length < 2) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await productsAPI.searchProducts(query, { page });

            if (response.success) {
                // Filter products to only show those with names that exactly match the search query
                const filteredResults = (response.data || []).filter(product =>
                    product.name === query
                );

                // Handle pagination for "Load More" functionality
                if (page === 1) {
                    setSearchResults(filteredResults);
                } else {
                    // Append new filtered results to existing ones for pagination
                    setSearchResults(prev => [...prev, ...filteredResults]);
                }

                setCurrentPage(response.pagination?.current_page || 1);
                setTotalPages(response.pagination?.last_page || 1);
            } else {
                throw new Error('فشل في جلب النتائج');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'فشل في البحث');
            if (page === 1) {
                setSearchResults([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery.trim(), 1);
        }
    };

    const handleClose = () => {
        setSearchResults([]);
        setError(null);
        setCurrentPage(1);
        setTotalPages(1);
        onClose();
    };

    const loadMore = () => {
        if (currentPage < totalPages && !isLoading) {
            performSearch(searchQuery, currentPage + 1);
        }
    };

    const handleProductClick = (product) => {
        // Navigate to product details page
        navigate(`/product/${product.id}`);
        // Close the modal
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>البحث في المنتجات</h3>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <IoClose />
                    </button>
                </div>

                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputContainer}>
                            <input
                                type="text"
                                placeholder="ابحث عن منتج..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                                autoFocus
                            />
                            <button type="submit" className={styles.searchButton}>
                                <IoSearchSharp />
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.resultsSection}>
                    {isLoading && searchResults.length === 0 && (
                        <div className={styles.loadingContainer}>
                            <FaSpinner className={styles.spinner} />
                            <span>جاري البحث...</span>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorContainer}>
                            <p>{error}</p>
                            <button onClick={() => performSearch(searchQuery, 1)} className={styles.retryButton}>
                                إعادة المحاولة
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && searchQuery.length >= 2 && searchResults.length === 0 && (
                        <div className={styles.noResults}>
                            <p>لم يتم العثور على نتائج لـ "{searchQuery}"</p>
                        </div>
                    )}

                    {!error && searchResults.length > 0 && (
                        <>
                            <div className={styles.resultsHeader}>
                                <p>النتائج لـ "{searchQuery}"</p>
                            </div>

                            <div className={styles.resultsList}>
                                {searchResults.map((product, index) => (
                                    <div
                                        key={product.id || index}
                                        className={styles.productItem}
                                        onClick={() => handleProductClick(product)}
                                    >
                                        {product.main_image_url && (
                                            <div className={styles.productImage}>
                                                <img src={product.main_image_url} alt={product.name} />
                                            </div>
                                        )}
                                        <div className={styles.productDetails}>
                                            <div className={styles.productHeader}>
                                                <h4>{product.name}</h4>
                                                {product.label && (
                                                    <span
                                                        className={styles.productLabel}
                                                        style={{ backgroundColor: product.label.color }}
                                                    >
                                                        {product.label.name}
                                                    </span>
                                                )}
                                            </div>

                                            {product.description && (
                                                <p className={styles.productDescription}>
                                                    {product.description.length > 100
                                                        ? `${product.description.substring(0, 100)}...`
                                                        : product.description}
                                                </p>
                                            )}

                                            {/* Reviews Info */}
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
                                                <span className={styles.price}>{product.formatted_selling_price}</span>
                                                {product.discount_info && product.discount_info.has_discount && (
                                                    <>
                                                        <span className={styles.originalPrice}>{product.formatted_original_price}</span>
                                                        <span className={styles.discount}>
                                                            وفر {product.discount_info.savings}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className={styles.stockInfo}>
                                                <span className={`${styles.stockStatus} ${product.stock_info.in_stock ? styles.inStock : styles.outOfStock}`}>
                                                    {product.stock_info.stock_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentPage < totalPages && (
                                <div className={styles.loadMoreContainer}>
                                    <button
                                        onClick={loadMore}
                                        className={styles.loadMoreButton}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <FaSpinner className={styles.spinner} /> : 'تحميل المزيد'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!isLoading && !error && searchQuery.length < 2 && (
                        <div className={styles.searchHint}>
                            <p>أدخل كلمتين على الأقل للبحث</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal; 