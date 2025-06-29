import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import PackageCard from "../../components/common/PackageCard";
import ProductFilters from "../../components/Products/ProductFilters/ProductFilters";
import ProductSearch from "../../components/Products/ProductSearch/ProductSearch";
import ReviewsModal from "../../components/common/ReviewsModal/ReviewsModal";
import {
  useProductsWithAutoLoad,
  useProductSearch,
} from "../../hooks/useProducts";
import useProductsStore from "../../stores/productsStore";
import useLocationStore from "../../stores/locationStore";
import "./Products.css";

const Products = () => {
  const [searchParams] = useSearchParams();
  
  // حالة ReviewsModal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  
  // Check URL parameters for initial state
  const typeParam = searchParams.get('type');
  const [showPackages, setShowPackages] = useState(typeParam !== 'products');
  const [showProducts, setShowProducts] = useState(typeParam !== 'packages');
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // استخدام الـ hooks المخصصة
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
    getStats,
  } = useProductsWithAutoLoad();

  // البحث مع debouncing - لن يعمل في التحميل الأولي
  const { isSearching } = useProductSearch(localSearchTerm);

  // الحفاظ على البيانات عند العودة للصفحة
  useEffect(() => {
    if (allProducts.length > 0) {
      const store = useProductsStore.getState();
      store.preserveDataOnReturn();
    }
  }, [allProducts.length]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'packages') {
      setShowPackages(true);
      setShowProducts(false);
    } else if (typeParam === 'products') {
      setShowPackages(false);
      setShowProducts(true);
    }
  }, [searchParams]);

  // Combine products and packages into one array for unified display
  const combinedItems = React.useMemo(() => {
    const items = [];

    // Add products if enabled
    if (showProducts) {
      const availableProducts = filteredProducts
        .filter((product) => product.inStock)
        .map((product) => {
          // Add discount information if available
          const hasDiscount =
            product.valid_discounts &&
            product.valid_discounts.length > 0 &&
            product.discount_details;

          // Only create discount info if we have all required fields
          const discountInfo = hasDiscount
            ? {
                has_discount: true,
                discount_percentage: product.discount_details.value,
                discount_amount: product.discount_details.discount_amount || 0,
                original_price: product.selling_price,
                final_price: product.discount_details.final_price,
              }
            : null;

          return {
            ...product,
            discount_info: discountInfo,
            price: product.selling_price,
            discountedPrice: hasDiscount
              ? product.discount_details.final_price
              : null,
            originalPrice: product.selling_price,
          };
        });
      
      items.push(...availableProducts);
    }

    // Add packages if enabled
    if (showPackages) {
      const activePackages = packages.filter((pkg) => pkg.is_active);
      items.push(...activePackages);
    }

    // Sort items to mix products and packages naturally
    return items.sort((a, b) => {
      // First sort by whether it's featured or has high rating
      if (a.rating !== b.rating) return b.rating - a.rating;
      // Then by name alphabetically
      return a.name.localeCompare(b.name, "ar");
    });
  }, [filteredProducts, packages, showPackages, showProducts]);

  const handleFilterChange = (newFilters) => {
    if (newFilters.searchTerm !== undefined) {
      setLocalSearchTerm(newFilters.searchTerm);
    } else {
      setFilters(newFilters);
    }
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
            <h1 className="page-title">جميع المنتجات والباقات</h1>
            <p className="page-subtitle">
              اكتشف مجموعتنا الواسعة من المنتجات والباقات عالية الجودة بأفضل
              الأسعار
            </p>
          </div>
          <div className="loading">
            <div>جاري تحميل المنتجات والباقات...</div>
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
            <h2>خطأ في تحميل المنتجات والباقات</h2>
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
          <h1 className="page-title">جميع المنتجات والباقات</h1>
          <p className="page-subtitle">
            اكتشف مجموعتنا الواسعة من المنتجات والباقات عالية الجودة بأفضل
            الأسعار
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
            ></div>
          )}
        </div>

        <div className="products-content">
          <aside className="filters-sidebar">
            <div
              className="view-toggle"
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>نوع العرض</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <input
                    type="checkbox"
                    checked={showProducts}
                    onChange={(e) => setShowProducts(e.target.checked)}
                  />
                  عرض المنتجات
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <input
                    type="checkbox"
                    checked={showPackages}
                    onChange={(e) => setShowPackages(e.target.checked)}
                  />
                  عرض الباقات
                </label>
              </div>
            </div>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </aside>

          <main className="products-main">
            <div className="products-header">
              <ProductSearch
                searchTerm={localSearchTerm}
                onSearchChange={(term) => setLocalSearchTerm(term)}
                placeholder="ابحث عن المنتجات، الباقات، الفئات..."
                isLoading={isSearching}
              />

              <div className="products-controls">
                <div className="results-count">
                  {isInitialLoad
                    ? `عرض جميع العناصر (${combinedItems.length}) - المنتجات (${
                        showProducts ? allProducts.length : 0
                      }) والباقات (${showPackages ? packages.length : 0})`
                    : `عرض ${combinedItems.length} عنصر`}
                </div>
              </div>
            </div>

            <div className="products-grid">
              {combinedItems.length > 0 ? (
                combinedItems.map((item, index) => {
                  if (item.isPackage) {
                    // Render package using a unified card design
                    return (
                      <div
                        key={`package-${item.id}`}
                        className="product-card-wrapper"
                      >
                        <PackageCard packageData={item} />
                      </div>
                    );
                  } else {
                    // Render product
                    return (
                      <ProductCard
                        key={`product-${item.id}-${useLocationStore.getState().countryCode}`}
                        product={item}
                        onRatingClick={handleRatingClick}
                        showTimer={true}
                        style={{
                          animationDelay: `${(index % 6) * 0.1}s`,
                          opacity: loading ? 0.5 : 1,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      />
                    );
                  }
                })
              ) : (
                <div className="no-products">
                  <h3>لا توجد منتجات أو باقات تطابق معايير البحث</h3>
                  <p>
                    جرب تغيير الفلاتر أو البحث بكلمات مختلفة للعثور على المنتجات
                    أو الباقات المناسبة
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
