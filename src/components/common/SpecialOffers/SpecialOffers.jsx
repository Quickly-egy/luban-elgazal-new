import React, { useState, useMemo, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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

  // تحديد عدد العناصر المعروضة حسب حجم الشاشة
  const swiperConfig = useMemo(() => ({
    modules: [Autoplay, Navigation],
    spaceBetween: 30,
    slidesPerView: 1,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.special-offers-swiper-button-next',
      prevEl: '.special-offers-swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
    className: 'special-offers-swiper',
    loop: specialOffers.length > 3,
  }), [specialOffers.length]);

  if (specialOffers.length === 0) return null;

  // إذا كان عدد المنتجات قليل، اعرضها في Grid عادي
  const shouldUseSlider = specialOffers.length > 3;

  return (
    <section className={styles.specialOffers}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>عروض وتخفيضات</h2>
          <p className={styles.subtitle}>
            اكتشف أفضل العروض والتخفيضات على منتجاتنا المميزة
          </p>
        </div>

        {shouldUseSlider ? (
          <div className={styles.sliderContainer}>
            <div className={styles.swiperWrapper}>
              <Swiper {...swiperConfig}>
                {specialOffers.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className={styles.productItem}>
                      <ProductCard
                        product={product}
                        onRatingClick={handleRatingClick}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <div className={`${styles.swiperNavBtn} ${styles.prevBtn} special-offers-swiper-button-prev`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={`${styles.swiperNavBtn} ${styles.nextBtn} special-offers-swiper-button-next`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
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
        )}

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