import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaInstagram,
  FaFacebook,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { apiService } from "../../../services/api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./CustomerReviews.module.css";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await apiService.get("/testimonials");

        if (response?.status === "success" && response?.data) {
          // Transform API data to match component structure
          const transformedReviews = response.data
            .filter((item) => item.status === "active") // Only show active testimonials
            .map((item) => ({
              id: item.id,
              name: item.client_name,
              location: getLocationBySource(item.source), // Generate location based on source
              rating: item.stars,
              review: item.review,
              avatar: generateAvatarPlaceholder(item.client_name),
              date: formatDate(item.created_at),
              source: item.source,
            }));

          setReviews(transformedReviews);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("فشل في تحميل آراء العملاء");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Helper function to get location based on source
  const getLocationBySource = (source) => {
    const locations = {
      instagram: "متابع على إنستغرام",
      facebook: "متابع على فيسبوك",
      default: "عميل كريم",
    };
    return locations[source] || locations.default;
  };

  // Helper function to generate avatar placeholder
  const generateAvatarPlaceholder = (name) => {
    return name ? name.charAt(0) : "؟";
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "تاريخ غير محدد";
    }
  };

  // Helper function to get source icon
  const getSourceIcon = (source) => {
    switch (source) {
      case "instagram":
        return <FaInstagram className={styles.sourceIcon} />;
      case "facebook":
        return <FaFacebook className={styles.sourceIcon} />;
      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
        size={16}
      />
    ));
  };

  if (loading) {
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
            <div className={styles.loadingSpinner}></div>
            <p>جاري تحميل آراء العملاء...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.customerReviews}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>آراء عملائنا</h2>
            <p className={styles.subtitle}>
              ما يقوله عملاؤنا الكرام عن تجربتهم مع منتجات لبان الغزال
            </p>
          </div>
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className={styles.customerReviews}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>آراء عملائنا</h2>
            <p className={styles.subtitle}>
              ما يقوله عملاؤنا الكرام عن تجربتهم مع منتجات لبان الغزال
            </p>
          </div>
          <div className={styles.noReviews}>
            <p>لا توجد آراء عملاء متاحة حالياً</p>
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
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={false}
            allowTouchMove={true}
            grabCursor={true}
            navigation={{
              prevEl: `.${styles.prevButton}`,
              nextEl: `.${styles.nextButton}`,
            }}
            pagination={{
              el: `.${styles.pagination}`,
              clickable: true,
              bulletClass: styles.paginationDot,
              bulletActiveClass: styles.active,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: false,
              stopOnLastSlide: false,
            }}
            loop={true}
            speed={800}
            watchSlidesProgress={true}
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
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className={styles.reviewCard}>
                  <div className={styles.quoteIcon}>
                    <FaQuoteLeft />
                  </div>

                  <div className={styles.reviewContent}>
                    <div className={styles.ratingContainer}>
                      <div className={styles.rating}>
                        {renderStars(review.rating)}
                      </div>
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
                        <p className={styles.customerLocation}>
                          {review.location}
                        </p>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className={`${styles.navButton} ${styles.prevButton}`}>
            <FaChevronRight />
          </button>
          <button className={`${styles.navButton} ${styles.nextButton}`}>
            <FaChevronLeft />
          </button>

          {/* Custom Pagination */}
          <div className={styles.pagination}></div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
