import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import useOrderStore from "../../stores/orderStore";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaArrowRight,
  FaBox,
  FaGift,
} from "react-icons/fa";
import styles from "./OrderSuccess.module.css";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useCurrencyContext } from "../../contexts/CurrencyContext";
import useCurrency from "../../hooks/useCurrency";
const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // استخدام نظام العملة الديناميكي
  const { formatPrice, currencyInfo } = useCurrency();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const payment_id = searchParams.get("payment_id");
    const { lastOrderDetails } = useOrderStore.getState();
    
    if (payment_id) {
      // في حالة الدفع بتابي، نستخدم API لتحديث حالة الدفع
      updatePaymentStatus(payment_id);
    } else if (lastOrderDetails) {
      // استخدام البيانات من المخزن
      const orderData = {
        order_number: lastOrderDetails.order.order_number,
        total_amount: parseFloat(lastOrderDetails.order.total_amount),
        shipping_cost: parseFloat(lastOrderDetails.order.shipping_cost),
        fees: parseFloat(lastOrderDetails.order.fees),
        final_amount: parseFloat(lastOrderDetails.order.final_amount),
        client: {
          name: `${lastOrderDetails.client.first_name} ${lastOrderDetails.client.last_name}`,
          email: lastOrderDetails.client.email,
          phone: lastOrderDetails.client.phone
        },
        address: lastOrderDetails.order.client_address,
        products: lastOrderDetails.order.order_items.map(item => ({
          product_id: item.product_id,
          product_name: item.product?.name || `منتج #${item.product_id}`,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price)
        })),
        packages: lastOrderDetails.order.order_packages.map(pkg => ({
          package_id: pkg.package_id,
          package_name: pkg.package?.name || `باقة #${pkg.package_id}`,
          quantity: parseInt(pkg.quantity),
          unit_price: parseFloat(pkg.unit_price)
        })),
        payment_method: lastOrderDetails.order.payment_method,
        created_at: lastOrderDetails.order.created_at
      };
      
      setOrderDetails(orderData);
      setIsLoading(false);
    } else {
      // في حالة عدم وجود بيانات الطلب
      console.warn('No order details found in store');
      // إعادة توجيه تلقائية للصفحة الرئيسية بعد 3 ثوان
      setTimeout(() => {
        navigate('/');
      }, 3000);
      setIsLoading(false);
    }
  }, []);

  const updatePaymentStatus = async (payment_id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer 180|EbwkXtG5IvEjnmIat7Ts0cTiy84k92ce5sTZpDzsa524205d"
      );

      const raw = JSON.stringify({
        tabby_payment_id: payment_id,
        status: "success",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://app.quickly.codes/luban-elgazal/public/api/orders/tabby/update-status",
        requestOptions
      );
      const result = await response.json();

      if (result.success) {
        setOrderDetails(result.data.order);
        // حفظ بيانات الطلب في localStorage للاستخدام المستقبلي
        localStorage.setItem('last_order_details', JSON.stringify(result.data.order));
        localStorage.setItem('last_order_timestamp', Date.now().toString());
      } else {
        console.error('Failed to fetch order details:', result.message);
        // إعادة توجيه تلقائية للصفحة الرئيسية بعد 3 ثوان
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      // إعادة توجيه تلقائية للصفحة الرئيسية بعد 3 ثوان
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري تأكيد الطلب...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className={styles.errorContainer}>
        <p>حدث خطأ في تحميل بيانات الطلب</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          سيتم إعادة توجيهك للصفحة الرئيسية تلقائياً خلال 3 ثوانٍ...
        </p>
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          العودة للرئيسية الآن
        </button>
      </div>
    );
  }
  


  return (
    <div className={styles.successPage}>
          <div className="">
            <PDFDownloadLink
              document={<InvoicePDF order={orderDetails} />}
              fileName={`فاتورة_${orderDetails.client.name}.pdf`}
              className={styles.downloadButton}
            >
              {({ loading }) =>
                loading ? "جاري تجهيز الفاتورة..." : "تحميل الفاتورة PDF"
              }
            </PDFDownloadLink>
          </div>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.header}>
            <FaCheckCircle className={styles.successIcon} />
            <h1>تم تأكيد طلبك بنجاح!</h1>
            <p className={styles.orderNumber}>
              رقم الطلب: {orderDetails.order_number}
            </p>
            <p className={styles.orderDate}>
              تاريخ الطلب: {formatDate(orderDetails.created_at)}
            </p>
          </div>
        

          <div className={styles.clientInfo}>
            <h3>معلومات العميل</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>الاسم:</span>
                <span>{orderDetails.client.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span>البريد الإلكتروني:</span>
                <span>{orderDetails.client.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span>رقم الهاتف:</span>
                <span>{orderDetails.client.phone}</span>
              </div>
            </div>
          </div>

          <div className={styles.addressInfo}>
            <h3>عنوان التوصيل</h3>
            <div className={styles.address}>
              {orderDetails.address.address_line1 && (
                <p>العنوان: {orderDetails.address.address_line1}</p>
              )}
              {orderDetails.address.address_line2 && (
                <p>تفاصيل إضافية: {orderDetails.address.address_line2}</p>
              )}
              {orderDetails.address.city && (
                <p>المدينة: {orderDetails.address.city}</p>
              )}
              {orderDetails.address.state && (
                <p>المنطقة: {orderDetails.address.state}</p>
              )}
              {orderDetails.address.country && (
                <p>الدولة: {orderDetails.address.country}</p>
              )}
            </div>
          </div>

          <div className={styles.orderDetails}>
            <h3>تفاصيل الطلب</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span>المبلغ الإجمالي:</span>
                <span>{formatPrice(parseFloat(orderDetails.total_amount) || 0)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>تكلفة الشحن:</span>
                <span>{formatPrice(parseFloat(orderDetails.shipping_cost) || 0)}</span>
              </div>
              {parseFloat(orderDetails.fees) > 0 && (
                <div className={styles.detailItem}>
                  <span>رسوم إضافية:</span>
                  <span>{formatPrice(parseFloat(orderDetails.fees) || 0)}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span>المبلغ النهائي:</span>
                <span className={styles.finalPrice}>
                  {formatPrice(parseFloat(orderDetails.final_amount) || 0)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span>طريقة الدفع:</span>
                <span>
                  {orderDetails.payment_method === "cash"
                    ? "الدفع عند الاستلام"
                    : orderDetails.payment_method === "tabby"
                    ? "تابي"
                    : orderDetails.payment_method === "credit_card"
                    ? "بطاقة ائتمانية"
                    : orderDetails.payment_method}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.products}>
            <h3>المنتجات المطلوبة</h3>
            <div className={styles.productsList}>
              {orderDetails.products
                .filter(product => !product.deleted_at && product.product_name !== "باقة محذوفة (باقة)" && product.product_name !== "منتج محذوف")
                .map((product, index) => (
                <div key={`product-${index}`} className={styles.productItem}>
                  <div className={styles.productIcon}>
                    <FaBox />
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{product.product_name || `منتج #${product.product_id}`}</h4>
                    <p>الكمية: {product.quantity}</p>
                    <p>سعر القطعة: {formatPrice(parseFloat(product.unit_price) || 0)}</p>
                  </div>
                </div>
              ))}
              {orderDetails.packages
                ?.filter(pkg => !pkg.deleted_at && pkg.package_name !== "باقة محذوفة (باقة)")
                ?.map((pkg, index) => (
                <div key={`package-${index}`} className={styles.productItem}>
                  <div className={styles.productIcon}>
                    <FaGift />
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{pkg.package_name || `باقة #${pkg.package_id}`}</h4>
                    <p>الكمية: {pkg.quantity}</p>
                    <p>سعر الباقة: {formatPrice(parseFloat(pkg.unit_price) || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {orderDetails.notes && (
            <div className={styles.notes}>
              <h3>ملاحظات</h3>
              <p>{orderDetails.notes}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => navigate("/order-tracking")}
              className={styles.trackButton}
            >
              <FaBox />
              تتبع الطلب
            </button>

            <button onClick={() => navigate("/")} className={styles.homeButton}>
              <FaArrowRight />
              العودة للرئيسية
            </button>

            <a
              href={`https://wa.me/+201288266400?text=استفسار عن الطلب رقم: ${orderDetails.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <FaWhatsapp />
              تواصل معنا
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
