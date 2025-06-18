import React from 'react';
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaCreditCard, FaReceipt } from 'react-icons/fa';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ orderData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG').format(price);
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cash_on_delivery: 'دفع عند الاستلام',
      credit_card: 'بطاقة ائتمان',
      bank_transfer: 'تحويل بنكي',
      wallet: 'محفظة إلكترونية'
    };
    return methods[method] || method;
  };

  return (
    <div className={styles.orderDetailsContainer}>
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <div 
            className={styles.statusIcon}
            style={{ background: `${orderData.currentStatus.color}15`, color: orderData.currentStatus.color }}
          >
            {orderData.currentStatus.icon}
          </div>
          <div className={styles.statusText}>
            <h2 className={styles.statusTitle}>{orderData.currentStatus.title}</h2>
            <p className={styles.statusDescription}>{orderData.currentStatus.description}</p>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailsCard}>
          <h3 className={styles.cardTitle}>
            <FaReceipt className={styles.cardIcon} />
            معلومات الطلب
          </h3>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>رقم الطلب:</span>
              <span className={styles.detailValue}>{orderData.orderId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                <FaCalendarAlt className={styles.detailIcon} />
                تاريخ الطلب:
              </span>
              <span className={styles.detailValue}>{formatDate(orderData.orderDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>إجمالي المبلغ:</span>
              <span className={`${styles.detailValue} ${styles.priceValue}`}>
                {formatPrice(orderData.totalAmount)} جنيه
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                <FaCreditCard className={styles.detailIcon} />
                طريقة الدفع:
              </span>
              <span className={styles.detailValue}>{getPaymentMethodText(orderData.paymentMethod)}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsCard}>
          <h3 className={styles.cardTitle}>
            <FaUser className={styles.cardIcon} />
            معلومات العميل
          </h3>
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>الاسم:</span>
              <span className={styles.detailValue}>{orderData.customerName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                <FaPhone className={styles.detailIcon} />
                رقم الهاتف:
              </span>
              <span className={styles.detailValue}>{orderData.phone}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                <FaEnvelope className={styles.detailIcon} />
                البريد الإلكتروني:
              </span>
              <span className={styles.detailValue}>{orderData.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 