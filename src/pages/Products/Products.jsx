import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import ProductFilters from '../../components/Products/ProductFilters/ProductFilters';
import ProductSearch from '../../components/Products/ProductSearch/ProductSearch';
import { productsAPI } from '../../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    weight: '',
    searchTerm: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Transform API product data to match ProductCard expected format
  const transformProduct = (apiProduct) => {
    // Calculate discount percentage if there's a purchase cost
    const purchaseCost = parseFloat(apiProduct.purchase_cost) || 0;
    const sellingPrice = parseFloat(apiProduct.selling_price) || 0;

    // Generate mock rating and reviews for now (since API doesn't provide these)
    const mockRating = Math.random() * (5 - 3.5) + 3.5; // Random rating between 3.5-5
    const mockReviews = Math.floor(Math.random() * 500) + 10; // Random reviews between 10-510

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: "N/A", // API doesn't provide weight, using placeholder
      image: apiProduct.main_image_url,
      originalPrice: purchaseCost,
      discountedPrice: sellingPrice,
      discountPercentage: apiProduct.profit_margin ? Math.abs(parseFloat(apiProduct.profit_margin)) : 0,
      rating: parseFloat(mockRating.toFixed(1)),
      reviewsCount: mockReviews,
      inStock: apiProduct.is_available && apiProduct.total_warehouse_quantity > 0,
      category: apiProduct.category?.name || 'غير محدد',
      description: apiProduct.description,
      sku: apiProduct.sku,
      label: apiProduct.label,
      tax: apiProduct.tax,
      secondary_images: apiProduct.secondary_image_urls || [],
      warehouse_info: apiProduct.warehouse_info
    };
  };

  // Search products function
  const searchProducts = async (searchTerm) => {
    try {
      setIsSearching(true);
      setError(null);

      const response = await productsAPI.searchProducts(searchTerm);

      if (response.success && response.data?.data) {
        const transformedProducts = response.data.data.map(transformProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        throw new Error('Invalid search response format');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError('فشل في البحث عن المنتجات. يرجى المحاولة مرة أخرى.');

      // Keep existing products on search error
      setFilteredProducts(products);
    } finally {
      setIsSearching(false);
    }
  };

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productsAPI.getProducts();

        if (response.success && response.data?.data) {
          const transformedProducts = response.data.data.map(transformProduct);
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setError('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');

        // Fallback to empty array instead of mock data
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle search when search term changes
  useEffect(() => {
    if (filters.searchTerm && filters.searchTerm.trim().length > 0) {
      // Debounce search to avoid too many API calls
      const searchTimeout = setTimeout(() => {
        searchProducts(filters.searchTerm.trim());
      }, 500);

      return () => clearTimeout(searchTimeout);
    } else if (!filters.searchTerm) {
      // If search term is empty, reload all products
      const loadAllProducts = async () => {
        try {
          setLoading(true);
          const response = await productsAPI.getProducts();
          if (response.success && response.data?.data) {
            const transformedProducts = response.data.data.map(transformProduct);
            setProducts(transformedProducts);
            setFilteredProducts(transformedProducts);
          }
        } catch (error) {
          console.error('Error reloading products:', error);
        } finally {
          setLoading(false);
        }
      };
      loadAllProducts();
    }
  }, [filters.searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Skip search filter since we're using API search
    // فلتر البحث is handled by API now

    // فلتر الفئة
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // فلتر السعر
    filtered = filtered.filter(product =>
      product.discountedPrice >= filters.priceRange[0] &&
      product.discountedPrice <= filters.priceRange[1]
    );

    // فلتر التقييم
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // فلتر التوفر في المخزن
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // الترتيب الافتراضي: الأعلى تقييماً ثم الأكثر مبيعاً
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };



  const handleRatingClick = (product) => {
    console.log('عرض تقييمات المنتج:', product.id);
    // يمكن إضافة Modal للتقييمات هنا
  };

  const handleRetry = () => {
    window.location.reload(); // Simple retry - reload the page
  };

  // حساب إحصائيات المنتجات
  const getProductStats = () => {
    if (products.length === 0) return null;

    const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);
    const totalReviews = products.reduce((sum, p) => sum + p.reviewsCount, 0);
    const avgDiscount = Math.round(
      products.filter(p => p.discountPercentage).reduce((sum, p) => sum + p.discountPercentage, 0) /
      products.filter(p => p.discountPercentage).length
    );

    return { avgRating, totalReviews, avgDiscount };
  };

  const stats = getProductStats();

  if (loading || isSearching) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading">
            <div>{isSearching ? 'جاري البحث...' : 'جاري تحميل المنتجات...'}</div>
            <p style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.7 }}>
              يرجى الانتظار قليلاً
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="error-state">
            <h2>خطأ في تحميل المنتجات</h2>
            <p>{error}</p>
            <button
              onClick={handleRetry}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">جميع المنتجات</h1>
          <p className="page-subtitle">
            اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة بأفضل الأسعار
          </p>
          {stats && (
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              <span>⭐ متوسط التقييم: {stats.avgRating}</span>
              <span>💬 {stats.totalReviews.toLocaleString()} تقييم</span>
              <span>🏷️ متوسط الخصم: {stats.avgDiscount}%</span>
            </div>
          )}
        </div>

        <div className="products-content">
          <aside className="filters-sidebar">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={[...new Set(products.map(p => p.category))]}
            />
          </aside>

          <main className="products-main">
            <div className="products-header">
              <ProductSearch
                searchTerm={filters.searchTerm}
                onSearchChange={(term) => handleFilterChange({ ...filters, searchTerm: term })}
                placeholder="ابحث عن المنتجات، الفئات..."
                isLoading={isSearching}
              />

              <div className="products-controls">
                <div className="results-count">
                  عرض {filteredProducts.length} من أصل {products.length} منتج
                </div>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRatingClick={handleRatingClick}
                    showTimer={false}
                    style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                  />
                ))
              ) : (
                <div className="no-products">
                  <h3>لا توجد منتجات تطابق معايير البحث</h3>
                  <p>
                    جرب تغيير الفلاتر أو البحث بكلمات مختلفة للعثور على المنتجات المناسبة
                  </p>
                  <button
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem 2rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s'




























































































































































































































































































                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    onClick={() => {
                      setFilters({
                        category: '',
                        priceRange: [0, 10000],
                        rating: 0,
                        weight: '',
                        searchTerm: ''
                      });
                    }}
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;