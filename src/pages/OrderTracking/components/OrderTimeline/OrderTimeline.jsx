import React from 'react';
import { FaClock } from 'react-icons/fa';
import styles from './OrderTimeline.module.css';

const OrderTimeline = ({ timeline }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return styles.completed;
      case 'active':
        return styles.active;
      case 'pending':
        return styles.pending;
      default:
        return styles.pending;
    }
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <h3 className={styles.timelineTitle}>
          <FaClock className={styles.timelineIcon} />
          تتبع حالة الطلب
        </h3>
        <p className={styles.timelineSubtitle}>تابع رحلة طلبك من البداية حتى التسليم</p>
      </div>

      <div className={styles.timelineList}>
        {timeline.map((item, index) => (
          <div 
            key={item.id} 
            className={`${styles.timelineItem} ${getStatusClass(item.status)}`}
          >
            <div className={styles.timelineMarker}>
              <div className={styles.timelineIcon}>
                {item.icon}
              </div>
              {index < timeline.length - 1 && (
                <div className={styles.timelineLine}></div>
              )}
            </div>

            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h4 className={styles.timelineItemTitle}>{item.title}</h4>
                <span className={styles.timelineTime}>{item.time}</span>
              </div>
              <p className={styles.timelineDescription}>{item.description}</p>
              
              {item.status === 'active' && (
                <div className={styles.activeIndicator}>
                  <div className={styles.pulse}></div>
                  <span>الحالة الحالية</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.timelineFooter}>
        <div className={styles.estimatedTime}>
          <h4>الوقت المتوقع للتسليم</h4>
          <p>خلال 24-48 ساعة من الآن</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline; 