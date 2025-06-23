import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = () => {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // بيانات تجريبية للمنتجات المميزة
  const featuredProducts = [
    {
      id: 1,
      name: "لبان جودري درجة أولى",
      weight: "250g",
      originalPrice: 12500,
      discountedPrice: 8750,
      discountPercentage: 30,
      rating: 4.8,
      reviewsCount: 145,
      inStock: true,
    },
    {
      id: 2,
      name: "زيت اللبان الطبيعي",
      weight: "30ml",
      originalPrice: 8500,
      discountedPrice: 6800,
      discountPercentage: 20,
      rating: 4.7,
      reviewsCount: 98,
      inStock: true,
    },
    {
      id: 3,
      name: "لبان للعلاج والاكل",
      weight: "200g",
      originalPrice: 15000,
      discountedPrice: 12000,
      discountPercentage: 20,
      rating: 4.9,
      reviewsCount: 210,
      inStock: true,
    },
    {
      id: 4,
      name: "بخور اللبان الملكي",
      weight: "150g",
      originalPrice: 9500,
      discountedPrice: 7600,
      discountPercentage: 20,
      rating: 4.6,
      reviewsCount: 76,
      inStock: true,
    },
    {
      id: 5,
      name: "مجموعة العناية باللبان",
      weight: "500g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 25000,
      discountedPrice: 18750,
      discountPercentage: 25,
      rating: 4.8,
      reviewsCount: 156,
      inStock: true,
    },
    {
      id: 6,
      name: "لبان للتجميل والبشرة",
      weight: "100g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 7500,
      discountedPrice: 5625,
      discountPercentage: 25,
      rating: 4.5,
      reviewsCount: 89,
      inStock: true,
    },
    {
      id: 7,
      name: "لبان مطحون ناعم",
      weight: "300g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 11000,
      discountedPrice: 8800,
      discountPercentage: 20,
      rating: 4.7,
      reviewsCount: 123,
      inStock: true,
    },
    {
      id: 8,
      name: "خليط اللبان الخاص",
      weight: "400g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 18000,
      discountedPrice: 14400,
      discountPercentage: 20,
      rating: 4.9,
      reviewsCount: 187,
      inStock: true,
    },
  ];

  const handleRatingClick = (product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  // تقسيم المنتجات إلى صفين
  const firstRow = featuredProducts.slice(0, 4);
  const secondRow = featuredProducts.slice(4, 8);

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
          {/* الصف الأول */}
          <div className={styles.productsRow}>
            {firstRow.map((product) => (
              <div key={product.id} className={styles.productWrapper}>
                <ProductCard
                  product={product}
                  onRatingClick={handleRatingClick}
                  showTimer={false}
                />
              </div>
            ))}
          </div>

          {/* الصف الثاني */}
          <div className={styles.productsRow}>
            {secondRow.map((product) => (
              <div key={product.id} className={styles.productWrapper}>
                <ProductCard
                  product={product}
                  onRatingClick={handleRatingClick}
                  showTimer={false}
                />
              </div>
            ))}
          </div>
        </div>

        <ViewAllButton
          text="عرض كل المنتجات"
          onClick={() => console.log("انتقال إلى صفحة جميع المنتجات")}
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
