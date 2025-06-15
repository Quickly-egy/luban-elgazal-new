import React from 'react';
import { motion } from 'framer-motion';
import FAQSection from '../../components/FAQ/FAQSection';
import { faqData } from '../../constants/faqData';
import '../../components/FAQ/FAQ.css';

const FAQ = () => {

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <motion.section 
        className="faq-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <h1>الأسئلة الشائعة</h1>
          <p>إجابات شاملة على أكثر الأسئلة طرحاً حول منتجاتنا وخدماتنا</p>
        </div>
      </motion.section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          <motion.div
            className="faq-content-inner"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* FAQ Sections */}
            <div className="faq-sections">
              {faqData.map((section, index) => (
                  <FAQSection
                    key={section.id}
                    section={section}
                    index={index}
                  />
              ))}
            </div>


          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 