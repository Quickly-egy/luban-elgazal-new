import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './SuccessModal.module.css';

const SuccessModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <FaCheckCircle className={styles.successIcon} />
          <h2>تم إنشاء الطلب بنجاح!</h2>
          <p>رقم الطلب: {orderDetails.order_number}</p>
          
          <div className={styles.orderInfo}>
            <div className={styles.infoRow}>
              <span>المبلغ الإجمالي:</span>
              <span>{orderDetails.final_amount} ريال</span>
            </div>
            <div className={styles.infoRow}>
              <span>طريقة الدفع:</span>
              <span>{orderDetails.payment_method === 'cash' ? 'الدفع عند الاستلام' : orderDetails.payment_method}</span>
            </div>
            <div className={styles.infoRow}>
              <span>حالة الطلب:</span>
              <span className={styles.status}>{orderDetails.status === 'pending' ? 'قيد المعالجة' : orderDetails.status}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={() => window.location.href = '/order/' + orderDetails.id} className={styles.trackButton}>
              تتبع الطلب
            </button>
            <button onClick={onClose} className={styles.closeButton}>
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 