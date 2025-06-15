import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import FAQSection from '../../components/FAQ/FAQSection';
import FAQSearch from '../../components/FAQ/FAQSearch';
import { faqData } from '../../constants/faqData';
import '../../components/FAQ/FAQ.css';

const FAQ = () => {
  const [filteredData, setFilteredData] = useState(faqData);

  // Calculate total items count
  const totalItems = useMemo(() => {
    return faqData.reduce((total, section) => total + section.items.length, 0);
  }, []);

  // Filter function for search
  const handleFilter = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredData(faqData);
      return totalItems;
    }

    const filtered = faqData.map(section => {
      const filteredItems = section.items.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);

    setFilteredData(filtered);
    return filtered.reduce((total, section) => total + section.items.length, 0);
  }, [totalItems]);

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
            {/* Search Component */}
            <FAQSearch onFilter={handleFilter} totalItems={totalItems} />

            {/* FAQ Sections */}
            <div className="faq-sections">
              {filteredData.length > 0 ? (
                filteredData.map((section, index) => (
                  <FAQSection
                    key={section.id}
                    section={section}
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  className="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="no-results-container">
                    <i className="fas fa-search no-results-icon"></i>
                    <h3 className="no-results-title">
                      لم يتم العثور على نتائج
                    </h3>
                    <p className="no-results-text">
                      لم نتمكن من العثور على أسئلة تطابق بحثك. جرب استخدام كلمات مفتاحية مختلفة.
                    </p>
                    <div className="no-results-suggestions">
                      <p>جرب البحث عن:</p>
                      <div className="suggestion-tags">
                        {['دعم فني', 'منتجات', 'ضمان', 'طلب'].map((suggestion) => (
                          <span key={suggestion} className="suggestion-tag">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>


          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 