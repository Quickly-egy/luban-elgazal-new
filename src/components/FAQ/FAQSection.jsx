import React from 'react';
import { motion } from 'framer-motion';
import FAQItem from './FAQItem';

const FAQSection = ({ section, index }) => {
  return (
    <motion.div
      className="faq-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-row">
          <h2 className="section-title">
            {section.title}
          </h2>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="faq-items">
        {section.items.map((item, itemIndex) => (
          <FAQItem
            key={item.id}
            item={item}
            index={itemIndex}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FAQSection; 