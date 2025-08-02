import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { apiService } from "../../../services/api";
import "swiper/css";


import styles from "./CustomerReviews.module.css";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // لحماية الـ state لو الكومبوننت اتفكك
    const fetchTestimonials = async () => {
      try {
        const response = await apiService.get("/testimonials");
        if (isMounted && response?.status === "success" && response?.data) {
          const transformed = response.data
            .filter((item) => item.status === "active")
            .map((item) => ({
              id: item.id,
              name: item.client_name,
              location: getLocationBySource(item.source),
              rating: item.stars,
              review: item.review,
              avatar: item.client_name?.charAt(0) || "؟",
              date: formatDate(item.created_at),
              source: item.source,
            }));
          setReviews(transformed);
        }
      } catch (err) {
        if (isMounted) setError("فشل في تحميل آراء العملاء");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const getLocationBySource = (source) =>
    ({
      instagram: "متابع على إنستغرام",
      facebook: "متابع على فيسبوك",
    }[source] || "عميل كريم");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "تاريخ غير محدد"
      : date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  const getSourceIcon = useCallback((source) => {
    switch (source) {
      case "instagram":
        return <FaInstagram className={styles.sourceIcon} />;
      case "facebook":
        return <FaFacebook className={styles.sourceIcon} />;
      default:
        return null;
    }
  }, []);

  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? styles.starFilled : styles.starEmpty}
        size={16}
      />
    ));
  }, []);

  const renderedSlides = useMemo(() => {
    return reviews.map((review) => (
      <SwiperSlide key={review.id}>
        <div className={styles.reviewCard}>
          <div className={styles.quoteIcon}>
            <FaQuoteLeft />
          </div>

          <div className={styles.reviewContent}>
            <div className={styles.ratingContainer}>
              <div className={styles.rating}>{renderStars(review.rating)}</div>
              {review.source && (
                <div className={styles.source}>
                  {getSourceIcon(review.source)}
                </div>
              )}
            </div>

            <p className={styles.reviewText}>{review.review}</p>

            <div className={styles.customerInfo}>
              <div className={styles.avatar}>
                <div className={styles.avatarPlaceholder}>
                  {review.avatar}
                </div>
              </div>
              <div className={styles.customerDetails}>
                <h4 className={styles.customerName}>{review.name}</h4>
                <p className={styles.customerLocation}>{review.location}</p>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ));
  }, [reviews, renderStars, getSourceIcon]);

  if (loading || error || reviews.length === 0) {
    return (
      <section className={styles.customerReviews}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>آراء عملائنا</h2>
            <p className={styles.subtitle}>
              ما يقوله عملاؤنا الكرام عن تجربتهم مع منتجات لبان الغزال
            </p>
          </div>
          <div className={styles.loading}>
            {loading && (
              <>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل آراء العملاء...</p>
              </>
            )}
            {error && <p>{error}</p>}
            {!loading && !error && <p>لا توجد آراء عملاء متاحة حالياً</p>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.customerReviews}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>آراء عملائنا</h2>
          <p className={styles.subtitle}>
            ما يقوله عملاؤنا الكرام عن تجربتهم مع منتجات لبان الغزال
          </p>
        </div>

        <div className={styles.sliderContainer}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={false}
            grabCursor={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={800}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className={styles.reviewsSwiper}
          >
            {renderedSlides}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
