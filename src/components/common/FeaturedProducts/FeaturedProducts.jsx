import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import styles from "./FeaturedProducts.module.css";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../../services/endpoints";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products-with-reviews"],
    queryFn: () => productAPI.getProductsWithReviews(),
  });

  const handleRatingClick = (product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  // Process and organize products by category
  const getFeaturedProducts = (products) => {
    if (!products) return [];

    // Group products by category
    const productsByCategory = products.reduce((acc, product) => {
      if (!product.is_available) return acc;
      const category = product.category?.name || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    // Get 2 products from each category
    let featuredProducts = [];
    Object.entries(productsByCategory).forEach(([category, products]) => {
      // Sort by rating and take top 2
      const topProducts = products
        .sort(
          (a, b) =>
            (b.reviews_info?.average_rating || 0) -
            (a.reviews_info?.average_rating || 0)
        )
        .slice(0, 2)
        .map((product) => ({
          ...product,
          displayCategory: category,
        }));
      featuredProducts.push(...topProducts);
    });

    // Limit to maximum 10 products
    return featuredProducts.slice(0, 10);
  };

  if (isLoading) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>منتجاتنا المميزة</h2>
            <p className={styles.subtitle}>
              اكتشف مجموعتنا المختارة من أجود أنواع اللبان العماني الأصيل
            </p>
          </div>
          <div className={styles.productsContainer}>
            <div className={styles.productsRow}>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={`${styles.productWrapper} ${styles.loading}`}
                >
                  <div className={styles.productPlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error loading products:", error);
    return null;
  }

  const featuredProducts = getFeaturedProducts(productsData?.data || []);

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>منتجاتنا المميزة</h2>
          <p className={styles.subtitle}>
            اكتشف مجموعتنا المختارة من أجود أنواع اللبان العماني الأصيل
          </p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={slidesPerView}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className={styles.swiper}
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id} className={styles.swiperSlide}>
                <ProductCard
                  product={{
                    ...product,
                    rating: product.reviews_info?.average_rating || 0,
                    reviewsCount: product.reviews_info?.total_reviews || 0,
                    inStock:
                      product.is_available &&
                      product.total_warehouse_quantity > 0,
                    originalPrice: product.selling_price,
                    discountedPrice: product.discount_details?.final_price,
                    discountPercentage: product.discount_details?.value,
                    image: product.main_image_url,
                  }}
                  onRatingClick={handleRatingClick}
                  showTimer={true}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <ViewAllButton
          text="عرض كل المنتجات"
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

export default FeaturedProducts;
