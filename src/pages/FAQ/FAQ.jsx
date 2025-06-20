import React from 'react';
import FAQSection from '../../components/FAQ/FAQSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../components/FAQ/FAQ.css';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const FAQ = () => {
  
  const getFaq = async () => {
    const response = await api.get('/faqs');
    return response.data.data;
  };

  const { data, isError, isLoading } = useQuery({
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
      <section
        className="faq-hero"
      >
        <div className="container">
          <h1>الأسئلة الشائعة</h1>
          <p>إجابات شاملة على أكثر الأسئلة طرحاً حول منتجاتنا وخدماتنا</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          <div
            className="faq-content-inner"
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 