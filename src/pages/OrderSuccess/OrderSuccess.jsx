import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const stateOrderDetails = location.state?.orderDetails;

    if (payment_id) {
      // في حالة الدفع بتابي، نستخدم API لتحديث حالة الدفع
      updatePaymentStatus(payment_id);
    } else if (stateOrderDetails) {
      // في حالة الدفع عند الاستلام، نستخدم البيانات مباشرة من state
      setOrderDetails(stateOrderDetails);
      setIsLoading(false);
    } else {
      // في حالة عدم وجود بيانات الطلب أو payment_id
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
      } else {
      }
    } catch (error) {
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
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          العودة للرئيسية
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
              <p>{orderDetails.address.address_line1}</p>
              <p>{orderDetails.address.address_line2}</p>
              <p>
                {orderDetails.address.city}، {orderDetails.address.state}
              </p>
              <p>{orderDetails.address.country}</p>
              <p>الرمز البريدي: {orderDetails.address.postal_code}</p>
            </div>
          </div>

          <div className={styles.orderDetails}>
            <h3>تفاصيل الطلب</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span>المبلغ الإجمالي:</span>
                <span>{orderDetails.total_amount}</span>
              </div>
              <div className={styles.detailItem}>
                <span>تكلفة الشحن:</span>
                <span>{orderDetails.shipping_cost}</span>
              </div>
              {parseFloat(orderDetails.fees) > 0 && (
                <div className={styles.detailItem}>
                  <span>رسوم إضافية:</span>
                  <span>{orderDetails.fees}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span>المبلغ النهائي:</span>
                <span className={styles.finalPrice}>
                  {orderDetails.final_amount}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span>طريقة الدفع:</span>
                <span>
                  {orderDetails.payment_method === "cash"
                    ? "الدفع عند الاستلام"
                    : "تابي"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.products}>
            <h3>المنتجات المطلوبة</h3>
            <div className={styles.productsList}>
              {orderDetails.products.map((product, index) => (
                <div key={`product-${index}`} className={styles.productItem}>
                  <div className={styles.productIcon}>
                    <FaBox />
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{product.product_name}</h4>
                    <p>الكمية: {product.quantity}</p>
                    <p>سعر القطعة: {product.unit_price} ريال</p>
                    <p className={styles.productTotal}>
                      المجموع: {product.total_price} ريال
                    </p>
                  </div>
                </div>
              ))}
              {orderDetails.packages?.map((pkg, index) => (
                <div key={`package-${index}`} className={styles.productItem}>
                  <div className={styles.productIcon}>
                    <FaGift />
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{pkg.package_name}</h4>
                    <p>الكمية: {pkg.quantity}</p>
                    <p>سعر الباقة: {pkg.unit_price} ريال</p>
                    <p className={styles.productTotal}>
                      المجموع: {pkg.total_price} ريال
                    </p>
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
