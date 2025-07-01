import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import styles from './CancelOrderModal.module.css';

/**
 * 🚫 مكون نافذة إلغاء الطلب
 * يسمح للعميل بإلغاء طلبه مع إدخال سبب الإلغاء
 */
const CancelOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  order, 
  loading = false 
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  // أسباب الإلغاء المحددة مسبقاً
  const predefinedReasons = [
    'تغيير في الخطط الشخصية',
    'وجدت سعر أفضل في مكان آخر',
    'لم أعد بحاجة للمنتجات',
    'أريد تعديل الطلب',
    'طول فترة التوصيل',
    'مشكلة في طريقة الدفع',
    'سبب آخر'
  ];

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
    if (reason !== 'سبب آخر') {
      setCancelReason(reason);
    } else {
      setCancelReason('');
    }
  };

  const handleConfirm = async () => {
    const finalReason = selectedReason === 'سبب آخر' ? cancelReason : selectedReason;
    await onConfirm(finalReason);
    handleClose();
  };

  const handleClose = () => {
    setCancelReason('');
    setSelectedReason('');
    onClose();
  };

  const isReasonValid = () => {
    if (selectedReason === 'سبب آخر') {
      return cancelReason.trim().length > 0;
    }
    return selectedReason.length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <FaExclamationTriangle />
          </div>
          <h2>إلغاء الطلب</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Order Info */}
        {order && (
          <div className={styles.orderInfo}>
            <h3>تفاصيل الطلب</h3>
            <div className={styles.orderDetails}>
              <span><strong>رقم الطلب:</strong> #{order.order_number || order.id}</span>
              <span><strong>الحالة:</strong> {order.status_label || order.status}</span>
              <span><strong>المبلغ:</strong> {order.final_amount || order.total_amount} ريال</span>
            </div>
          </div>
        )}

        {/* Warning Message */}
        <div className={styles.warningMessage}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <p>
            هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ 
            <br />
            <strong>لا يمكن التراجع عن هذا الإجراء.</strong>
          </p>
        </div>

        {/* Cancel Reason */}
        <div className={styles.reasonSection}>
          <h4>سبب الإلغاء (اختياري)</h4>
          
          {/* Predefined Reasons */}
          <div className={styles.predefinedReasons}>
            {predefinedReasons.map((reason, index) => (
              <label key={index} className={styles.reasonOption}>
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  disabled={loading}
                />
                <span className={styles.reasonText}>{reason}</span>
              </label>
            ))}
          </div>

          {/* Custom Reason Input */}
          {selectedReason === 'سبب آخر' && (
            <div className={styles.customReasonInput}>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="يرجى كتابة سبب الإلغاء..."
                rows={3}
                maxLength={500}
                disabled={loading}
                className={styles.reasonTextarea}
              />
              <div className={styles.characterCount}>
                {cancelReason.length}/500
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={loading}
          >
            تراجع
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={handleConfirm}
            disabled={loading || !isReasonValid()}
          >
            {loading ? (
              <>
                <FaSpinner className={styles.spinner} />
                جاري الإلغاء...
              </>
            ) : (
              'تأكيد الإلغاء'
            )}
          </button>
        </div>

        {/* Note */}
        <div className={styles.noteSection}>
          <p className={styles.note}>
            💡 <strong>ملاحظة:</strong> سيتم إرسال تأكيد الإلغاء إلى رقم هاتفك المسجل
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal; 