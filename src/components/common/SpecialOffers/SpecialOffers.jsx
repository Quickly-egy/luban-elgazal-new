import React, { useState, useMemo, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import styles from "./SpecialOffers.module.css";

<<<<<<< HEAD
// Lazy load the ReviewsModal to avoid loading it unless opened
const ReviewsModal = React.lazy(() => import("../ReviewsModal/ReviewsModal"));

=======
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
const SpecialOffers = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products: allProducts, loading } = useProductsWithAutoLoad();

<<<<<<< HEAD
  // Use useMemo to memoize filtered results
  const specialOffers = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.inStock &&
        product.valid_discounts?.length &&
        product.discount_details
=======
  // تصفية المنتجات التي عليها خصومات فقط
  const specialOffers = React.useMemo(() => {
    console.log("allProducts", allProducts);
    return allProducts.filter(product => 
      product.inStock && 
      product.valid_discounts && 
      product.valid_discounts.length > 0 && 
      product.discount_details
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
    );
  }, [allProducts]);

  // Memoized callback for better performance
  const handleRatingClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  if (loading && specialOffers.length === 0) {
    return (
      <section className={styles.specialOffers}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>عروض وتخفيضات</h2>
            <p className={styles.subtitle}>جاري تحميل العروض والتخفيضات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && specialOffers.length === 0) {
    return null;
  }

  return (
    <section className={styles.specialOffers}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>عروض وتخفيضات</h2>
          <p className={styles.subtitle}>
            اكتشف أفضل العروض والتخفيضات على منتجاتنا المميزة
          </p>
        </div>

        <div className={styles.productsGrid}>
          {specialOffers.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <ProductCard
                product={product}
                onRatingClick={handleRatingClick}
              />
            </div>
          ))}
        </div>

        <ViewAllButton
          text="عرض جميع المنتجات"
          onClick={() => navigate("/products")}
          variant="primary"
          size="medium"
        />
      </div>

      {/* Lazy loaded Reviews Modal */}
      <Suspense fallback={null}>
        {isReviewsModalOpen && selectedProduct && (
          <ReviewsModal
            isOpen={isReviewsModalOpen}
            onClose={handleCloseReviewsModal}
            product={selectedProduct}
          />
        )}
      </Suspense>
    </section>
  );
};

export default React.memo(SpecialOffers);
