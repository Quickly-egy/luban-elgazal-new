import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import styles from './CustomerReviews.module.css';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'أحمد محمد',
      location: 'الرياض، السعودية',
      rating: 5,
      review: 'منتجات لبان الغزال رائعة حقاً! الجودة عالية والأسعار مناسبة. أنصح الجميع بالتجربة. خدمة العملاء ممتازة والتوصيل سريع.',
      avatar: '/images/customer1.jpg',
      date: '2024/01/15'
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      location: 'دبي، الإمارات',
      rating: 5,
      review: 'تجربة تسوق رائعة! اللبان طبيعي 100% وله رائحة مميزة. استخدمته للعلاج وللبخور، النتائج فاقت توقعاتي بكثير.',
      avatar: '/images/customer2.jpg',
      date: '2024/01/20'
    },
    {
      id: 3,
      name: 'عبدالله سالم',
      location: 'الكويت',
      rating: 5,
      review: 'أفضل لبان جربته في حياتي! الجودة ممتازة والأصالة واضحة. سأستمر في الشراء من لبان الغزال بالتأكيد.',
      avatar: '/images/customer3.jpg',
      date: '2024/02/01'
    },
    {
      id: 4,
      name: 'مريم خالد',
      location: 'مسقط، عُمان',
      rating: 5,
      review: 'منتجات أصيلة وطبيعية 100%. استخدم اللبان للعناية بالبشرة والنتائج مذهلة. شحن سريع وتعامل راقي.',
      avatar: '/images/customer4.jpg',
      date: '2024/02/10'
    },
    {
      id: 5,
      name: 'محمد العتيبي',
      location: 'جدة، السعودية',
      rating: 5,
      review: 'خدمة عملاء متميزة وجودة منتجات لا تُضاهى. لبان الغزال هو خياري الأول دائماً للحصول على أجود أنواع اللبان.',
      avatar: '/images/customer5.jpg',
      date: '2024/02/15'
    },
    {
      id: 6,
      name: 'نورة السالم',
      location: 'الدوحة، قطر',
      rating: 5,
      review: 'تجربة استثنائية! اللبان عالي الجودة ورائحته طبيعية مميزة. التعامل محترف والأسعار مناسبة جداً.',
      avatar: '/images/customer6.jpg',
      date: '2024/02/20'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
        size={16}
      />
    ));
  };

  return (
    <section className={styles.customerReviews}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>آراء عملائنا</h2>
          <p className={styles.subtitle}>
            ما يقوله عملاؤنا الكرام عن تجربتهم مع منتجات لبان الغزال
          </p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            effect={'coverflow'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className={styles.reviewsSwiper}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className={styles.reviewCard}>
                  <div className={styles.quoteIcon}>
                    <FaQuoteLeft />
                  </div>
                  
                  <div className={styles.reviewContent}>
                    <div className={styles.rating}>
                      {renderStars(review.rating)}
                    </div>
                    
                    <p className={styles.reviewText}>
                      {review.review}
                    </p>
                    
                    <div className={styles.customerInfo}>
                      <div className={styles.avatar}>
                        <img 
                          src={review.avatar}
                          alt={review.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className={styles.avatarPlaceholder} style={{display: 'none'}}>
                          {review.name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className={styles.customerDetails}>
                        <h4 className={styles.customerName}>
                          {review.name}
                        </h4>
                        <p className={styles.customerLocation}>
                          {review.location}
                        </p>
                        <span className={styles.reviewDate}>
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 