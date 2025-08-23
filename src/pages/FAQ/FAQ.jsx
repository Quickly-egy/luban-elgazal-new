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
          return;
        }
      }

      // إذا لم توجد بيانات محفوظة أو انتهت صلاحيتها، جلب من API
      const response = await api.get('/faqs');
      const apiData = response.data.data;
      
      // حفظ البيانات في localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(apiData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      setData(apiData);
      setIsError(false);
      
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      setIsError(true);
      
      // في حالة فشل API، محاولة استخدام البيانات المحفوظة حتى لو انتهت صلاحيتها
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
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
    <div>
      hello baby
    </div>
  )
}

export default FAQ
