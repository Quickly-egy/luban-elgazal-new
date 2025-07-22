import React, { useState } from 'react';
import { FaSearch, FaPhone, FaReceipt } from 'react-icons/fa';
import styles from './OrderSearchForm.module.css';

const OrderSearchForm = ({ onSearch,setOrderData }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);



const handleSubmit = async (e) => {
  e.preventDefault();

  const BASE_URL = import.meta.env.VITE_API_BASE + "/v2";
  const token = "FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1";

  if (!orderId.trim()) {
    alert('يرجى إدخال رقم الطلب ');
    return;
  }

  setIsLoading(true); // ✅ فعل التحميل قبل الطلب

  try {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/track`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error("فشل في جلب بيانات التتبع");
    }

    const data = await res.json();
    setOrderData(data.data);
    localStorage.setItem("orderData", JSON.stringify(data.data)); // ✅ أصلح الخطأ هنا (كنت بتخزن res.data بدال data.data)

  } catch (error) {
    const cached = localStorage.getItem("orderData");
    if (cached) {
      setOrderData(JSON.parse(cached));
    }
  } finally {
    setIsLoading(false); // ✅ أوقف التحميل بعد الانتهاء سواء نجح أو فشل
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
          <p>📞 تواصل معنا على <strong>19123</strong> للمساعدة</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSearchForm; 