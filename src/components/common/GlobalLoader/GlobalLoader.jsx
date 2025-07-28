import React from 'react';
import styles from './GlobalLoader.module.css';

const GlobalLoader = ({ fadeOut = false }) => {
  return (
    <div className={`${styles.loaderContainer} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.loaderOverlay}>
        {/* Background Stars */}
        <div className={styles.stars}>
          {Array.from({ length: 50 }, (_, i) => (
            <div 
              key={i} 
              className={styles.star} 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className={styles.loaderContent}>
          {/* شعار الموقع */}
          <div className={styles.logoContainer}>
            <img 
              src="/logo.webp" 
              alt="لبان الغزال" 
              className={styles.logo}
            />
          </div>
          
          {/* الـ loader الرئيسي */}
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
            </div>
          </div>
          
          {/* النص */}
          <div className={styles.loadingText}>
            <h2 className={styles.mainText}>جارٍ تحميل الموقع</h2>
            <p className={styles.subText}>يرجى الانتظار قليلاً...</p>
          </div>
          
          {/* شريط التقدم */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          
          {/* النقاط المتحركة */}
          <div className={styles.dots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader; 