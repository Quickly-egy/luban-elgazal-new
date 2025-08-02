import React from 'react';
import styles from './HistoryJourney.module.css';

const HistoryJourney = () => {
  const milestones = [
    {
      id: 1,
      title: "عصر التجارة المزدهرة",
      description: "أصبح لبان الغزال مركزاً تجارياً حيوياً",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "النهضة الحديثة والحفاظ على التراث",
      description: "يعتبر موقع لبان الغزال رمزاً للتراث العماني",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <section className={styles.historyJourney}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>قصتنا</span>
            </div>
            
            <h2 className={styles.title}>رحلة عبر التاريخ</h2>
            
            <p className={styles.description}>
              منذ أكثر من 25 عاماً، نحن نقدم أجود أنواع اللبان العماني الأصيل. رحلة بدأت من قلب 
              عُمان لتصل إلى كل بيت يبحث عن الجودة والأصالة.
            </p>
            
            <div className={styles.milestones}>
              {milestones.map((milestone) => (
                <div key={milestone.id} className={styles.milestone}>
                  <div className={styles.milestoneIcon}>
                    {milestone.icon}
                  </div>
                  <div className={styles.milestoneContent}>
                    <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                    <p className={styles.milestoneDescription}>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <div className={styles.logoPlaceholder}>
                <div className={styles.logoContent}>
                  <div className={styles.logoText}>لبان الغزال</div>
                  <div className={styles.logoSubtext}>LBAN ALGHAZAL</div>
                  <div className={styles.treeIcon}>
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 90C50 90 20 70 20 45C20 30 35 20 50 20C65 20 80 30 80 45C80 70 50 90 50 90Z" fill="#8B4513" opacity="0.6"/>
                      <path d="M45 20C45 20 30 10 30 5C30 2 35 0 45 0C55 0 60 2 60 5C60 10 45 20 45 20Z" fill="#228B22"/>
                      <path d="M55 25C55 25 70 15 70 10C70 7 65 5 55 5C45 5 40 7 40 10C40 15 55 25 55 25Z" fill="#228B22"/>
                      <circle cx="30" cy="45" r="8" fill="#32CD32" opacity="0.7"/>
                      <circle cx="70" cy="40" r="6" fill="#32CD32" opacity="0.5"/>
                      <circle cx="50" cy="35" r="4" fill="#90EE90" opacity="0.8"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={styles.decorativeElements}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.leaf1}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 8C8 10 5.9 16.17 3 16.17C2.06 16.17 1.5 15.5 1.5 14.5C1.5 13.5 2.06 12.83 3 12.83C5.9 12.83 8 6.67 17 8Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HistoryJourney);