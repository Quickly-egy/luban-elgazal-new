import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaInstagram, FaFacebook, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { apiService } from '../../../services/api';

import styles from './CustomerReviews.module.css';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSlidesPerView(3);
      } else if (width >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const maxSlide = Math.max(0, reviews.length - slidesPerView);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length, slidesPerView]);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/testimonials');

        if (response?.status === 'success' && response?.data) {
          // Transform API data to match component structure
          const transformedReviews = response.data
            .filter(item => item.status === 'active') // Only show active testimonials
            .map((item) => ({
              id: item.id,
              name: item.client_name,
              location: getLocationBySource(item.source), // Generate location based on source
              rating: item.stars,
              review: item.review,
              avatar: generateAvatarPlaceholder(item.client_name),
              date: formatDate(item.created_at),
              source: item.source
            }));

          setReviews(transformedReviews);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('فشل في تحميل آراء العملاء');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Helper function to get location based on source
  const getLocationBySource = (source) => {
    const locations = {
      instagram: 'متابع على إنستغرام',
      facebook: 'متابع على فيسبوك',
      default: 'عميل كريم'
    };
    return locations[source] || locations.default;
  };

  // Helper function to generate avatar placeholder
  const generateAvatarPlaceholder = (name) => {
    return name ? name.charAt(0) : '؟';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'تاريخ غير محدد';
    }
  };

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => {
      const maxSlide = Math.max(0, reviews.length - slidesPerView);
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide(prev => {
      const maxSlide = Math.max(0, reviews.length - slidesPerView);
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Helper function to get source icon
  const getSourceIcon = (source) => {
    switch (source) {
      case 'instagram':
        return <FaInstagram className={styles.sourceIcon} />;
      case 'facebook':
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

        <div className={styles.sliderContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>

          {/* Navigation Buttons */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <FaChevronRight />
          </button>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <FaChevronLeft />
          </button>

          {/* Slider Track */}
          <div className={styles.sliderTrack}>
            <div
              className={styles.sliderWrapper}
              style={{
                transform: `translateX(${currentSlide * (100 / slidesPerView)}%)`,
                width: `${(reviews.length / slidesPerView) * 100}%`
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={styles.slide}
                  style={{ width: `${100 / reviews.length}%` }}
                >
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

                      <p className={styles.reviewText}>
                        {review.review}
                      </p>

                      <div className={styles.customerInfo}>
                        <div className={styles.avatar}>
                          <div className={styles.avatarPlaceholder}>
                            {review.avatar}
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
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className={styles.pagination}>
            {Array.from({ length: Math.max(1, reviews.length - slidesPerView + 1) }, (_, index) => (
              <button
                key={index}
                className={`${styles.paginationDot} ${currentSlide === index ? styles.active : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 