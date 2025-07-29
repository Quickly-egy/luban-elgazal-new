import React from "react";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaClock,
  FaHourglassHalf,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from './OrderTimeline.module.css';

const getIcon = (status, statusCode) => {
  // Check by status code first for more accurate mapping
  switch (statusCode) {
    case 'S050': return <FaCheckCircle className="text-green-600" />;  // Delivered
    case 'S040': return <FaTruck className="text-blue-500" />;         // Out for Delivery
    case 'S030': return <FaBoxOpen className="text-yellow-500" />;      // Order Shipped
    case 'S020': return <FaClock className="text-orange-500" />;        // Order Processing
    case 'S010': return <FaHourglassHalf className="text-gray-500" />;  // Order Received
    case 'S060': return <FaClock className="text-red-500" />;           // Failed Delivery
    case 'S070': return <FaBoxOpen className="text-red-400" />;         // Returned
    default:
      // Fallback to status text matching
      if (status.includes("Delivered")) return <FaCheckCircle className="text-green-600" />;
      if (status.includes("Driver") || status.includes("Delivery")) return <FaTruck className="text-blue-500" />;
      if (status.includes("Shipped") || status.includes("Bag") || status.includes("Parcel")) return <FaBoxOpen className="text-yellow-500" />;
      if (status.includes("Processing")) return <FaClock className="text-orange-500" />;
      return <FaHourglassHalf className="text-gray-400" />;
  }
};

const OrderTimeline = ({ orderHistory }) => {
  // Handle both new API structure and legacy structure
  const trackingData = orderHistory?.tracking_history || orderHistory || [];
  const orderNumber = orderHistory?.order_number;
  
  if (!trackingData || trackingData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
        <h2 className="text-3xl my-4 font-bold text-center text-indigo-700 mb-12">
          🛒 تتبع الطلب
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد معلومات تتبع متاحة حالياً</p>
        </div>
      </div>
    );
  }

  const getStatusLevel = (statusCode) => {
    switch (statusCode) {
      case 'S050': return 'completed';
      case 'S040': case 'S030': return 'active';
      case 'S060': case 'S070': return 'failed';
      default: return 'pending';
    }
  };

  return (
    <div className={styles.timelineContainer}>
      {/* Header */}
      <div className={styles.timelineHeader}>
        <h2 className={styles.timelineTitle}>
          <FaMapMarkerAlt className={styles.timelineIcon} />
          تتبع رحلة طلبك
        </h2>
        <p className={styles.timelineSubtitle}>
          تابع مراحل توصيل طلبك لحظة بلحظة
        </p>
      </div>
      
      {/* Order Number Card */}
      {orderNumber && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            padding: '16px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <FaCalendarAlt style={{ fontSize: '1.1rem' }} />
              <span style={{ fontWeight: '600' }}>رقم الطلب: </span>
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '700' }}>
                {orderNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={styles.timelineList}>
        {trackingData.map((item, index) => {
          const statusLevel = getStatusLevel(item.statusCode);
          const isLast = index === trackingData.length - 1;
          
          return (
            <div 
              key={index} 
              className={`${styles.timelineItem} ${styles[statusLevel]}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Timeline Marker */}
              <div className={styles.timelineMarker}>
                <div className={styles.timelineIcon}>
                  {getIcon(item.status, item.statusCode)}
                </div>
                {!isLast && <div className={styles.timelineLine}></div>}
              </div>

              {/* Timeline Content */}
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.timelineItemTitle}>{item.status}</h3>
                  <div className={styles.timelineTime}>
                    <FaClock style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
                    {item.statusTime}
                  </div>
                </div>





                {/* Active Indicator */}
                {statusLevel === 'active' && (
                  <div className={styles.activeIndicator}>
                    <div className={styles.pulse}></div>
                    <span>قيد المعالجة</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with helpful info */}
      <div className={styles.timelineFooter}>
        <div className={styles.estimatedTime}>
          <h4>💡 ملاحظة مهمة</h4>
          <p>يتم تحديث حالة الطلب تلقائياً من نظام الشحن</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
