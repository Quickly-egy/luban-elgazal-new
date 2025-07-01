import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fa';
import { useOrder } from '../../hooks/useClientOrders';
import { useCurrency } from '../../hooks';
import CancelOrderModal from '../../components/common/CancelOrderModal';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { formatPrice } from '../../utils/formatters';
import styles from './OrderDetail.module.css';

/**
 * 📋 صفحة تفاصيل الطلب المنفرد
 * تعرض جميع تفاصيل الطلب مع إمكانية إدارته
 */
const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

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
      
      // إنشاء PDF مباشرة
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPos = 20;
      const margin = 20;
      const lineHeight = 7;
      
      // إعداد الخط
      pdf.setFont('helvetica');
      
      // === الهيدر ===
      pdf.setFillColor(139, 157, 195);
      pdf.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('Invoice / فاتورة', pageWidth / 2, yPos + 15, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text('Luban Elgazal / لبان الغزال', pageWidth / 2, yPos + 30, { align: 'center' });
      
      yPos += 50;
      
      // تاريخ الإصدار
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Date: ${currentDate}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
      
      // === معلومات الطلب ===
      pdf.setTextColor(139, 157, 195);
      pdf.setFontSize(14);
      pdf.text('Order Information', margin, yPos);
      yPos += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Order Number: #${order.order_number || order.id}`, margin, yPos);
      yPos += lineHeight;
      pdf.text(`Order Date: ${formatDate(order.created_at)}`, margin, yPos);
      yPos += lineHeight;
      pdf.text(`Status: ${statusConfig[order.status]?.label || 'Unknown'}`, margin, yPos);
      yPos += lineHeight;
      pdf.text(`Payment Method: ${order.payment_method || 'Not specified'}`, margin, yPos);
      yPos += 15;
      
      // === معلومات العميل ===
      if (order.client) {
        pdf.setTextColor(139, 157, 195);
        pdf.setFontSize(14);
        pdf.text('Customer Information', margin, yPos);
        yPos += 8;
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.text(`Name: ${order.client.name || 'Not specified'}`, margin, yPos);
        yPos += lineHeight;
        pdf.text(`Email: ${order.client.email || 'Not specified'}`, margin, yPos);
        yPos += lineHeight;
        pdf.text(`Phone: ${order.client.phone || 'Not specified'}`, margin, yPos);
        yPos += 15;
      }
      
      // === عنوان الشحن ===
      if (order.address) {
        pdf.setTextColor(139, 157, 195);
        pdf.setFontSize(14);
        pdf.text('Shipping Address', margin, yPos);
        yPos += 8;
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        const address = order.address.formatted_address || order.address.address_line1 || 'Not specified';
        const addressLines = pdf.splitTextToSize(address, pageWidth - (margin * 2));
        pdf.text(addressLines, margin, yPos);
        yPos += addressLines.length * lineHeight + 10;
      }
      
      // === جدول العناصر ===
      pdf.setTextColor(139, 157, 195);
      pdf.setFontSize(14);
      pdf.text('Order Items', margin, yPos);
      yPos += 10;
      
      // رأس الجدول
      pdf.setFillColor(139, 157, 195);
      pdf.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('Item', margin + 5, yPos + 6);
      pdf.text('Qty', margin + 100, yPos + 6);
      pdf.text('Price', margin + 130, yPos + 6);
      pdf.text('Total', margin + 160, yPos + 6);
      
      yPos += 12;
      
      // عناصر الطلب
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      
      // المنتجات
      if (order.products && order.products.length > 0) {
        order.products.forEach(item => {
          if (yPos > pageHeight - 30) {
            pdf.addPage();
            yPos = 20;
          }
          
          const itemName = (item.product_name || 'Product').substring(0, 30);
          pdf.text(itemName, margin + 5, yPos);
          pdf.text(String(item.quantity || 1), margin + 100, yPos);
          pdf.text(formatPrice(item.unit_price || 0), margin + 130, yPos);
          pdf.text(formatPrice(item.total_price || 0), margin + 160, yPos);
          yPos += lineHeight;
        });
      }
      
      // الباقات
      if (order.packages && order.packages.length > 0) {
        order.packages.forEach(item => {
          if (yPos > pageHeight - 30) {
            pdf.addPage();
            yPos = 20;
          }
          
          const packageName = ((item.package_name || 'Package') + ' (Package)').substring(0, 30);
          pdf.text(packageName, margin + 5, yPos);
          pdf.text(String(item.quantity || 1), margin + 100, yPos);
          pdf.text(formatPrice(item.unit_price || 0), margin + 130, yPos);
          pdf.text(formatPrice(item.total_price || 0), margin + 160, yPos);
          yPos += lineHeight;
        });
      }
      
      yPos += 10;
      
      // === ملخص الطلب ===
      pdf.setTextColor(139, 157, 195);
      pdf.setFontSize(14);
      pdf.text('Order Summary', margin, yPos);
      yPos += 10;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      const totalAmount = order.amounts?.final_amount || order.final_amount || order.total_amount || 0;
      
      if (order.amounts) {
        pdf.text('Subtotal:', margin + 100, yPos);
        pdf.text(formatPrice(order.amounts.total_amount || 0), margin + 160, yPos);
        yPos += lineHeight;
        
        if (order.amounts.shipping_cost && order.amounts.shipping_cost > 0) {
          pdf.text('Shipping:', margin + 100, yPos);
          pdf.text(formatPrice(order.amounts.shipping_cost), margin + 160, yPos);
          yPos += lineHeight;
        }
        
        if (order.amounts.fees && order.amounts.fees > 0) {
          pdf.text('Fees:', margin + 100, yPos);
          pdf.text(formatPrice(order.amounts.fees), margin + 160, yPos);
          yPos += lineHeight;
        }
      }
      
      // المبلغ الإجمالي
      pdf.setFontSize(12);
      pdf.setTextColor(139, 157, 195);
      pdf.text('Total Amount:', margin + 100, yPos + 5);
      pdf.text(formatPrice(totalAmount), margin + 160, yPos + 5);
      
      yPos += 20;
      
      // === الملاحظات ===
      if (order.notes) {
        pdf.setTextColor(139, 157, 195);
        pdf.setFontSize(14);
        pdf.text('Notes', margin, yPos);
        yPos += 8;
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        const notesLines = pdf.splitTextToSize(order.notes, pageWidth - (margin * 2));
        pdf.text(notesLines, margin, yPos);
        yPos += notesLines.length * lineHeight + 10;
      }
      
      // === الفوتر ===
      const footerY = pageHeight - 30;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, footerY, pageWidth - (margin * 2), 20, 'F');
      
      pdf.setTextColor(139, 157, 195);
      pdf.setFontSize(12);
      pdf.text('Thank you for your order!', pageWidth / 2, footerY + 8, { align: 'center' });
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text(`Luban Elgazal - ${new Date().getFullYear()}`, pageWidth / 2, footerY + 15, { align: 'center' });
      
      // حفظ PDF
      const fileName = `invoice-${order.order_number || order.id}.pdf`;
      pdf.save(fileName);
      
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

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    
    try {
      return new Date(dateString).toLocaleDateString('ar', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'gregory'
      });
    } catch (error) {
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
      </div>
    </div>
  );
};

export default OrderDetail; 