import React, { useState } from 'react';
import { FaSearch, FaPhone, FaReceipt } from 'react-icons/fa';
import styles from './OrderSearchForm.module.css';

const OrderSearchForm = ({ onSearch }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim() || !phone.trim()) {
      alert('يرجى إدخال رقم الطلب ورقم الهاتف');
      return;
    }

    setIsLoading(true);
    
    // محاكاة تأخير البحث
    setTimeout(() => {
      onSearch(orderId.trim(), phone.trim());
      setIsLoading(false);
    }, 1000);
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

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaPhone className={styles.inputIcon} />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01234567890"
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