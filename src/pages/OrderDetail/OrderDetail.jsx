import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaTimes,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaTimesCircle,
  FaExclamationCircle,
  FaCreditCard,
  FaStickyNote,
  FaDownload,
  FaShippingFast,
  FaEye
} from 'react-icons/fa';
import { useOrder } from '../../hooks/useClientOrders';
import { useCurrency } from '../../hooks';
import CancelOrderModal from '../../components/common/CancelOrderModal';
import ShippingTracker from '../../components/common/ShippingTracker';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPrice } from '../../utils/formatters';
import { getOrderShippingInfo } from '../../services/shipping';
import useAuthStore from '../../stores/authStore';
import styles from './OrderDetail.module.css';

// مكون الفاتورة المنفصل
const InvoiceTemplate = ({ order, formatPrice, formatDate, statusConfig }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '794px', // A4 width in pixels at 96 DPI
        minHeight: 'auto', // تم تغيير من height ثابت إلى auto لتجنب الصفحة الفارغة
        backgroundColor: 'white',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl',
        lineHeight: '1.6'
      }}
      id="invoice-template"
    >
      {/* Header */}
      <div style={{
        backgroundColor: '#8b9dc3',
        color: 'white',
        padding: '30px',
        textAlign: 'center',
        marginBottom: '30px',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>فاتورة</h1>
        <h2 style={{ margin: '0', fontSize: '20px', fontWeight: 'normal' }}>لبان الغزال</h2>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            calendar: 'gregory'
          })}
        </p>
      </div>

      {/* معلومات الطلب */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
          معلومات الطلب
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          marginTop: '15px',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '3px solid #8b9dc3'
          }}>
            <strong style={{ color: '#8b9dc3' }}>رقم الطلب:</strong> 
            <br/>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>#{order.order_number || order.id}</span>
          </div>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '3px solid #8b9dc3'
          }}>
            <strong style={{ color: '#8b9dc3' }}>تاريخ الطلب:</strong> 
            <br/>
            <span style={{ fontSize: '14px' }}>{formatDate(order.created_at)}</span>
          </div>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '3px solid #8b9dc3'
          }}>
            <strong style={{ color: '#8b9dc3' }}>حالة الطلب:</strong> 
            <br/>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{statusConfig[order.status]?.label || 'غير محدد'}</span>
          </div>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '3px solid #8b9dc3'
          }}>
            <strong style={{ color: '#8b9dc3' }}>طريقة الدفع:</strong> 
            <br/>
            <span style={{ fontSize: '14px' }}>{order.payment_method || 'غير محدد'}</span>
          </div>
        </div>
      </div>

      {/* معلومات العميل */}
      {order.client && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
            معلومات العميل
          </h3>
          <div style={{ 
            marginTop: '15px',
            direction: 'rtl',
            textAlign: 'right'
          }}>
            <div style={{ 
              marginBottom: '10px', 
              padding: '8px 12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px',
              borderRight: '3px solid #8b9dc3'
            }}>
              <strong style={{ color: '#8b9dc3' }}>الاسم:</strong> 
              <span style={{ marginRight: '10px' }}>{order.client.name || 'غير محدد'}</span>
            </div>
            <div style={{ 
              marginBottom: '10px', 
              padding: '8px 12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px',
              borderRight: '3px solid #8b9dc3'
            }}>
              <strong style={{ color: '#8b9dc3' }}>البريد الإلكتروني:</strong> 
              <span style={{ marginRight: '10px' }}>{order.client.email || 'غير محدد'}</span>
            </div>
            <div style={{ 
              marginBottom: '10px', 
              padding: '8px 12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px',
              borderRight: '3px solid #8b9dc3'
            }}>
              <strong style={{ color: '#8b9dc3' }}>رقم الهاتف:</strong> 
              <span style={{ marginRight: '10px' }}>{order.client.phone || 'غير محدد'}</span>
            </div>
          </div>
        </div>
      )}

      {/* عنوان الشحن */}
      {order.address && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
            عنوان الشحن
          </h3>
          <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '4px solid #8b9dc3',
            direction: 'rtl',
            textAlign: 'right',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              {order.address.formatted_address || order.address.address_line1 || 'غير محدد'}
            </div>
            {order.address.address_line2 && (
              <div style={{ marginBottom: '8px' }}>{order.address.address_line2}</div>
            )}
            {order.address.postal_code && (
              <div>
                <strong style={{ color: '#8b9dc3' }}>الرمز البريدي:</strong> 
                <span style={{ marginRight: '5px' }}>{order.address.postal_code}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* عناصر الطلب */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
          عناصر الطلب
        </h3>
        
        {/* جدول العناصر */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: '15px', 
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#8b9dc3', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontSize: '16px' }}>المنتج</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '16px' }}>الكمية</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '16px' }}>السعر الواحد</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '16px' }}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {/* المنتجات */}
            {order.products && order.products.map((item, index) => (
              <tr key={`product-${index}`} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontSize: '14px' }}>
                  {item.product_name || 'منتج'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>
                  {item.quantity || 1}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>
                  {formatPrice(item.unit_price || 0)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>
                  {formatPrice(item.total_price || 0)}
                </td>
              </tr>
            ))}
            
            {/* الباقات */}
            {order.packages && order.packages.map((item, index) => {
              const productCount = order.products ? order.products.length : 0;
              const bgIndex = productCount + index;
              return (
                <tr key={`package-${index}`} style={{ backgroundColor: bgIndex % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontSize: '14px' }}>
                    {item.package_name || 'باقة'} (باقة)
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>
                    {item.quantity || 1}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>
                    {formatPrice(item.unit_price || 0)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>
                    {formatPrice(item.total_price || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ملخص الطلب */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
          ملخص الطلب
        </h3>
        <div style={{ 
          marginTop: '15px', 
          maxWidth: '350px', 
          marginLeft: 'auto',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          {order.amounts ? (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 15px', 
                borderBottom: '1px solid #eee',
                fontSize: '14px'
              }}>
                <span>المجموع الفرعي:</span>
                <span style={{ fontWeight: 'bold' }}>{formatPrice(order.amounts.total_amount || 0)}</span>
              </div>
              {order.amounts.shipping_cost > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 15px', 
                  borderBottom: '1px solid #eee',
                  fontSize: '14px'
                }}>
                  <span>رسوم الشحن:</span>
                  <span style={{ fontWeight: 'bold' }}>{formatPrice(order.amounts.shipping_cost)}</span>
                </div>
              )}
              {order.amounts.fees > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 15px', 
                  borderBottom: '1px solid #eee',
                  fontSize: '14px'
                }}>
                  <span>رسوم إضافية:</span>
                  <span style={{ fontWeight: 'bold' }}>{formatPrice(order.amounts.fees)}</span>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '15px', 
                fontSize: '18px', 
                fontWeight: 'bold',
                backgroundColor: '#8b9dc3',
                color: 'white',
                marginTop: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <span>المبلغ الإجمالي:</span>
                <span>{formatPrice(order.amounts.final_amount || 0)}</span>
              </div>
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              backgroundColor: '#8b9dc3',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <span>المبلغ الإجمالي:</span>
              <span>{formatPrice(order.final_amount || order.total_amount || 0)}</span>
            </div>
          )}
        </div>
      </div>

      {/* الملاحظات */}
      {order.notes && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#8b9dc3', borderBottom: '2px solid #8b9dc3', paddingBottom: '10px' }}>
            ملاحظات الطلب
          </h3>
          <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderRight: '4px solid #8b9dc3'
          }}>
            {order.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '50px', 
        textAlign: 'center', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        borderTop: '3px solid #8b9dc3'
      }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#8b9dc3', fontWeight: 'bold' }}>
          شكراً لك على طلبك!
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          لبان الغزال - {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

/**
 * 📋 صفحة تفاصيل الطلب المنفرد
 * تعرض جميع تفاصيل الطلب مع إمكانية إدارته
 */
const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { token } = useAuthStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showShippingTracker, setShowShippingTracker] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loadingShippingInfo, setLoadingShippingInfo] = useState(false);
  const invoiceRef = useRef(null);

  // استخدام hook طلب واحد
  const {
    order,
    loading,
    error,
    fetchOrder,
    cancelOrder: cancelOrderAction,
    canCancel,
    getStatusLabel,
    getStatusColor
  } = useOrder(orderId);

  // تكوين الحالات مع الألوان والأيقونات
  const statusConfig = {
    pending: { label: "في انتظار التأكيد", color: "#f39c12", icon: <FaClock /> },
    confirmed: { label: "مؤكد", color: "#3498db", icon: <FaCheckCircle /> },
    processing: { label: "قيد التجهيز", color: "#9b59b6", icon: <FaBox /> },
    shipped: { label: "تم الشحن", color: "#e67e22", icon: <FaTruck /> },
    delivered: { label: "تم التسليم", color: "#27ae60", icon: <FaCheckCircle /> },
    cancelled: { label: "ملغى", color: "#e74c3c", icon: <FaTimes /> },
    canceled: { label: "ملغى", color: "#e74c3c", icon: <FaTimes /> }, // حالة إضافية للتأكد
    rejected: { label: "مرفوض", color: "#e74c3c", icon: <FaTimes /> },
    failed: { label: "فشل", color: "#e74c3c", icon: <FaTimes /> },
    refunded: { label: "مسترد", color: "#8e44ad", icon: <FaCheckCircle /> },
  };

  // تحميل معلومات الشحن
  const fetchShippingInfo = async () => {
    if (!order || !token) return;
    
    setLoadingShippingInfo(true);
    try {
      const result = await getOrderShippingInfo(order.id, token);
      if (result.success) {
        setShippingInfo(result.data);
      } else {
        console.warn('لا توجد معلومات شحن للطلب:', result.error);
      }
    } catch (error) {
      console.error('خطأ في تحميل معلومات الشحن:', error);
    } finally {
      setLoadingShippingInfo(false);
    }
  };

  // تحميل معلومات الشحن عند تحميل الطلب
  useEffect(() => {
    if (order && token) {
      fetchShippingInfo();
    }
  }, [order, token]);

  // التعامل مع إلغاء الطلب
  const handleCancelOrder = async (reason) => {
    try {
      const success = await cancelOrderAction(reason);
      
      if (success) {
        toast.success('تم إلغاء الطلب بنجاح');
        setShowCancelModal(false);
      } else {
        toast.error('فشل في إلغاء الطلب');
      }
    } catch (err) {
      toast.error(err.message || 'حدث خطأ في إلغاء الطلب');
    }
  };

  // تحميل الفاتورة كـ PDF
  const handleDownloadInvoice = async () => {
    if (!order) {
      toast.error('لا توجد بيانات طلب لإنشاء الفاتورة');
      return;
    }
    
    setDownloadLoading(true);
    
    try {
      console.log('بدء إنشاء الفاتورة...', order);
      
      // إنشاء مكون الفاتورة مؤقتاً في DOM
      const invoiceElement = document.createElement('div');
      document.body.appendChild(invoiceElement);
      
      // رندر مكون الفاتورة
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(invoiceElement);
      
      // وعد للانتظار حتى يتم رندر المكون
      await new Promise((resolve) => {
        root.render(
          <InvoiceTemplate 
            order={order} 
            formatPrice={formatPrice} 
            formatDate={formatDate} 
            statusConfig={statusConfig} 
          />
        );
        // انتظار قصير للتأكد من اكتمال الرندر
        setTimeout(resolve, 100);
      });
      
      // العثور على عنصر الفاتورة المرندر
      const invoiceTemplateElement = document.getElementById('invoice-template');
      
      if (!invoiceTemplateElement) {
        throw new Error('فشل في إنشاء مكون الفاتورة');
      }
      
      // تحويل HTML إلى canvas
      const canvas = await html2canvas(invoiceTemplateElement, {
        scale: 2, // جودة عالية
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: invoiceTemplateElement.scrollHeight, // استخدام الارتفاع الفعلي للمحتوى
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // التأكد من أن النصوص العربية تظهر بشكل صحيح
          const clonedElement = clonedDoc.getElementById('invoice-template');
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
            clonedElement.style.position = 'static';
            clonedElement.style.left = 'auto';
            clonedElement.style.top = 'auto';
          }
        }
      });
      
      // إنشاء PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // إضافة الصورة إلى PDF
      const imgData = canvas.toDataURL('image/png');
      
      // إذا كان الارتفاع أقل من أو يساوي صفحة واحدة
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // إذا كان أكبر من صفحة واحدة، قسم الصورة على صفحات متعددة
        let yPosition = 0;
        let remainingHeight = imgHeight;
        
        while (remainingHeight > 0) {
          if (yPosition > 0) {
            pdf.addPage();
          }
          
          const heightToAdd = Math.min(pageHeight, remainingHeight);
          pdf.addImage(imgData, 'PNG', 0, -yPosition, imgWidth, imgHeight);
          
          yPosition += pageHeight;
          remainingHeight -= pageHeight;
        }
      }
      
      // حفظ PDF
      const fileName = `invoice-${order.order_number || order.id}.pdf`;
      pdf.save(fileName);
      
      // تنظيف DOM
      root.unmount();
      document.body.removeChild(invoiceElement);
      
      console.log('تم حفظ PDF:', fileName);
      toast.success('تم تحميل الفاتورة بنجاح');
      
    } catch (error) {
      console.error('خطأ في تحميل الفاتورة:', error);
      toast.error(`حدث خطأ في تحميل الفاتورة: ${error.message}`);
    } finally {
      setDownloadLoading(false);
    }
  };

  // تنسيق الأسعار

  // تنسيق التاريخ بالميلادي
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'غير محدد';
      
      // عرض التاريخ بالميلادي باللغة العربية
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        calendar: 'gregory' // التقويم الميلادي
      });
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      return 'غير محدد';
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.loadingState}>
            <FaSpinner className={styles.loadingSpinner} />
            <h3>جاري تحميل تفاصيل الطلب...</h3>
            <p>يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.errorState}>
            <FaExclamationCircle className={styles.errorIcon} />
            <h3>حدث خطأ</h3>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button className={styles.retryButton} onClick={fetchOrder}>
                <FaSpinner />
                إعادة المحاولة
              </button>
              <button className={styles.backButton} onClick={() => navigate('/order')}>
                <FaArrowLeft />
                العودة للطلبات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يوجد الطلب
  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.notFoundState}>
            <FaBox className={styles.notFoundIcon} />
            <h3>الطلب غير موجود</h3>
            <p>لم يتم العثور على الطلب المطلوب</p>
            <button className={styles.backButton} onClick={() => navigate('/order')}>
              <FaArrowLeft />
              العودة للطلبات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate('/order')}>
            <FaArrowLeft />
            العودة للطلبات
          </button>
          
          <div className={styles.headerContent}>
            <div className={styles.orderTitle}>
              <h1>#{order.order_number || order.id}</h1>
                             <span 
                 className={styles.orderStatus}
                 style={{ backgroundColor: getStatusColor(order.status) || statusConfig[order.status]?.color }}
                 title={`الحالة الفعلية: ${order.status}`} // للمساعدة في التشخيص
               >
                 {statusConfig[order.status]?.icon}
                 {statusConfig[order.status]?.label || order.status_label || getStatusLabel(order.status) || 'غير محدد'}
               </span>
            </div>
            
                         <div className={styles.orderActions}>
               {canCancel && (
                 <button 
                   className={styles.cancelButton}
                   onClick={() => setShowCancelModal(true)}
                   disabled={loading || downloadLoading}
                 >
                   <FaTimesCircle />
                   إلغاء الطلب
                 </button>
               )}
               <button 
                 className={styles.downloadButton}
                 onClick={handleDownloadInvoice}
                 disabled={loading || downloadLoading}
               >
                 {downloadLoading ? <FaSpinner className={styles.spin} /> : <FaDownload />}
                 {downloadLoading ? 'جاري إنشاء الفاتورة...' : 'تحميل الفاتورة'}
               </button>
             </div>
          </div>
        </div>

        <div className={styles.orderContent}>
          {/* Order Info Card */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>معلومات الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>رقم الطلب:</span>
                  <span className={styles.infoValue}>#{order.order_number || order.id}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>تاريخ الطلب:</span>
                  <span className={styles.infoValue}>
                    <FaCalendarAlt />
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>آخر تحديث:</span>
                  <span className={styles.infoValue}>
                    <FaCalendarAlt />
                    {formatDate(order.updated_at)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>طريقة الدفع:</span>
                  <span className={styles.infoValue}>
                    <FaCreditCard />
                    {order.payment_method || 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.client && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>معلومات العميل</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerDetail}>
                    <strong>الاسم:</strong> {order.client.name}
                  </div>
                  <div className={styles.customerDetail}>
                    <strong>البريد الإلكتروني:</strong> {order.client.email}
                  </div>
                  <div className={styles.customerDetail}>
                    <strong>رقم الهاتف:</strong>
                    <span className={styles.phoneNumber}>
                      <FaPhone />
                      {order.client.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.address && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>عنوان الشحن</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.addressInfo}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div className={styles.addressDetails}>
                    <p>{order.address.formatted_address || 
                       `${order.address.address_line1}, ${order.address.city}, ${order.address.country}`}</p>
                    {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                    {order.address.postal_code && (
                      <p><strong>الرمز البريدي:</strong> {order.address.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Tracking */}
          {(order.status === 'shipped' || order.status === 'delivered' || shippingInfo) && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>تتبع الشحن</h2>
                {shippingInfo?.tracking_number && (
                  <button 
                    className={styles.trackButton}
                    onClick={() => setShowShippingTracker(true)}
                    disabled={loadingShippingInfo}
                  >
                    {loadingShippingInfo ? (
                      <FaSpinner className={styles.spin} />
                    ) : (
                      <FaEye />
                    )}
                    {loadingShippingInfo ? 'جاري التحميل...' : 'تتبع الشحن'}
                  </button>
                )}
              </div>
              <div className={styles.cardBody}>
                {loadingShippingInfo ? (
                  <div className={styles.loadingShipping}>
                    <FaSpinner className={styles.spin} />
                    <p>جاري تحميل معلومات الشحن...</p>
                  </div>
                ) : shippingInfo ? (
                  <div className={styles.shippingInfo}>
                    <div className={styles.shippingDetail}>
                      <strong>رقم التتبع:</strong>
                      <span className={styles.trackingNumber}>
                        <FaShippingFast />
                        {shippingInfo.tracking_number}
                      </span>
                    </div>
                    {shippingInfo.shipping_reference && (
                      <div className={styles.shippingDetail}>
                        <strong>رقم الشحن المرجعي:</strong>
                        <span>{shippingInfo.shipping_reference}</span>
                      </div>
                    )}
                    {shippingInfo.shipping_status && (
                      <div className={styles.shippingDetail}>
                        <strong>حالة الشحن:</strong>
                        <span className={styles.shippingStatus}>
                          <FaTruck />
                          {shippingInfo.shipping_status}
                        </span>
                      </div>
                    )}
                    {shippingInfo.shipping_created_at && (
                      <div className={styles.shippingDetail}>
                        <strong>تاريخ إنشاء الشحن:</strong>
                        <span>{formatDate(shippingInfo.shipping_created_at)}</span>
                      </div>
                    )}
                    {shippingInfo.consignment_number && (
                      <div className={styles.shippingDetail}>
                        <strong>رقم الإرسالية:</strong>
                        <span>{shippingInfo.consignment_number}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.noShippingInfo}>
                    <FaTruck className={styles.noShippingIcon} />
                    <p>لم يتم إنشاء شحن لهذا الطلب بعد</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>عناصر الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.itemsList}>
                {/* Products */}
                {order.products && order.products.map((item, index) => (
                  <div key={`product-${index}`} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <FaBox />
                        </div>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.product_name}</h4>
                      {item.product_description && (
                        <p className={styles.itemDescription}>{item.product_description}</p>
                      )}
                      <div className={styles.itemMeta}>
                        <span>الكمية: {item.quantity}</span>
                        <span>السعر الواحد: {formatPrice(item.unit_price)}</span>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.total_price)}
                    </div>
                  </div>
                ))}

                {/* Packages */}
                {order.packages && order.packages.map((item, index) => (
                  <div key={`package-${index}`} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      <div className={styles.packageIcon}>
                        <FaBox />
                      </div>
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.package_name} (باقة)</h4>
                      {item.package_description && (
                        <p className={styles.itemDescription}>{item.package_description}</p>
                      )}
                      <div className={styles.itemMeta}>
                        <span>الكمية: {item.quantity}</span>
                        <span>السعر الواحد: {formatPrice(item.unit_price)}</span>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.total_price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <h2>ملخص الطلب</h2>
            </div>
            <div className={styles.cardBody}>
              {order.amounts ? (
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>المجموع الفرعي:</span>
                    <span>{formatPrice(order.amounts.total_amount)}</span>
                  </div>
                  {order.amounts.shipping_cost > 0 && (
                    <div className={styles.summaryRow}>
                      <span>رسوم الشحن:</span>
                      <span>{formatPrice(order.amounts.shipping_cost)}</span>
                    </div>
                  )}
                  {order.amounts.fees > 0 && (
                    <div className={styles.summaryRow}>
                      <span>رسوم إضافية:</span>
                      <span>{formatPrice(order.amounts.fees)}</span>
                    </div>
                  )}
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>المبلغ الإجمالي:</span>
                    <span>{formatPrice(order.amounts.final_amount)}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.summaryDetails}>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>المبلغ الإجمالي:</span>
                    <span>{formatPrice(order.final_amount || order.total_amount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>ملاحظات الطلب</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.notesContent}>
                  <FaStickyNote className={styles.notesIcon} />
                  <p>{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancel Order Modal */}
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
          order={order}
          loading={loading}
        />

        {/* مكون الفاتورة المخفي - يتم استخدامه عند التحميل */}
        {order && (
          <InvoiceTemplate 
            order={order} 
            formatPrice={formatPrice} 
            formatDate={formatDate} 
            statusConfig={statusConfig} 
          />
        )}

        {/* مكون تتبع الشحن */}
        {showShippingTracker && shippingInfo?.tracking_number && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <ShippingTracker
                trackingNumber={shippingInfo.tracking_number}
                onClose={() => setShowShippingTracker(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 