import React, { useState, useEffect, useRef } from 'react';
import styles from './StatisticsSection.module.css';

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});
  const sectionRef = useRef(null);

  const statistics = [
    {
      id: 1,
      value: 25000,
      suffix: '+',
      title: 'عميل سعيد',
      subtitle: 'ثقة عملائنا هي أساس نجاحنا',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
        </svg>
      ),
      color: '#4CAF50'
    },
    {
      id: 2,
      value: 25,
      suffix: ' سنة',
      title: 'خبرة',
      subtitle: 'ربع قرن من الجودة والأصالة',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      ),
      color: '#FF9800'
    },
    {
      id: 3,
      value: 500,
      suffix: '+',
      title: 'منتج أصيل',
      subtitle: 'تشكيلة واسعة من أجود المنتجات',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
          <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="currentColor"/>
        </svg>
      ),
      color: '#2196F3'
    },
    {
      id: 4,
      value: 98,
      suffix: '%',
      title: 'رضا العملاء',
      subtitle: 'تقييمات إيجابية من عملائنا',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      ),
      color: '#9C27B0'
    }
  ];

  // Animation function for counting numbers
  const animateValue = (start, end, duration, callback) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      callback(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animate each statistic
          statistics.forEach((stat) => {
            animateValue(0, stat.value, 2000, (value) => {
              setAnimatedValues(prev => ({
                ...prev,
                [stat.id]: value
              }));
            });
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section className={styles.statisticsSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>أرقام تتحدث عن نفسها</h2>
          <p className={styles.subtitle}>إنجازاتنا وثقة عملائنا هي مصدر فخرنا واستمرارنا</p>
        </div>
        
        <div className={styles.statisticsGrid}>
          {statistics.map((stat) => (
            <div 
              key={stat.id} 
              className={`${styles.statisticCard} ${isVisible ? styles.animated : ''}`}
              style={{ animationDelay: `${stat.id * 0.2}s` }}
            >
              <div className={styles.cardContent}>
                <div 
                  className={styles.iconContainer}
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                
                <div className={styles.statisticInfo}>
                  <div className={styles.statisticValue}>
                    <span className={styles.number}>
                      {animatedValues[stat.id] || 0}
                    </span>
                    <span className={styles.suffix}>{stat.suffix}</span>
                  </div>
                  
                  <h3 className={styles.statisticTitle}>{stat.title}</h3>
                  <p className={styles.statisticSubtitle}>{stat.subtitle}</p>
                </div>
              </div>
              
              <div className={styles.cardGlow} style={{ backgroundColor: stat.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection; 