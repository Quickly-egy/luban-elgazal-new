import React from 'react';
import styles from './PromoBanners.module.css';

const PromoBanners = () => {
  return (
    <section className={styles.promoBannersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>عروض حصرية</h2>
      </div>
      <div className={styles.bannersContainer}>
        <div className={styles.banner}>
          <div className={styles.imagePlaceholder}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <div className={styles.banner}>
          <div className={styles.imagePlaceholder}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners; 