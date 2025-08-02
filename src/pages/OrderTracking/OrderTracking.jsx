import React, { useEffect, useState } from 'react';
import OrderSearchForm from './components/OrderSearchForm/OrderSearchForm';
import OrderDetails from './components/OrderDetails/OrderDetails';
import OrderTimeline from './components/OrderTimeline/OrderTimeline';
import OrderItems from './components/OrderItems/OrderItems';
import DeliveryInfo from './components/DeliveryInfo/DeliveryInfo';
import styles from './OrderTracking.module.css';

const OrderTracking = () => {
  const [orderData, setOrderData] = useState(null);
  const [searchedOrderId, setSearchedOrderId] = useState('');
// بعد ما تجيب البيانات من الـ API
useEffect(() => {
  if (orderData) {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }
}, [orderData]);
useEffect(() => {
  const storedData = localStorage.getItem("orderData");
  if (storedData) {
    setOrderData(JSON.parse(storedData));
  }
}, []);


  const handleOrderSearch = (orderId, phone) => {
    setSearchedOrderId(orderId);
    // The actual API call is now handled in OrderSearchForm component
    // This function is mainly for backward compatibility and state management
  };

  return (
    <div className={styles.orderTrackingPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>تتبع طلبك</h1>
          <p className={styles.subtitle}>ادخل رقم الطلب ورقم الهاتف لتتبع حالة طلبك</p>
        </div>

        <OrderSearchForm onSearch={handleOrderSearch} setOrderData={setOrderData} />

        {searchedOrderId && !orderData && (
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>❌</div>
            <h3>لا يمكن العثور على الطلب</h3>
            <p>تأكد من رقم الطلب المدخل أو تواصل مع خدمة العملاء للمساعدة</p>
          </div>
        )}

        {orderData && (
          <div className={styles.orderContent}>
            <OrderTimeline orderHistory={orderData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 