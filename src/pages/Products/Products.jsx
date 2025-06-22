import React, { useEffect, useState } from "react";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import ProductFilters from "../../components/Products/ProductFilters/ProductFilters";
import ProductSearch from "../../components/Products/ProductSearch/ProductSearch";
import ReviewsModal from "../../components/common/ReviewsModal/ReviewsModal";
import {
  useProductsWithAutoLoad,
  useProductSearch,
} from "../../hooks/useProducts";
import useProductsStore from "../../stores/productsStore";
import "./Products.css";

const Products = () => {
  // حالة ReviewsModal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // استخدام الـ hooks المخصصة
  const {
    products: allProducts,
    filteredProducts,
    categories,
    filters,
    loading,
    error,
    isInitialLoad,
    setFilters,
    resetFilters,
    clearError,
    getStats,
  } = useProductsWithAutoLoad();

  // البحث مع debouncing - لن يعمل في التحميل الأولي
  useProductSearch(filters.searchTerm);

  // الحفاظ على البيانات عند العودة للصفحة
  useEffect(() => {
    const store = useProductsStore.getState();
    if (store.allProducts.length > 0) {
      // تأكد من أن الحالة صحيحة عند العودة
      store.preserveDataOnReturn();
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRatingClick = (product) => {
    console.log(
      "Products page: handleRatingClick called for product:",
      product.id,
      product.name
    );
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
    console.log("Products page: modal should open now");
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    clearError();
    // سيتم إعادة التحميل تلقائياً عند إزالة الخطأ
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const stats = getStats();

  // عرض حالة التحميل مع تحسين لمنع الـ flash
  if (loading && allProducts.length === 0) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">جميع المنتجات</h1>
            <p className="page-subtitle">
              اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة بأفضل الأسعار
            </p>
          </div>
          <div className="loading">
            <div>جاري تحميل المنتجات...</div>
            <p style={{ fontSize: "1rem", marginTop: "0.5rem", opacity: 0.7 }}>
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
                marginTop: "1.5rem",
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "transform 0.2s",
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
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
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
              categories={categories}
            />
          </aside>

          <main className="products-main">
            <div className="products-header">
              <ProductSearch
                searchTerm={filters.searchTerm}
                onSearchChange={(term) =>
                  handleFilterChange({ ...filters, searchTerm: term })
                }
                placeholder="ابحث عن المنتجات، الفئات..."
                isLoading={false}
              />

              <div className="products-controls">
                <div className="results-count">
                  {isInitialLoad
                    ? `عرض جميع المنتجات (${allProducts.length})`
                    : `عرض ${filteredProducts.length} من أصل ${allProducts.length} منتج`}
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
                    style={{
                      animationDelay: `${(index % 6) * 0.1}s`,
                      opacity: loading ? 0.5 : 1,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  />
                ))
              ) : (
                <div className="no-products">
                  <h3>لا توجد منتجات تطابق معايير البحث</h3>
                  <p>
                    جرب تغيير الفلاتر أو البحث بكلمات مختلفة للعثور على المنتجات
                    المناسبة
                  </p>
                  <button
                    style={{
                      marginTop: "1.5rem",
                      padding: "0.75rem 2rem",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "translateY(0)")
                    }
                    onClick={handleResetFilters}
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              )}
            </div>
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

export default Products;
