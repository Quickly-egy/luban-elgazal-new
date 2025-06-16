import React from 'react';
import { motion } from 'framer-motion';
import FAQSection from '../../components/FAQ/FAQSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../components/FAQ/FAQ.css';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const FAQ = () => {
  const getFaq = async () => {
    try {
      const response = await api.get('/faq-categories?include_empty=true');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['faq'],
    queryFn: getFaq
  });

  if (isLoading) {
    return (
      <div className="faq-page">
        <div className="container">
          <LoadingSpinner message="جاري تحميل الأسئلة الشائعة..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="faq-page">
        <div className="container">
          <ErrorMessage 
            title="عذراً، حدث خطأ"
            message="لم نتمكن من تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى لاحقاً."
          />
        </div>
      </div>
    );
  }

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
              {data && data.length > 0 ? (
                data.map((section, index) => (
                  <FAQSection
                    key={section.id}
                    section={section}
                    index={index}
                  />
                ))
              ) : (
                <div className="no-faqs">
                  <p>لا توجد أسئلة شائعة متاحة حالياً</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 