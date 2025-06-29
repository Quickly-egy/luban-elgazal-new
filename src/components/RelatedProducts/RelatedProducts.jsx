import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../common/ProductCard/ProductCard";
import ReviewsModal from "../common/ReviewsModal/ReviewsModal";
import useProductsStore from "../../stores/productsStore";
import useLocationStore from "../../stores/locationStore";
import "./RelatedProducts.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const RelatedProducts = ({ currentProduct }) => {
  const { allProducts } = useProductsStore();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // تصفية المنتجات للحصول على منتجات من نفس الفئة (باستثناء المنتج الحالي)
  const relatedProducts = useMemo(() => {
    if (!currentProduct || !allProducts.length) return [];

    const sameCategory = allProducts.filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id &&
        product.stock_info?.in_stock // عرض المنتجات المتاحة فقط
    );

    // ترتيب المنتجات حسب التقييم والمراجعات
    return sameCategory
      .sort((a, b) => {
        const aRating = a.reviews_info?.average_rating || 0;
        const bRating = b.reviews_info?.average_rating || 0;
        const aReviews = a.reviews_info?.total_reviews || 0;
        const bReviews = b.reviews_info?.total_reviews || 0;

        if (bRating !== aRating) return bRating - aRating;
        return bReviews - aReviews;
      })
      .slice(0, 8); // عرض 8 منتجات كحد أقصى
  }, [currentProduct, allProducts]);

  const handleRatingClick = (product) => {
    console.log("عرض تقييمات المنتج:", product.name);
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  // إذا لم توجد منتجات ذات صلة، لا تعرض القسم
  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="related-products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" style={{ color: "white" }}>
            منتجات ذات صلة من فئة "{currentProduct?.category}"
          </h2>
          <p className="section-subtitle">
            اكتشف المزيد من المنتجات المميزة في نفس الفئة
          </p>
        </div>

        <div className="swiper-container">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={relatedProducts.length > 3}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              980: {
                slidesPerView: 3,
                spaceBetween: 22,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 25,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 35,
              },
            }}
            className="related-products-swiper"
          >
            {relatedProducts.map((product) => (
              <SwiperSlide key={`related-${product.id}-${useLocationStore.getState().countryCode}`}>
                <ProductCard
                  product={product}
                  onRatingClick={handleRatingClick}
                  showTimer={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          {relatedProducts.length > 1 && (
            <div className="swiper-pagination-custom"></div>
          )}
        </div>

        {/* Reviews Modal */}
        <ReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default RelatedProducts;
