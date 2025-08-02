import React, { useState, useMemo, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import styles from "./SpecialOffers.module.css";

const ReviewsModal = React.lazy(() => import("../ReviewsModal/ReviewsModal"));

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products: allProducts } = useProductsWithAutoLoad();

  const specialOffers = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.inStock &&
        product.valid_discounts?.length > 0 &&
        product.discount_details
    );
  }, [allProducts]);

  const handleRatingClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  if (specialOffers.length === 0) return null;

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
