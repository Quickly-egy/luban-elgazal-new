import React, { useEffect } from 'react';
import { FaStar, FaTimes, FaUser } from 'react-icons/fa';
import styles from './ReviewsModal.module.css';

const ReviewsModal = ({ isOpen, onClose, product }) => {
  // بيانات وهمية للتقييمات
  const reviews = [
    {
      id: 1,
      userName: 'أحمد محمد',
      rating: 5,
      date: '2024-01-15',
      comment: 'منتج ممتاز جداً، جودة عالية وسعر مناسب. أنصح بشدة بشرائه.',
      verified: true
    },
    {
      id: 2,
      userName: 'فاطمة علي',
      rating: 4,
      date: '2024-01-10',
      comment: 'منتج جيد لكن التوصيل كان متأخر قليلاً. المنتج نفسه ممتاز.',
      verified: true
    },
    {
      id: 3,
      userName: 'محمد حسن',
      rating: 5,
      date: '2024-01-08',
      comment: 'تجربة رائعة! المنتج وصل في الوقت المحدد والجودة فاقت التوقعات.',
      verified: false
    },
    {
      id: 4,
      userName: 'سارة أحمد',
      rating: 4,
      date: '2024-01-05',
      comment: 'منتج جيد جداً، استخدمته لمدة أسبوع والنتائج مرضية للغاية.',
      verified: true
    },
    {
      id: 5,
      userName: 'خالد عبدالله',
      rating: 3,
      date: '2024-01-02',
      comment: 'المنتج جيد لكن السعر مرتفع قليلاً مقارنة بالمنتجات المشابهة.',
      verified: true
    }
  ];

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

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingCount = (rating) => {
    return reviews.filter(review => review.rating === rating).length;
  };

  // منع التمرير في الصفحة الأساسية عند فتح الـ modal
  useEffect(() => {
    if (isOpen) {
      // إيقاف التمرير
      document.body.style.overflow = 'hidden';
    } else {
      // إعادة تشغيل التمرير
      document.body.style.overflow = 'unset';
    }

    // تنظيف عند إزالة المكون
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>تقييمات المنتج</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className={styles.productInfo}>
          <img src={product?.image} alt={product?.name} className={styles.productImage} />
          <div className={styles.productDetails}>
            <h3 className={styles.productName}>{product?.name}</h3>
            <div className={styles.overallRating}>
              <div className={styles.ratingValue}>{getAverageRating()}</div>
              <div className={styles.stars}>
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <div className={styles.reviewCount}>({reviews.length} تقييم)</div>
            </div>
          </div>
        </div>

        <div className={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className={styles.ratingRow}>
              <span className={styles.ratingLabel}>{rating} نجوم</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{width: `${(getRatingCount(rating) / reviews.length) * 100}%`}}
                ></div>
              </div>
              <span className={styles.ratingCount}>({getRatingCount(rating)})</span>
            </div>
          ))}
        </div>

        <div className={styles.reviewsList}>
          <h3 className={styles.reviewsTitle}>التعليقات</h3>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    <FaUser size={16} />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{review.userName}</span>
                  </div>
                </div>
                <div className={styles.reviewMeta}>
                  <div className={styles.reviewStars}>
                    {renderStars(review.rating)}
                  </div>
                  <span className={styles.reviewDate}>{review.date}</span>
                </div>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal; 