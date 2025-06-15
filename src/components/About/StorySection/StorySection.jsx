import React from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaGlobe, FaHeart } from 'react-icons/fa';
import styles from './StorySection.module.css';

const StorySection = () => {
  const storyPoints = [
    {
      icon: <FaHistory />,
      title: "تاريخ عريق",
      description: "بدأت رحلتنا منذ عقود في قلب عُمان، حيث ينمو أجود أنواع اللبان في العالم",
      color: "#8b5cf6"
    },
    {
      icon: <FaGlobe />,
      title: "انتشار عالمي",
      description: "نقلنا عبق اللبان العماني الأصيل إلى جميع أنحاء العالم بأعلى معايير الجودة",
      color: "#3b82f6"
    },
    {
      icon: <FaHeart />,
      title: "شغف وإتقان",
      description: "نحن ملتزمون بتقديم منتجات طبيعية 100% تحافظ على التراث العماني الأصيل",
      color: "#ef4444"
    }
  ];

  return (
    <section className={styles.storySection}>
      <div className="container">
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>قصتنا</h2>
          <p className={styles.sectionDescription}>
            رحلة طويلة من الشغف والإتقان في عالم اللبان العماني الأصيل
          </p>
        </motion.div>

        <div className={styles.storyGrid}>
          {storyPoints.map((point, index) => (
            <motion.div
              key={index}
              className={styles.storyCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div 
                className={styles.storyIcon}
                style={{ backgroundColor: point.color }}
              >
                {point.icon}
              </div>
              <h3 className={styles.storyTitle}>{point.title}</h3>
              <p className={styles.storyDescription}>{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.storyContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className={styles.storyText}>
            <h3>رحلة من التراث إلى الحداثة</h3>
            <p>
              في قلب سلطنة عُمان، حيث تنمو أشجار اللبان منذ آلاف السنين، بدأت قصتنا. 
              نحن في لبان الغزال نؤمن بأن اللبان العماني ليس مجرد منتج، بل هو تراث حضاري 
              يحمل في طياته عبق التاريخ وأسرار الطبيعة.
            </p>
            <p>
              منذ تأسيسنا، التزمنا بأعلى معايير الجودة في انتقاء وتجهيز اللبان، 
              مع الحفاظ على طرق الإنتاج التقليدية التي توارثناها عبر الأجيال. 
              هدفنا هو نقل هذا الكنز الطبيعي إلى العالم بأجمل صورة ممكنة.
            </p>
          </div>
          <div className={styles.storyImage}>
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="اللبان العماني الأصيل" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection; 