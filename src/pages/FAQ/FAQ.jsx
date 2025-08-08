// Custom Hook: useFAQCache.js
import { useState, useEffect } from 'react';
import api from '../../services/api';

const useFAQCache = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const CACHE_KEY = 'faq_data';
  const CACHE_TIMESTAMP_KEY = 'faq_data_timestamp';
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 ساعة

  const loadData = async () => {
    try {
      // أولاً: محاولة جلب البيانات من localStorage
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cacheTimestamp) {
        const now = Date.now();
        const cacheAge = now - parseInt(cacheTimestamp);
        
        if (cacheAge < CACHE_EXPIRY) {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
          setIsLoading(false);
          console.log('Data loaded from localStorage');
          return;
        }
      }

      // إذا لم توجد بيانات محفوظة أو انتهت صلاحيتها، جلب من API
      console.log('Loading data from API...');
      const response = await api.get('/faqs');
      const apiData = response.data.data;
      
      // حفظ البيانات في localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(apiData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      setData(apiData);
      setIsError(false);
      console.log('Data loaded from API and cached');
      
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      setIsError(true);
      
      // في حالة فشل API، محاولة استخدام البيانات المحفوظة حتى لو انتهت صلاحيتها
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
          console.log('Using expired cache due to API error');
        } catch (parseError) {
          console.error('Error parsing cached data:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    setData(null);
  };

  const refreshData = async () => {
    setIsLoading(true);
    clearCache();
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    isError,
    clearCache,
    refreshData
  };
};

// FAQ Component المحدث
import React from 'react';
import FAQSection from '../../components/FAQ/FAQSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../components/FAQ/FAQ.css';

const FAQ = () => {
  const { data, isLoading, isError, refreshData } = useFAQCache();

  console.log('FAQ Data:', data);

  if (isLoading) {
    return (
      <div className="faq-page">
        <div className="container">
          <LoadingSpinner message="جاري تحميل الأسئلة الشائعة..." />
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="faq-page">
        <div className="container">
          <ErrorMessage
            title="عذراً، حدث خطأ"
            message="لم نتمكن من تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى لاحقاً."
            onRetry={refreshData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <h1>الأسئلة الشائعة</h1>
          <p>إجابات شاملة على أكثر الأسئلة طرحاً حول منتجاتنا وخدماتنا</p>
          
          {/* إضافة زر refresh اختياري */}
          <button 
            onClick={refreshData}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            تحديث البيانات
          </button>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          <div className="faq-content-inner">
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