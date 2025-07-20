import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import styles from "./FeaturedProducts.module.css";
import { useNavigate } from "react-router-dom";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import useLocationStore from "../../../stores/locationStore";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // استخدام نفس hook المستخدم في صفحة المنتجات وFeaturedPackages
  const { products: allProducts, loading, error } = useProductsWithAutoLoad();

  const handleRatingClick = (product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  // Process and organize products by category - محدث لعرض منتجين من كل قسم بحد أقصى 8 منتجات
  const getFeaturedProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
    
      return [];
    }

   

    // Group products by category - فقط المنتجات المتاحة والمتوفرة
    const productsByCategory = products.reduce((acc, product) => {
      const category =
        product.category?.name || product.category || "منتجات عامة";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    console.log(
      "📂 Products grouped by categories:",
      Object.keys(productsByCategory)
    );


    // Get 2 products from each category, sorted by rating and reviews
    let featuredProducts = [];
    Object.entries(productsByCategory).forEach(
      ([category, categoryProducts]) => {
     
        // Sort by rating first, then by reviews count, then by discount
        const topProducts = categoryProducts
          .sort((a, b) => {
            // Primary sort: rating
            const ratingA = a.reviews_info?.average_rating || a.rating || 0;
            const ratingB = b.reviews_info?.average_rating || b.rating || 0;
            if (ratingB !== ratingA) return ratingB - ratingA;

            // Secondary sort: reviews count
            const reviewsA =
              a.reviews_info?.total_reviews || a.reviewsCount || 0;
            const reviewsB =
              b.reviews_info?.total_reviews || b.reviewsCount || 0;
            if (reviewsB !== reviewsA) return reviewsB - reviewsA;

            // Tertiary sort: discount percentage
            const discountA = a.discount_details?.value || 0;
            const discountB = b.discount_details?.value || 0;
            return discountB - discountA;
          })
          .slice(0, 2) // أخذ أفضل منتجين من كل فئة
          .map((product) => ({
            ...product,
            displayCategory: category,
          }));
        featuredProducts.push(...topProducts);
      }
    );
 
    // Limit to maximum 8 products and ensure variety
    const finalProducts = featuredProducts.slice(0, 8);

   

    return finalProducts;
  };

  if (loading) {
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

  // Debug: تسجيل البيانات الواردة
  console.log("🔍 FeaturedProducts - All products:", allProducts);
  console.log("🔍 FeaturedProducts - Products length:", allProducts?.length);

  const featuredProducts = getFeaturedProducts(allProducts);

  // Debug: تسجيل النتيجة النهائية
  console.log("🎯 FeaturedProducts - Final result:", featuredProducts);
  console.log("🎯 FeaturedProducts - Length:", featuredProducts?.length);

  // إذا لم توجد منتجات مميزة، اعرض رسالة تشخيص
  if (featuredProducts.length === 0) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>منتجاتنا المميزة</h2>
            <p className={styles.subtitle}>
              🔍 لا توجد منتجات مميزة متاحة حالياً - تحقق من الكونسول للتفاصيل
            </p>
          </div>
          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <p>📊 إجمالي المنتجات: {allProducts?.length || 0}</p>
            <p>🔍 منتجات مميزة: {featuredProducts.length}</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              تحقق من الكونسول لمزيد من التفاصيل
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          {/* <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className={styles.swiper}
          >
            {featuredProducts.map((product) => (
              <SwiperSlide
                key={`featured-${product.id}-${
                  useLocationStore.getState().countryCode
                }`}
                className={styles.swiperSlide}
              >
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
          </Swiper> */}
             {featuredProducts.map((el)=>{
              return(
                <ProductCard key={el.id} product={el}/>
              )
             })}

          
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
