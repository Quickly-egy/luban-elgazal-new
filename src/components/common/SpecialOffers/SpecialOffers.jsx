import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import ProductCard from '../ProductCard/ProductCard';
import ReviewsModal from '../ReviewsModal/ReviewsModal';
import ViewAllButton from '../../ui/ViewAllButton/ViewAllButton';
import styles from './SpecialOffers.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // بيانات تجريبية للعروض والتخفيضات
  const specialOffers = [
    {
      id: 1,
      name: "باقة العناية بالشعر",
      weight: "250g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 8711.25,
      discountedPrice: 3750,
      discountPercentage: 57,
      rating: 4,
      reviewsCount: 93,
      inStock: true
    },
    {
      id: 2,
      name: "مجموعة العناية بالبشرة",
      weight: "180g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 5200,
      discountedPrice: 2800,
      discountPercentage: 46,
      rating: 4.5,
      reviewsCount: 127,
      inStock: true
    },
    {
      id: 3,
      name: "حزمة الفيتامينات الطبيعية",
      weight: "120 كبسولة",
      image: "/images/hair-care-product.jpg",
      originalPrice: 3500,
      discountedPrice: 1950,
      discountPercentage: 44,
      rating: 4.2,
      reviewsCount: 68,
      inStock: true
    },
    {
      id: 4,
      name: "مجموعة الزيوت العطرية",
      weight: "300ml",
      image: "/images/hair-care-product.jpg",
      originalPrice: 4800,
      discountedPrice: 2400,
      discountPercentage: 50,
      rating: 4.8,
      reviewsCount: 156,
      inStock: true
    },
    {
      id: 5,
      name: "باقة التجميل الطبيعي",
      weight: "200g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 6500,
      discountedPrice: 3900,
      discountPercentage: 40,
      rating: 4.3,
      reviewsCount: 89,
      inStock: true
    },
    {
      id: 6,
      name: "مجموعة العناية الشاملة",
      weight: "350g",
      image: "/images/hair-care-product.jpg",
      originalPrice: 9200,
      discountedPrice: 5520,
      discountPercentage: 40,
      rating: 4.6,
      reviewsCount: 201,
      inStock: true
    }
  ];

  const handleRatingClick = (product) => {
    setSelectedProduct(product);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className={styles.specialOffers}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>عروض وتخفيضات</h2>
          <p className={styles.subtitle}>اكتشف أفضل العروض والتخفيضات على منتجاتنا المميزة</p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={false}
            navigation={true}
            pagination={false}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            grabCursor={true}
            speed={800}
            breakpoints={{
              480: {
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
                slidesPerView: 4,
                spaceBetween: 30,
              }
            }}
            className={styles.productsSwiper}
          >
            {specialOffers.map(product => (
              <SwiperSlide key={product.id} className={styles.swiperSlide}>
                <ProductCard
                  product={product}
                  onRatingClick={handleRatingClick}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <ViewAllButton
          text="عرض جميع المنتجات"
          onClick={() => navigate('/products')}
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