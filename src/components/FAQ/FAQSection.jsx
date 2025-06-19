import React from 'react';
import { motion } from 'framer-motion';
import FAQItem from './FAQItem';

const FAQSection = ({ section, index }) => {
  // Function to get icon based on section name
  const getSectionIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('general') || lowerName.includes('عام')) {
      return '❓';
    } else if (lowerName.includes('product') || lowerName.includes('منتج')) {
      return '📦';
    } else if (lowerName.includes('shipping') || lowerName.includes('شحن')) {
      return '🚚';
    } else if (lowerName.includes('payment') || lowerName.includes('دفع')) {
      return '💳';
    } else if (lowerName.includes('return') || lowerName.includes('إرجاع')) {
      return '↩️';
    } else if (lowerName.includes('account') || lowerName.includes('حساب')) {
      return '👤';
    }
    return '📋'; // Default icon
  };

  return (
    <motion.div
      className="faq-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-row">
          <div className="section-icon">
            {getSectionIcon(section.name)}
          </div>
          <h2 className="section-title">
            {section.name}
          </h2>
        </div>
        {section.faqs && section.faqs.length > 0 && (
          <div className="section-description">
            {section.faqs.length} سؤال متاح
          </div>
        )}
      </div>

      {/* FAQ Items */}
      <div className="faq-items">
        {(section.faqs || []).map((item, itemIndex) => (
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