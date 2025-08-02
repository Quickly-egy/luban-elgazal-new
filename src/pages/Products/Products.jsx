import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import PackageCard from "../../components/common/PackageCard";
import ProductFilters from "../../components/Products/ProductFilters/ProductFilters";
<<<<<<< HEAD
=======

>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
import ReviewsModal from "../../components/common/ReviewsModal/ReviewsModal";

import {
  useProductsWithAutoLoad,
  useProductSearch,
} from "../../hooks/useProducts";
import useProductsStore from "../../stores/productsStore";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";

import "./Products.css";
import ProductMapping from "./ProductMapping";

const DISPLAY_TYPES = {
  PRODUCTS: "products",
  PACKAGES: "packages",
  BOTH: "both",
};

<<<<<<< HEAD
const ITEMS_PER_PAGE = 9;

const Products = () => {
  const { setPage, page, loadProducts } = useProductsStore();
=======
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




>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

  const [searchParams] = useSearchParams();
  const [clicked, setClicked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const typeParam = searchParams.get("type");

  const [showPackages, setShowPackages] = useState(
    typeParam !== DISPLAY_TYPES.PRODUCTS
  );
  const [showProducts, setShowProducts] = useState(
    typeParam !== DISPLAY_TYPES.PACKAGES
  );
  const [showProductsOfCategory, setShowProductsOfCategory] = useState(true);
  const [showProductsOfPrice, setShowProductsOfPrice] = useState(true);

  const {
    products: allProducts,
    filteredProducts,
    packages,
    filters,
    loading,
    error,
    isInitialLoad,
    setFilters,
    resetFilters,
    clearError,
  } = useProductsWithAutoLoad();

  const fetchCategories = async () => {
    const response = await apiService.get("/product-categories/with-stock");
    return response.data;
  };

  const { data: categories } = useQuery({
    queryKey: ["cate"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  const { isSearching } = useProductSearch(localSearchTerm);
<<<<<<< HEAD

  useEffect(() => {
    useProductsStore.getState().resetFilters();
  }, []);

=======
  // Reset filters on page load to ensure no default filters are applied
  useEffect(() => {
    const store = useProductsStore.getState();
    // Reset filters to ensure clean state on page load
    store.resetFilters();
  }, []); // Run only once on page load

  // Preserve data on page return
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
  useEffect(() => {
    if (allProducts.length > 0) {
      useProductsStore.getState().preserveDataOnReturn();
    }
  }, [allProducts.length]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    setShowPackages(typeParam !== DISPLAY_TYPES.PRODUCTS);
    setShowProducts(typeParam !== DISPLAY_TYPES.PACKAGES);
  }, [searchParams]);

  const calculateDiscountInfo = (product) => {
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
  };

  const combinedItems = useMemo(() => {
    let items = [];

<<<<<<< HEAD
    if (showProducts) {
      items.push(
        ...filteredProducts.map((product) => ({
=======
    // Add products if enabled (show all products, including out of stock)
    if (showProducts) {
      const allProductsData = filteredProducts
        .map((product) => ({
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
          ...product,
          discount_info: calculateDiscountInfo(product),
          price: product.selling_price,
          discountedPrice: product.discount_details?.final_price || null,
          originalPrice: product.selling_price,
          type: "product",
<<<<<<< HEAD
        }))
      );
=======
        }));

      items.push(...allProductsData);
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
    }

    if (showPackages) {
      items.push(
        ...packages
          .filter((pkg) => pkg.is_active)
          .map((pkg) => ({ ...pkg, type: "package" }))
      );
    }

<<<<<<< HEAD
    return items.sort((a, b) => {
      if (a.inStock !== b.inStock) return b.inStock ? 1 : -1;
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (Math.abs(a.rating - b.rating) > 0.1) return b.rating - a.rating;
=======
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
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
      return a.name.localeCompare(b.name, "ar");
    });
  }, [filteredProducts, packages, showProducts, showPackages]);

<<<<<<< HEAD
  const AllData = useMemo(() => [...allProducts, ...packages], [allProducts, packages]);

  const S_Data = useMemo(() => {
    return AllData.filter((product) =>
      product.name.toLowerCase().includes(searchData.toLowerCase().trim())
    );
  }, [AllData, searchData]);
=======
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
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

  const totalItems = searchData === "" ? combinedItems.length : S_Data.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedItems = useMemo(() => {
    const items = searchData === "" ? combinedItems : S_Data;
    return items.slice(startIndex, endIndex);
  }, [combinedItems, S_Data, searchData, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchData, filters]);

  useEffect(() => {
    if (totalItems > 0) {
      document.title = `المنتجات والباقات (${totalItems}) - لبان الغزال`;
    }
    return () => {
      document.title = "لبان الغزال";
    };
  }, [totalItems]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = useCallback((newFilters) => {
    if (newFilters.searchTerm !== undefined) {
      setLocalSearchTerm(newFilters.searchTerm);
    }
    setFilters(newFilters);
  }, [setFilters]);

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
    setSearchData("");
  }, []);

<<<<<<< HEAD
=======

  // Show shimmer instead of LoadingState for better UX
  if (loading && allProducts.length === 0) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="products-content">
            <aside className="filters-sidebar" role="complementary" aria-label="فلاتر المنتجات">
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
              <section className="products-grid" role="region" aria-label="قائمة المنتجات والباقات" aria-live="polite">
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
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry functionality
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }





>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
  return (
    <div className="products-page">
      <div className="container">
        <div className="products-content">
          <aside className="filters-sidebar" role="complementary" aria-label="فلاتر المنتجات">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
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
<<<<<<< HEAD
=======


>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
            <section
              className="products-grid"
              role="region"
              aria-label="قائمة المنتجات والباقات"
              aria-live="polite"
            >
<<<<<<< HEAD
              <ProductMapping
                arr={
                  clicked
                    ? searchData === ""
                      ? showProductsOfCategory.slice(startIndex, endIndex)
                      : paginatedItems
                    : paginatedItems
                }
                loading={loading}
                handleRatingClick={handleRatingClick}
                handleCloseReviewsModal={handleCloseReviewsModal}
              />
            </section>
=======
              {(() => {
                // تحديد ما إذا كانت البيانات جاهزة للعرض
                const isDataReady = !loading && allProducts.length > 0;
                const hasItemsToShow = clicked 
                  ? (searchData === "" ? showProductsOfcategory.length > 0 : paginatedItems.length > 0)
                  : paginatedItems.length > 0;
                
                // عرض الـ shimmer إذا لم تكن البيانات جاهزة أو لا توجد عناصر للعرض
                if (!isDataReady || !hasItemsToShow) {
                  return (
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
                  );
                }
                
                // عرض المنتجات عندما تكون البيانات جاهزة
                return (
                  <ProductMapping
                    arr={clicked 
                      ? (searchData === "" ? showProductsOfcategory.slice(startIndex, endIndex) : paginatedItems)
                      : paginatedItems
                    }
                    loading={loading}
                    handleRatingClick={handleRatingClick}
                    handleCloseReviewsModal={handleCloseReviewsModal}
                  />
                );
              })()}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {/* Last page button */}
                <button 
                  className="pagination-nav-btn" 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages}
                  title="الصفحة الأخيرة"
                >
                  ≫
                </button>

                {/* Next page button */}
                <button 
                  className="pagination-nav-btn" 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  title="التالي"
                >
                  ›
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // Enhanced logic for showing pages
                    const showPage = 
                      page === 1 || // First page
                      page === totalPages || // Last page
                      (page >= currentPage - 1 && page <= currentPage + 1) || // Current and adjacent pages
                      (currentPage <= 3 && page <= 5) || // Show more pages if we're near the beginning
                      (currentPage >= totalPages - 2 && page >= totalPages - 4); // Show more pages if we're near the end
                    
                    if (showPage) {
                      return (
                        <button
                          key={page}
                          className={`pagination-number ${isCurrentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 3 && currentPage > 4) ||
                      (page === currentPage + 3 && currentPage < totalPages - 3)
                    ) {
                      return <span key={page} className="pagination-dots">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Previous page button */}
                <button 
                  className="pagination-nav-btn" 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  title="السابق"
                >
                  ‹
                </button>

                {/* First page button */}
                <button 
                  className="pagination-nav-btn" 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1}
                  title="الصفحة الأولى"
                >
                  ≪
                </button>
              </div>
            )}


>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  title="الصفحة الأخيرة"
                >
                  ≫
                </button>
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="التالي"
                >
                  ›
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isCurrent = page === currentPage;
                    const show =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (show) {
                      return (
                        <button
                          key={page}
                          className={`pagination-number ${isCurrent ? "active" : ""}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 3 && currentPage > 4) ||
                      (page === currentPage + 3 && currentPage < totalPages - 3)
                    ) {
                      return <span key={page} className="pagination-dots">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="السابق"
                >
                  ‹
                </button>
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  title="الصفحة الأولى"
                >
                  ≪
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

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
