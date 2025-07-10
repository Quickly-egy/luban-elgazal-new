import React, { useState, useEffect } from 'react';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner,
  FaExclamationTriangle,
  FaBox,
  FaShippingFast
} from 'react-icons/fa';
import { trackShippingOrder } from '../../../services/shipping';
import styles from './ShippingTracker.module.css';

const ShippingTracker = ({ trackingNumber, onClose }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // حالات الشحن مع الأيقونات والألوان
  const shippingStatuses = {
    'created': {
      icon: <FaBox />,
      label: 'تم إنشاء الطلب',
      color: '#6c757d',
      description: 'تم إنشاء طلب الشحن بنجاح'
    },
    'picked_up': {
      icon: <FaTruck />,
      label: 'تم الاستلام',
      color: '#007bff',
      description: 'تم استلام الطلب من المرسل'
    },
    'in_transit': {
      icon: <FaShippingFast />,
      label: 'في الطريق',
      color: '#ffc107',
      description: 'الطلب في طريقه إليك'
    },
    'out_for_delivery': {
      icon: <FaTruck />,
      label: 'خارج للتوصيل',
      color: '#fd7e14',
      description: 'الطلب خارج للتوصيل'
    },
    'delivered': {
      icon: <FaCheckCircle />,
      label: 'تم التوصيل',
      color: '#28a745',
      description: 'تم توصيل الطلب بنجاح'
    },
    'failed': {
      icon: <FaExclamationTriangle />,
      label: 'فشل التوصيل',
      color: '#dc3545',
      description: 'فشل في توصيل الطلب'
    }
  };

  // تحديث بيانات التتبع
  const fetchTrackingData = async () => {
    if (!trackingNumber) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await trackShippingOrder(trackingNumber);
      
      if (result.success) {
        setTrackingData(result);
        setLastUpdate(new Date().toLocaleString('ar-SA'));
      } else {
        setError(result.error || 'فشل في تتبع الشحن');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تتبع الشحن');
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث تلقائي كل 30 ثانية
  useEffect(() => {
    fetchTrackingData();
    
    const interval = setInterval(fetchTrackingData, 30000);
    return () => clearInterval(interval);
  }, [trackingNumber]);

  // عرض حالة التحميل
  if (isLoading && !trackingData) {
    return (
      <div className={styles.shippingTracker}>
        <div className={styles.header}>
          <h3>تتبع الشحن</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          <p>جاري تحميل بيانات التتبع...</p>
        </div>
      </div>
    );
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className={styles.shippingTracker}>
        <div className={styles.header}>
          <h3>تتبع الشحن</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.error}>
          <FaExclamationTriangle />
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={fetchTrackingData}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // عرض بيانات التتبع
  return (
    <div className={styles.shippingTracker}>
      <div className={styles.header}>
        <h3>تتبع الشحن</h3>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        {/* معلومات الطلب */}
        <div className={styles.orderInfo}>
          <div className={styles.trackingNumber}>
            <strong>رقم التتبع:</strong> {trackingNumber}
          </div>
          
          {trackingData?.status && (
            <div 
              className={styles.currentStatus}
              style={{ backgroundColor: shippingStatuses[trackingData.status]?.color }}
            >
              {shippingStatuses[trackingData.status]?.icon}
              <span>{shippingStatuses[trackingData.status]?.label}</span>
            </div>
          )}

          {trackingData?.location && (
            <div className={styles.location}>
              <FaMapMarkerAlt />
              <span>الموقع الحالي: {trackingData.location}</span>
            </div>
          )}

          {trackingData?.estimatedDelivery && (
            <div className={styles.estimatedDelivery}>
              <FaClock />
              <span>التوصيل المتوقع: {trackingData.estimatedDelivery}</span>
            </div>
          )}
        </div>

        {/* تاريخ التتبع */}
        {trackingData?.history && trackingData.history.length > 0 && (
          <div className={styles.trackingHistory}>
            <h4>تاريخ الشحن</h4>
            <div className={styles.timeline}>
              {trackingData.history.map((event, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    {shippingStatuses[event.status]?.icon || <FaBox />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineStatus}>
                      {shippingStatuses[event.status]?.label || event.status}
                    </div>
                    <div className={styles.timelineDescription}>
                      {event.description || shippingStatuses[event.status]?.description}
                    </div>
                    <div className={styles.timelineDate}>
                      {new Date(event.timestamp).toLocaleString('ar-SA')}
                    </div>
                    {event.location && (
                      <div className={styles.timelineLocation}>
                        <FaMapMarkerAlt />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className={styles.additionalInfo}>
          <div className={styles.updateInfo}>
            <FaClock />
            <span>آخر تحديث: {lastUpdate}</span>
          </div>
          
          <button 
            className={styles.refreshButton}
            onClick={fetchTrackingData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} />
                جاري التحديث...
              </>
            ) : (
              <>
                <FaShippingFast />
                تحديث البيانات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingTracker; 