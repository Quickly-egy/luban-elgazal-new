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
const clearOrderData = () => {
  localStorage.removeItem("orderData");
  setOrderData(null); // لو حابب تمسحها من الـ state كمان
};

  // بيانات تجريبية للطلب
  const sampleOrderData = {
    orderId: 'ORD-2024-001',
    orderDate: '2024-01-15',
    customerName: 'أحمد محمد',
    phone: '01234567890',
    email: 'ahmed@example.com',
    status: 'in_transit',
    totalAmount: 1250,
    paymentMethod: 'cash_on_delivery',
    currentStatus: {
      title: 'قيد التوصيل',
      description: 'طلبك في الطريق إليك',
      icon: '🚚',
      color: '#2196F3'
    },
    timeline: [
      {
        id: 1,
        title: 'تم تأكيد الطلب',
        description: 'تم استلام طلبك وتأكيده',
        time: '2024-01-15 10:30 AM',
        status: 'completed',
        icon: '✅'
      },
      {
        id: 2,
        title: 'جاري التحضير',
        description: 'يتم تحضير طلبك في المستودع',
        time: '2024-01-15 02:15 PM',
        status: 'completed',
        icon: '📦'
      },
      {
        id: 3,
        title: 'تم الشحن',
        description: 'تم شحن طلبك وهو في الطريق',
        time: '2024-01-16 09:00 AM',
        status: 'active',
        icon: '🚚'
      },
      {
        id: 4,
        title: 'قيد التوصيل',
        description: 'طلبك مع المندوب وسيصلك قريباً',
        time: 'متوقع اليوم',
        status: 'active',
        icon: '🏃‍♂️'
      },
      {
        id: 5,
        title: 'تم التسليم',
        description: 'تم تسليم طلبك بنجاح',
        time: 'لم يتم بعد',
        status: 'pending',
        icon: '🎉'
      }
    ],
    items: [
      {
        id: 1,
        name: 'لبان جودري درجة أولى',
        image: '/images/hair-care-product.jpg',
        quantity: 2,
        price: 500,
        total: 1000
      },
      {
        id: 2,
        name: 'زيت اللبان الطبيعي',
        image: '/images/hair-care-product.jpg',
        quantity: 1,
        price: 250,
        total: 250
      }
    ],
    delivery: {
      address: 'شارع النصر، المعادي، القاهرة',
      estimatedDate: '2024-01-17',
      deliveryTime: '10:00 AM - 12:00 PM',
      courierName: 'محمد علي',
      courierPhone: '01987654321',
      trackingNumber: 'TRK123456789'
    }
  };

  const handleOrderSearch = (orderId, phone) => {
    setSearchedOrderId(orderId);
    // محاكاة البحث عن الطلب
    if (orderId === 'ORD-2024-001' || orderId === '123456') {
      setOrderData(sampleOrderData);
    } else {
      setOrderData(null);
    }
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
            <p>تأكد من رقم الطلب ورقم الهاتف المدخل</p>
          </div>
        )}

        {orderData && (
          // <div className={styles.orderContent}>
          //   {/* <OrderDetails orderData={orderData} /> */}
          //   <div className={styles.orderBody}>
          //     <div className={styles.leftColumn}>
          //       <OrderTimeline timeline={orderData.timeline} />
          //       <OrderItems items={orderData.items} />
          //     </div>
          //     <div className={styles.rightColumn}>
          //       <DeliveryInfo delivery={orderData.delivery} />
          //     </div>
          //   </div>
          // </div>
      <>
      
     <button onClick={()=>clearOrderData()}
     className={styles.RemoveBtn}>
  
    مسح بيانات الطلب
 
</button>
      
      <OrderTimeline orderHistory={orderData} />

      </>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 