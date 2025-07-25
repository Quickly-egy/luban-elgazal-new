import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import PackageCard from "../../components/common/PackageCard";
import ProductFilters from "../../components/Products/ProductFilters/ProductFilters";
import ProductSearch from "../../components/Products/ProductSearch/ProductSearch";
import ReviewsModal from "../../components/common/ReviewsModal/ReviewsModal";
import useProducts, {
  useProductsWithAutoLoad,
  useProductSearch,
} from "../../hooks/useProducts";
import useProductsStore from "../../stores/productsStore";
import useLocationStore from "../../stores/locationStore";
import "./Products.css";
import ProductMapping from "./ProductMapping";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";

// Constants for better maintainability
const DISPLAY_TYPES = {
  PRODUCTS: "products",
  PACKAGES: "packages",
  BOTH: "both",
};

const SORT_OPTIONS = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  RATING_DESC: "rating_desc",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
};

// Loading component for better reusability
const LoadingState = ({ message = "جاري تحميل المنتجات والباقات..." }) => (
  <div className="products-page">
    <div className="container">
      <PageHeader />
      <div className="loading" role="status" aria-live="polite">
        <div>{message}</div>
        <p style={{ fontSize: "1rem", marginTop: "0.5rem", opacity: 0.7 }}>
          يرجى الانتظار قليلاً
        </p>
      </div>
    </div>
  </div>
);

// Error component for better reusability
const ErrorState = ({ error, onRetry }) => (
  <div className="products-page">
    <div className="container">
      <PageHeader />
      <div className="error-state" role="alert">
        <h2>خطأ في تحميل المنتجات والباقات</h2>
        <p>{error}</p>
        <button
          onClick={onRetry}
          className="retry-button"
          aria-label="إعادة المحاولة لتحميل المنتجات"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  </div>
);

// Page header component for better reusability
const PageHeader = () => (
  <header className="page-header">
    <div className="page-header-content">
      <h1 className="page-title">جميع المنتجات والباقات</h1>
      <p className="page-subtitle">
        اكتشف مجموعتنا الواسعة من المنتجات والباقات عالية الجودة بأفضل الأسعار
      </p>
    </div>
  </header>
);

// Enhanced no products component
const NoProductsState = ({
  showProducts,
  showPackages,
  allProducts,
  packages,
  onResetFilters,
  onShowAll,
}) => {
  const getTitle = () => {
    if (!showProducts && !showPackages) {
      return "يرجى اختيار نوع العرض من الفلاتر";
    }
    if (showProducts && showPackages) {
      return "لا توجد منتجات أو باقات تطابق معايير البحث";
    }
    return showProducts
      ? "لا توجد منتجات تطابق معايير البحث"
      : "لا توجد باقات تطابق معايير البحث";
  };

  const getDescription = () => {
    if (!showProducts && !showPackages) {
      return "اختر من الشريط الجانبي ما تريد عرضه: المنتجات أو الباقات أو كليهما";
    }
    return "جرب تغيير الفلاتر أو البحث بكلمات مختلفة للعثور على ما تبحث عنه";
  };

  return (
    <div className="no-products-enhanced" role="status" aria-live="polite">
      <div className="no-products-icon" aria-hidden="true">
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3L21 21M9 9L3 3M15 15L21 21"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20.49 9A9 9 0 1 1 11 3.83"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" stroke="#e2e8f0" strokeWidth="2" />
        </svg>
      </div>

      <div className="no-products-content">
        <h3 className="no-products-title">{getTitle()}</h3>
        <p className="no-products-description">{getDescription()}</p>

        <div className="no-products-actions">
          <button
            className="reset-filters-btn"
            onClick={onResetFilters}
            aria-label="إعادة تعيين جميع الفلاتر"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 12A9 9 0 1 0 12 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 3L12 12L8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            إعادة تعيين الفلاتر
          </button>

          {!showProducts && !showPackages && (
            <button
              className="show-all-btn"
              onClick={onShowAll}
              aria-label="عرض جميع المنتجات والباقات"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              عرض جميع المنتجات والباقات
            </button>
          )}
        </div>

        <div className="no-products-stats">
          <div className="stat-item">
            <span className="stat-number">{allProducts.length}</span>
            <span className="stat-label">إجمالي المنتجات</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{packages.length}</span>
            <span className="stat-label">إجمالي الباقات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
const { setPage, page, loadProducts } = useProductsStore();
//  const [allData, setAllData] = useState([]);
const scrollToTop = () => {
  const targetScroll = window.scrollY - window.innerHeight;
  window.scrollTo({
    top: targetScroll > 0 ? targetScroll : 0,
    behavior: 'smooth',
  });
};


 const goToNextPage = () => {

      setPage(+page + 1);
       loadProducts();
      scrollToTop()
    
  };

  const goToPrevPage = () => {
   
      setPage(+page - 1);
       loadProducts();
     scrollToTop()
  };





  const [searchParams] = useSearchParams();
  const [clicked, setClicked] = useState(false);
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Display state with improved logic
  const typeParam = searchParams.get("type");
  const [showPackages, setShowPackages] = useState(
    typeParam === DISPLAY_TYPES.PACKAGES
      ? true
      : typeParam === DISPLAY_TYPES.PRODUCTS
      ? false
      : true
  );
  const [showProducts, setShowProducts] = useState(
    typeParam === DISPLAY_TYPES.PRODUCTS
      ? true
      : typeParam === DISPLAY_TYPES.PACKAGES
      ? false
      : true
  );
  const [showProductsOfcategory, setShowProductsOfCategory] = useState(
    typeParam === DISPLAY_TYPES.PRODUCTS
      ? true
      : typeParam === DISPLAY_TYPES.PACKAGES
      ? false
      : true
  );
  const [showProductsOfPrice, setShowProductsOfPrice] = useState(
    typeParam === DISPLAY_TYPES.PRODUCTS
      ? true
      : typeParam === DISPLAY_TYPES.PACKAGES
      ? false
      : true
  );
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Custom hooks
  const {
    products: allProducts,
    filteredProducts,
    packages,
    categories,
    filters,
    loading,
    error,
    isInitialLoad,
    setFilters,
    resetFilters,
    clearError,

  } = useProductsWithAutoLoad();
const fetchCategories = async () => {
  const response = await apiService.get('/product-categories/with-stock');
  return response.data;
};

const {data} = useQuery({
  queryKey: ['cate'],
  queryFn: fetchCategories,
})
  const { isSearching } = useProductSearch(localSearchTerm);
  // Reset filters on page load to ensure no default filters are applied
  useEffect(() => {
    const store = useProductsStore.getState();
    // Reset filters to ensure clean state on page load
    store.resetFilters();
  }, []); // Run only once on page load

  // Preserve data on page return
  useEffect(() => {
    if (allProducts.length > 0) {
      const store = useProductsStore.getState();
      store.preserveDataOnReturn();
    }
  }, [allProducts.length]);

  // Handle URL parameters
  useEffect(() => {
    const typeParam = searchParams.get("type");
    switch (typeParam) {
      case DISPLAY_TYPES.PACKAGES:
        setShowPackages(true);
        setShowProducts(false);
        break;
      case DISPLAY_TYPES.PRODUCTS:
        setShowPackages(false);
        setShowProducts(true);
        break;
      default:
        setShowPackages(true);
        setShowProducts(true);
    }
  }, [searchParams]);

  // Enhanced discount calculation helper
  const calculateDiscountInfo = useCallback((product) => {
    const hasDiscount =
      product.valid_discounts?.length > 0 && product.discount_details;

    if (!hasDiscount) return null;

    return {
      has_discount: true,
      discount_percentage: product.discount_details.value,
      discount_amount: product.discount_details.discount_amount || 0,
      original_price: product.selling_price,
      final_price: product.discount_details.final_price,
    };
  }, []);

  // Optimized combined items with better sorting
  const combinedItems = useMemo(() => {
  
    const items = [];

    // Add products if enabled (show all products, including out of stock)
    if (showProducts) {
      const allProductsData = filteredProducts
        .map((product) => ({
          ...product,
          discount_info: calculateDiscountInfo(product),
          price: product.selling_price,
          discountedPrice: product.discount_details?.final_price || null,
          originalPrice: product.selling_price,
          type: "product",
        }));

      items.push(...allProductsData);
    }

    // Add packages if enabled
    if (showPackages) {
      const activePackages = packages
        .filter((pkg) => pkg.is_active)
        .map((pkg) => ({ ...pkg, type: "package" }));

      items.push(...activePackages);
    }

    // Enhanced sorting with multiple criteria
    const sortedItems = items.sort((a, b) => {
      // Primary sort: in stock items first
      if (a.inStock !== b.inStock) {
        return b.inStock ? 1 : -1;
      }

      // Secondary sort: featured items first
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }

      // Tertiary sort: by rating (higher first)
      if (Math.abs(a.rating - b.rating) > 0.1) {
        return b.rating - a.rating;
      }

      // Quaternary sort: by name (Arabic alphabetical)
      return a.name.localeCompare(b.name, "ar");
    });

    return sortedItems;
  }, [
    filteredProducts,
    packages,
    showPackages,
    showProducts,
    calculateDiscountInfo,
  ]);
  const [searchData,setSearchData]=useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  let AllData = [...allProducts, ...packages];
  const S_Data = AllData.filter(product =>
    product.name.includes(searchData || "")
  );

  // Pagination calculations
  const totalItems = searchData === "" ? combinedItems.length : S_Data.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const items = searchData === "" ? combinedItems : S_Data;
    return items.slice(startIndex, endIndex);
  }, [combinedItems, S_Data, searchData, startIndex, endIndex]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchData, filters]);

  // Update page title to show total items including out of stock
  useEffect(() => {
    if (totalItems > 0) {
      document.title = `المنتجات والباقات (${totalItems}) - لبان الغزال`;
    }
    return () => {
      document.title = 'لبان الغزال'; // Reset on unmount
    };
  }, [totalItems]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Event handlers with useCallback for performance
  const handleFilterChange = useCallback(
    (newFilters) => {
  

      // If the newFilters contains searchTerm, update the local search state
      if (newFilters.searchTerm !== undefined) {
        setLocalSearchTerm(newFilters.searchTerm);
      }

      // Always apply the filters to the store
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleRatingClick = useCallback((product) => {
  
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setLocalSearchTerm("");
  }, [resetFilters]);

  const handleShowAll = useCallback(() => {
    setShowProducts(true);
    setShowPackages(true);
    setSearchData("")
  }, []);


  if (loading && allProducts.length === 0) {
    return <LoadingState />;
  }

  // Error state with retry functionality
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }





  return (
    <div className="products-page">
      <div className="container">
        <PageHeader />

        <div className="products-content">
          <aside
            className="filters-sidebar"
            role="complementary"
            aria-label="فلاتر المنتجات"
          >
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={data}
              products={allProducts}
              showProducts={showProducts}
              showPackages={showPackages}
              onShowProductsChange={setShowProducts}
              onShowPackagesChange={setShowPackages}
              packages={packages}
              setShowProductsOfCategory={setShowProductsOfCategory}
             setClicked={setClicked}
              setShowProductsOfPrice={setShowProductsOfPrice} 
              onSearchChange={setSearchData}
         
            />
          </aside>

          <main className="products-main" role="main">
            <div className="products-header">
              <ProductSearch
                searchTerm={searchData}
                setClicked={setClicked}
         setShowProductsOfCategory={setShowProductsOfCategory}
                onSearchChange={setSearchData}
                placeholder="ابحث عن المنتجات، الباقات، الفئات..."
                isLoading={isSearching}
                aria-label="البحث في المنتجات والباقات"
              />

              <div className="products-controls">
                <div className="results-count" role="status" aria-live="polite">
                  {searchData === "" 
                    ? `عرض جميع العناصر (${totalItems}) - المنتجات (${
                        showProducts ? filteredProducts.length : 0
                      }) والباقات (${showPackages ? packages.filter(pkg => pkg.is_active).length : 0})`
                    : `نتائج البحث: ${totalItems} عنصر`
                  }
                </div>
              </div>
            </div>

            <section
              className="products-grid"
              role="region"
              aria-label="قائمة المنتجات والباقات"
              aria-live="polite"
            >
              {loading ? (
                // Shimmer loading effect
                <div className="products-shimmer-grid">
                  {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
                    <div key={index} className="product-shimmer-card">
                      <div className="shimmer-image"></div>
                      <div className="shimmer-content">
                        <div className="shimmer-title"></div>
                        <div className="shimmer-rating">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="shimmer-star"></div>
                          ))}
                        </div>
                        <div className="shimmer-price-container">
                          <div className="shimmer-price"></div>
                          <div className="shimmer-price-old"></div>
                        </div>
                        <div className="shimmer-button"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : clicked ? (
                <ProductMapping
                  arr={searchData === "" ? showProductsOfcategory.slice(startIndex, endIndex) : paginatedItems}
                  loading={loading}
                  handleRatingClick={handleRatingClick}
                  NoProductsState={NoProductsState}
                  showProducts={showProducts}
                  showPackages={showPackages}
                  allProducts={allProducts}
                  packages={packages}
                  onResetFilters={handleResetFilters}
                  onShowAll={handleShowAll}
                  isReviewsModalOpen={isReviewsModalOpen}
                  handleCloseReviewsModal={handleCloseReviewsModal}
                />
              ) : (
                <ProductMapping
                  arr={paginatedItems}
                  loading={loading}
                  handleRatingClick={handleRatingClick}
                  NoProductsState={NoProductsState}
                  showProducts={showProducts}
                  showPackages={showPackages}
                  allProducts={allProducts}
                  packages={packages}
                  onResetFilters={handleResetFilters}
                  onShowAll={handleShowAll}
                />
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  التالي
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          className={`pagination-number ${isCurrentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="pagination-dots">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  السابق
                </button>
              </div>
            )}

            {/* Results info */}
            <div className="pagination-info">
              عرض {startIndex + 1} - {Math.min(endIndex, totalItems)} من أصل {totalItems} عنصر
            </div>

          </main>
      
        </div>
      </div>

      {/* Reviews Modal */}
      {selectedProduct && (
        <ReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={handleCloseReviewsModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default React.memo(Products);
