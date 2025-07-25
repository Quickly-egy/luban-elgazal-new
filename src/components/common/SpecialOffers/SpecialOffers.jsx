import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import styles from "./SpecialOffers.module.css";

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // استخدام hook المنتجات
  const { products: allProducts, loading } = useProductsWithAutoLoad();

  // تصفية المنتجات التي عليها خصومات فقط
  const specialOffers = React.useMemo(() => {
    console.log("allProducts", allProducts);
    return allProducts.filter(product => 
      product.inStock && 
      product.valid_discounts && 
      product.valid_discounts.length > 0 && 
      product.discount_details
    );
  }, [allProducts]);

  const handleRatingClick = (product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading && specialOffers.length === 0) {
    return (
      <section className={styles.specialOffers}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>عروض وتخفيضات</h2>
            <p className={styles.subtitle}>
              جاري تحميل العروض والتخفيضات...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (specialOffers.length === 0) {
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

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={handleCloseReviewsModal}
        product={selectedProduct}
      />
    </section>
  );
};

export default SpecialOffers;
