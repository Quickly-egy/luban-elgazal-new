import React, { useState, useEffect } from "react";
import { FaStar, FaTimes, FaUser, FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";
import styles from "./ReviewsModal.module.css";

const ReviewsModal = ({ isOpen, onClose, product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ratingStats, setRatingStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    distribution: {
      "5_stars": 0,
      "4_stars": 0,
      "3_stars": 0,
      "2_stars": 0,
      "1_star": 0,
    },
  });

  // قائمة أسماء عربية عشوائية
  const randomArabicNames = [
    "أحمد محمد",
    "فاطمة أحمد",
    "محمد علي",
    "سارة حسن",
    "خالد عبدالله",
    "نورا محمود",
    "يوسف إبراهيم",
    "مريم سالم",
    "حسام فتحي",
    "دينا عماد",
    "طارق صالح",
    "هند ناصر",
    "كريم وائل",
    "لمياء حسين",
    "عمر طه",
    "ياسمين رشدي",
    "سامح نبيل",
    "منى عادل",
    "باسم مصطفى",
    "رنا أشرف",
    "شريف كمال",
    "هبة سمير",
    "ماجد حامد",
    "ندى رمضان",
    "أمين فاروق",
    "سلمى جمال",
    "وليد صبري",
    "رغد محسن",
    "عماد زكي",
    "لينا سليم",
  ];

  // function لإنشاء اسم عشوائي بناءً على review id لضمان الثبات
  const getRandomNameForAdminReview = (reviewId) => {
    // استخدم review id كـ seed للحصول على نفس الاسم دائماً لنفس التقييم
    const index = reviewId % randomArabicNames.length;
    return randomArabicNames[index];
  };

  useEffect(() => {
    if (isOpen && product) {
      loadReviewsFromProduct();
    }
  }, [isOpen, product]);

  const loadReviewsFromProduct = () => {
    try {
      setLoading(true);
      setError(null);

      // استخدام البيانات من المنتج مباشرة
      const reviewsInfo = product.reviews_info || {};

      setReviews(reviewsInfo.latest_reviews || []);
      setRatingStats({
        totalReviews: reviewsInfo.total_reviews || 0,
        averageRating: reviewsInfo.average_rating || 0,
        distribution: reviewsInfo.rating_distribution || {
          "5_stars": 0,
          "4_stars": 0,
          "3_stars": 0,
          "2_stars": 0,
          "1_star": 0,
        },
      });
    } catch (error) {

      setError("حدث خطأ في تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? styles.starFilled : styles.starEmpty}
          size={16}
        />
      );
    }
    return stars;
  };

  const getRatingCount = (rating) => {
    if (!ratingStats?.distribution) return 0;

    const distribution = ratingStats.distribution;
    switch (rating) {
      case 5:
        return distribution["5_stars"] || 0;
      case 4:
        return distribution["4_stars"] || 0;
      case 3:
        return distribution["3_stars"] || 0;
      case 2:
        return distribution["2_stars"] || 0;
      case 1:
        return distribution["1_star"] || 0;
      default:
        return 0;
    }
  };

  // منع التمرير في الصفحة الأساسية عند فتح الـ modal
  useEffect(() => {
    if (isOpen) {
      // حفظ موقع التمرير الحالي
      const scrollY = window.scrollY;

      // حفظ القيم الأصلية
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      // إيقاف التمرير مع الحفاظ على الموقع
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // تنظيف عند الإغلاق واستعادة الموقع
      return () => {
        document.body.style.overflow = originalOverflow || "";
        document.body.style.position = originalPosition || "";
        document.body.style.top = originalTop || "";
        document.body.style.width = originalWidth || "";

        // استعادة موقع التمرير
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRetry = () => {
    setError(null);
    if (product) {
      loadReviewsFromProduct();
    }
  };

  // استخدم بيانات المنتج من الـ props إذا لم تكن متوفرة في reviewsData
  const productData = product;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>تقييمات المنتج</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className={styles.productInfo}>
          <img
          loading="lazy"
            src={
              productData?.main_image_url ||
              productData?.image ||
              productData?.images?.[0] ||
              "https://via.placeholder.com/100x100?text=صورة"
            }
            alt={productData?.name}
            className={styles.productImage}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/100x100?text=صورة+المنتج";
            }}
          />
          <div className={styles.productDetails}>
            <h3 className={styles.productName}>{productData?.name}</h3>
            <div className={styles.overallRating}>
              <div className={styles.ratingValue}>
                {/* {ratingStats.averageRating?.toFixed(1) || "0.0"} */}
              </div>
              <div className={styles.stars}>
                <span className={styles.starsText}>
                  {product?.reviews_info?.rating_stars || ""}
                </span>
              </div>
              <div className={styles.reviewCount}>
                ({ratingStats.totalReviews || 0} تقييم)
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.spinner} />
            <p>جاري تحميل التقييمات...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryBtn} onClick={handleRetry}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className={styles.ratingRow}>
                  <span className={styles.ratingLabel}>{rating} نجوم</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width:
                          ratingStats.totalReviews > 0
                            ? `${
                                (getRatingCount(rating) /
                                  ratingStats.totalReviews) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className={styles.ratingCount}>
                    ({getRatingCount(rating)})
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.reviewsList}>
              <h3 className={styles.reviewsTitle}>التعليقات</h3>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          <FaUser size={16} />
                        </div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>
                            {review.customer_name}
                            {review.is_admin_review && (
                              <span className={styles.adminBadge}>
                                إدارة المتجر
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className={styles.reviewMeta}>
                        <div className={styles.reviewStars}>
                          <span className={styles.starsText}>
                            {review.stars}
                          </span>
                        </div>
                        <span className={styles.reviewDate}>
                          {review.formatted_date || review.created_at}
                        </span>
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className={styles.noReviews}>
                  <p>لا توجد تقييمات لهذا المنتج بعد.</p>
                  <p>كن أول من يقيم هذا المنتج!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ReviewsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

export default ReviewsModal;
