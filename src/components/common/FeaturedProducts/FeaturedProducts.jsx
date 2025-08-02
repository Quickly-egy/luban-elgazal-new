import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import styles from "./FeaturedProducts.module.css";
import { useNavigate } from "react-router-dom";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import useLocationStore from "../../../stores/locationStore";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Lazy load the modal
const ReviewsModal = React.lazy(() => import("../ReviewsModal/ReviewsModal"));

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products: allProducts, loading, error } = useProductsWithAutoLoad();

  const handleRatingClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const getFeaturedProducts = useCallback((products) => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category?.name || product.category || "منتجات عامة";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

    let featured = [];
    Object.entries(productsByCategory).forEach(([category, items]) => {
      const sorted = items
        .sort((a, b) => {
          const ratingA = a.reviews_info?.average_rating || a.rating || 0;
          const ratingB = b.reviews_info?.average_rating || b.rating || 0;
          if (ratingB !== ratingA) return ratingB - ratingA;

          const reviewsA = a.reviews_info?.total_reviews || a.reviewsCount || 0;
          const reviewsB = b.reviews_info?.total_reviews || b.reviewsCount || 0;
          if (reviewsB !== reviewsA) return reviewsB - reviewsA;

          const discountA = a.discount_details?.value || 0;
          const discountB = b.discount_details?.value || 0;
          return discountB - discountA;
        })
        .slice(0, 2)
        .map((p) => ({ ...p, displayCategory: category }));
      featured.push(...sorted);
    });

    return featured.slice(0, 8);
  }, []);

  const featuredProducts = useMemo(() => getFeaturedProducts(allProducts), [allProducts, getFeaturedProducts]);

  if (loading) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>منتجاتنا المميزة</h2>
            <p className={styles.subtitle}>جارٍ تحميل المنتجات...</p>
          </div>
          <div className={styles.productsContainer}>
            <div className={styles.productsRow}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.productWrapper} ${styles.loading}`}>
                  <div className={styles.productPlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredProducts.length === 0) return null;

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>منتجاتنا المميزة</h2>
          <p className={styles.subtitle}>
            اكتشف مجموعتنا المختارة من أجود أنواع اللبان العماني الأصيل
          </p>
        </div>

        <div className={styles.featuredProducts2}>
          {featuredProducts.map((el) => (
            <ProductCard key={el.id} product={el} onRatingClick={handleRatingClick} />
          ))}
        </div>

        <ViewAllButton
          text="عرض كل المنتجات"
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

export default React.memo(FeaturedProducts);
