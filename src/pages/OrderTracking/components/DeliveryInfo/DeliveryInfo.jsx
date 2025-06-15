import React from 'react';
import { FaTruck, FaMapMarkerAlt, FaClock, FaUser, FaPhone, FaBarcode } from 'react-icons/fa';
import styles from './DeliveryInfo.module.css';

const DeliveryInfo = ({ delivery }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.deliveryContainer}>
      <div className={styles.deliveryHeader}>
        <h3 className={styles.deliveryTitle}>
          <FaTruck className={styles.deliveryIcon} />
          معلومات التوصيل
        </h3>
      </div>

      <div className={styles.deliveryContent}>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FaMapMarkerAlt />
            </div>
            <div className={styles.infoDetails}>
              <h4 className={styles.infoTitle}>عنوان التوصيل</h4>
              <p className={styles.infoValue}>{delivery.address}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FaClock />
            </div>
            <div className={styles.infoDetails}>
              <h4 className={styles.infoTitle}>موعد التوصيل المتوقع</h4>
              <p className={styles.infoValue}>
                {formatDate(delivery.estimatedDate)}
                <br />
                <span className={styles.timeRange}>{delivery.deliveryTime}</span>
              </p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FaBarcode />
            </div>
            <div className={styles.infoDetails}>
              <h4 className={styles.infoTitle}>رقم التتبع</h4>
              <p className={styles.infoValue}>{delivery.trackingNumber}</p>
            </div>
          </div>
        </div>

        <div className={styles.courierCard}>
          <div className={styles.courierHeader}>
            <div className={styles.courierIcon}>
              <FaUser />
            </div>
            <h4 className={styles.courierTitle}>معلومات المندوب</h4>
          </div>

          <div className={styles.courierInfo}>
            <div className={styles.courierDetail}>
              <span className={styles.courierLabel}>الاسم:</span>
              <span className={styles.courierValue}>{delivery.courierName}</span>
            </div>
            
            <div className={styles.courierDetail}>
              <span className={styles.courierLabel}>الهاتف:</span>
              <span className={styles.courierValue}>{delivery.courierPhone}</span>
            </div>

            <a 
              href={`tel:${delivery.courierPhone}`} 
              className={styles.callButton}
            >
              <FaPhone />
              اتصال بالمندوب
            </a>
          </div>
        </div>

        <div className={styles.deliveryNotes}>
          <h4 className={styles.notesTitle}>📝 ملاحظات مهمة</h4>
          <ul className={styles.notesList}>
            <li>تأكد من وجودك في العنوان المحدد خلال موعد التوصيل</li>
            <li>سيتصل بك المندوب قبل الوصول بـ 15-30 دقيقة</li>
            <li>يرجى إحضار هويتك الشخصية عند الاستلام</li>
            <li>في حالة الدفع عند الاستلام، تأكد من توفر المبلغ المطلوب</li>
          </ul>
        </div>

        <div className={styles.supportCard}>
          <h4 className={styles.supportTitle}>🆘 تحتاج مساعدة؟</h4>
          <p className={styles.supportText}>
            تواصل مع خدمة العملاء على الرقم
            <a href="tel:19123" className={styles.supportPhone}>19123</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo; 