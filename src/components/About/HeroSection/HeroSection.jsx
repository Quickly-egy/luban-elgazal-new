import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.heroIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaLeaf />
          </motion.div>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            🌿 من نحن - لبان الغزال
          </motion.h1>
          <motion.p 
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            اكتشف أحدث المقالات والأخبار في عالم التكنولوجيا وريادة الأعمال والتطوير المهني
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection; 