import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaShieldAlt, FaHandshake, FaStar, FaGem, FaHeart } from 'react-icons/fa';
import styles from './ValuesSection.module.css';

const ValuesSection = () => {
  const values = [
    {
      icon: <FaLeaf />,
      title: "طبيعي 100%",
      description: "جميع منتجاتنا طبيعية خالية من المواد الكيميائية والإضافات الصناعية",
      color: "#22c55e"
    },
    {
      icon: <FaShieldAlt />,
      title: "جودة مضمونة",
      description: "نلتزم بأعلى معايير الجودة العالمية في جميع مراحل الإنتاج والتجهيز",
      color: "#3b82f6"
    },
    {
      icon: <FaHandshake />,
      title: "ثقة العملاء",
      description: "نبني علاقات طويلة الأمد مع عملائنا قائمة على الثقة والشفافية",
      color: "#f59e0b"
    },
    {
      icon: <FaStar />,
      title: "تميز في الخدمة",
      description: "نقدم خدمة عملاء متميزة ودعم فني على مدار الساعة",
      color: "#8b5cf6"
    },
    {
      icon: <FaGem />,
      title: "منتجات فاخرة",
      description: "نختار أجود أنواع اللبان العماني لنقدم لكم منتجات فاخرة ومميزة",
      color: "#ef4444"
    },
    {
      icon: <FaHeart />,
      title: "شغف وحب",
      description: "نعمل بشغف وحب لنقل تراث اللبان العماني الأصيل إلى العالم",
      color: "#ec4899"
    }
  ];

  return (
    <section className={styles.valuesSection}>
      <div className="container">
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>قيمنا ومبادئنا</h2>
          <p className={styles.sectionDescription}>
            المبادئ التي نؤمن بها والقيم التي توجه عملنا في كل يوم
          </p>
        </motion.div>

        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <motion.div
              key={index}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div 
                className={styles.valueIcon}
                style={{ backgroundColor: value.color }}
              >
                {value.icon}
              </div>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
              <div 
                className={styles.valueAccent}
                style={{ backgroundColor: value.color }}
              ></div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.valuesQuote}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <blockquote>
            "نحن لا نبيع مجرد منتجات، بل نقدم تجربة فريدة تحمل في طياتها عبق التاريخ وأصالة التراث العماني"
          </blockquote>
          <cite>- فريق لبان الغزال</cite>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection; 