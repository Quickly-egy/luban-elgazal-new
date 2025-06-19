import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import styles from './OrderItems.module.css';
import { useCurrency } from '../../../../hooks';

const OrderItems = ({ items }) => {
  const { formatPrice } = useCurrency();

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  return (
    <div className={styles.orderItemsContainer}>
      <div className={styles.itemsHeader}>
        <h3 className={styles.itemsTitle}>
          <FaShoppingBag className={styles.itemsIcon} />
          منتجات الطلب ({items.length} منتج)
        </h3>
      </div>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.itemImage}>
              <img src={item.image} alt={item.name} />
            </div>

            <div className={styles.itemDetails}>
              <h4 className={styles.itemName}>{item.name}</h4>

              <div className={styles.itemMeta}>
                <div className={styles.quantity}>
                  <span className={styles.quantityLabel}>الكمية:</span>
                  <span className={styles.quantityValue}>{item.quantity}</span>
                </div>

                <div className={styles.price}>
                  <span className={styles.priceLabel}>سعر الوحدة:</span>
                  <span className={styles.priceValue}>{formatPrice(item.price)}</span>
                </div>
              </div>

              <div className={styles.itemTotal}>
                <span className={styles.totalLabel}>الإجمالي:</span>
                <span className={styles.totalValue}>{formatPrice(item.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>مجموع المنتجات:</span>
          <span className={styles.summaryValue}>{formatPrice(getTotalPrice())}</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>رسوم الشحن:</span>
          <span className={styles.summaryValue}>مجاني 🎉</span>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span className={styles.summaryLabel}>الإجمالي النهائي:</span>
          <span className={styles.summaryValue}>{formatPrice(getTotalPrice())}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems; 