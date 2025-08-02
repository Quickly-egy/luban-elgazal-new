import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import PackageCard from "../../components/common/PackageCard";
import ProductFilters from "../../components/Products/ProductFilters/ProductFilters";
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

const ITEMS_PER_PAGE = 9;

const Products = () => {
  const { setPage, page, loadProducts } = useProductsStore();

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

  useEffect(() => {
    useProductsStore.getState().resetFilters();
  }, []);

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

    if (showProducts) {
      items.push(
        ...filteredProducts.map((product) => ({
          ...product,
          discount_info: calculateDiscountInfo(product),
          price: product.selling_price,
          discountedPrice: product.discount_details?.final_price || null,
          originalPrice: product.selling_price,
          type: "product",
        }))
      );
    }

    if (showPackages) {
      items.push(
        ...packages
          .filter((pkg) => pkg.is_active)
          .map((pkg) => ({ ...pkg, type: "package" }))
      );
    }

    return items.sort((a, b) => {
      if (a.inStock !== b.inStock) return b.inStock ? 1 : -1;
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (Math.abs(a.rating - b.rating) > 0.1) return b.rating - a.rating;
      return a.name.localeCompare(b.name, "ar");
    });
  }, [filteredProducts, packages, showProducts, showPackages]);

  const AllData = useMemo(() => [...allProducts, ...packages], [allProducts, packages]);

  const S_Data = useMemo(() => {
    return AllData.filter((product) =>
      product.name.toLowerCase().includes(searchData.toLowerCase().trim())
    );
  }, [AllData, searchData]);

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
            <section
              className="products-grid"
              role="region"
              aria-label="قائمة المنتجات والباقات"
              aria-live="polite"
            >
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
