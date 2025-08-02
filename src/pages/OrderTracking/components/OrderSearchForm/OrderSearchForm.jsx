import React, { useState, useEffect } from 'react';
import { FaSearch, FaPhone, FaReceipt } from 'react-icons/fa';
import { contactAPI } from '../../../../services/endpoints';
import styles from './OrderSearchForm.module.css';

const OrderSearchForm = ({ onSearch,setOrderData }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState(null);

  // جلب بيانات التواصل من API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const result = await contactAPI.getContactData();
        if (result.success) {
          setContactData(result.data);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };

    fetchContactData();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  // استخدام الـ production URL مباشرة
  const API_BASE_URL = "https://app.quickly.codes/luban-elgazal/public";

  if (!orderId.trim()) {
    alert('يرجى إدخال رقم الطلب');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        order_number: orderId.trim()
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === 200) {
      // Success - API returned tracking data
      const trackingInfo = {
        order_number: orderId,
        tracking_history: data.data || [],
        request_id: data.request_id,
        message: data.message
      };
      
      setOrderData(trackingInfo);
      localStorage.setItem("orderData", JSON.stringify(trackingInfo));
      
      if (onSearch) {
        onSearch(orderId, phone);
      }
    } else {
      // Handle API errors
      const errorMessage = data.message || "لا يمكن العثور على الطلب";
      alert(errorMessage);
      
      // Clear any previous data
      setOrderData(null);
      localStorage.removeItem("orderData");
    }

  } catch (error) {
    console.error('Tracking API Error:', error);
    
    // Try to load cached data as fallback
    const cached = localStorage.getItem("orderData");
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setOrderData(cachedData);
        alert("تم تحميل آخر بيانات محفوظة (غير متصل)");
      } catch (parseError) {
        console.error('Error parsing cached data:', parseError);
        localStorage.removeItem("orderData");
        alert("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى");
      }
    } else {
      alert("حدث خطأ في الاتصال. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.searchFormContainer}>
      <div className={styles.searchCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <FaSearch />
          </div>
          <h3 className={styles.cardTitle}>البحث عن طلبك</h3>
          <p className={styles.cardSubtitle}>ادخل البيانات المطلوبة لتتبع طلبك</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaReceipt className={styles.inputIcon} />
                رقم الطلب
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="مثال: ORD-2024-001 أو 123456"
                className={styles.input}
                disabled={isLoading}
              />
            </div>

          </div>

          <button 
            type="submit" 
            className={`${styles.searchButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                جاري البحث...
              </>
            ) : (
              <>
                <FaSearch />
                تتبع الطلب
              </>
            )}
          </button>
        </form>

        <div className={styles.helpText}>
          <p>💡 <strong>نصيحة:</strong> يمكنك العثور على رقم طلبك في رسالة التأكيد المرسلة إليك</p>
          <p>
            📞 تواصل معنا على{' '}
            <a 
              href={`tel:${contactData?.phone || '19123'}`} 
              style={{
                color: '#009970',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: '1px solid #009970'
              }}
            >
              {contactData?.phone || '19123'}
            </a>
            {' '}للمساعدة
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSearchForm; 