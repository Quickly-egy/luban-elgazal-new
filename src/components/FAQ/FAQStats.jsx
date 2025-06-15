import React from 'react';
import { motion } from 'framer-motion';

const FAQStats = ({ data }) => {
  const stats = [
    {
      id: 'total-questions',
      icon: 'fas fa-question-circle',
      value: data.reduce((total, section) => total + section.items.length, 0),
      label: 'إجمالي الأسئلة',
      color: 'text-blue-600'
    },
    {
      id: 'categories',
      icon: 'fas fa-layer-group',
      value: data.length,
      label: 'الفئات المتاحة',
      color: 'text-green-600'
    },
    {
      id: 'response-time',
      icon: 'fas fa-clock',
      value: '< 1',
      label: 'ساعة متوسط الرد',
      color: 'text-purple-600'
    },
    {
      id: 'satisfaction',
      icon: 'fas fa-thumbs-up',
      value: '95%',
      label: 'معدل الرضا',
      color: 'text-orange-600'
    }
  ];

  return (
    <motion.section
      className="faq-stats"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>إحصائيات مفيدة</h2>
          <p>أرقام تعكس التزامنا بتقديم أفضل خدمة دعم لعملائنا</p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <div className={`stat-icon ${stat.color === 'text-blue-600' ? 'blue' : stat.color === 'text-green-600' ? 'green' : stat.color === 'text-purple-600' ? 'purple' : 'orange'}`}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-value">
                {stat.value}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQStats; 
 