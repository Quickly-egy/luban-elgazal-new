import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBox,
    FaCheckCircle,
    FaTruck,
    FaClock,
    FaTimes,
    FaEye,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaSpinner,
    FaSyncAlt,
    FaTimesCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import styles from "./Order.module.css";
import { useCurrency } from '../../hooks';
import { useClientOrders } from '../../hooks/useClientOrders';
import CancelOrderModal from '../../components/common/CancelOrderModal';
import { toast } from 'react-toastify';

export default function Order() {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const { formatPrice } = useCurrency();

    // استخدام hook طلبات العملاء
    const {
        orders,
        statistics,
        pagination,
        loading,
        error,
        searchOrders,
        filterByStatus,
        cancelOrder,
        refreshOrders,
        clearError,
        canCancelOrder,
        getStatusLabel,
        getStatusColor,
        hasOrders,
        totalOrders,
        isAuthenticated
    } = useClientOrders({ per_page: 10 });

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

    // التعامل مع البحث مع تأخير
    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeoutId = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                searchOrders(searchTerm);
            } else {
                // إذا كان البحث فارغاً، أعد تحميل الطلبات مع الفلتر الحالي
                if (selectedStatus !== 'all') {
                    filterByStatus(selectedStatus);
                } else {
                    refreshOrders();
                }
            }
        }, 500);

        setSearchTimeout(timeoutId);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    // التعامل مع تغيير الحالة
    const handleStatusChange = async (status) => {
        setSelectedStatus(status);
        await filterByStatus(status);
    };

    // التعامل مع البحث
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // فتح مودال الإلغاء
    const handleCancelClick = (order) => {
        setOrderToCancel(order);
        setShowCancelModal(true);
    };

    // تأكيد إلغاء الطلب
    const handleConfirmCancel = async (reason) => {
        if (!orderToCancel) return;

        try {
            const success = await cancelOrder(orderToCancel.id, reason);
            
            if (success) {
                toast.success('تم إلغاء الطلب بنجاح');
                setShowCancelModal(false);
                setOrderToCancel(null);
            } else {
                toast.error('فشل في إلغاء الطلب');
            }
        } catch (err) {
            toast.error(err.message || 'حدث خطأ في إلغاء الطلب');
        }
    };

    // إغلاق مودال الإلغاء
    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    // تنسيق التاريخ بالميلادي
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            // عرض التاريخ بالميلادي باللغة العربية
            return date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long", 
                day: "numeric",
                calendar: "gregory" // التقويم الميلادي
            });
        } catch (error) {
            console.error('خطأ في تنسيق التاريخ:', error);
            return '';
        }
    };

    // عرض رسالة الخطأ
    const renderError = () => {
        if (!error) return null;

        return (
            <div className={styles.errorMessage}>
                <FaExclamationCircle className={styles.errorIcon} />
                <div className={styles.errorContent}>
                    <h3>حدث خطأ</h3>
                    <p>{error}</p>
                    <button 
                        className={styles.retryButton} 
                        onClick={() => {
                            clearError();
                            refreshOrders();
                        }}
                    >
                        <FaSyncAlt />
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    };

    // التحقق من المصادقة
    if (!isAuthenticated) {
        return (
            <div className={styles.orderPage}>
                <div className="container">
                    <div className={styles.authRequired}>
                        <FaExclamationCircle className={styles.authIcon} />
                        <h2>يجب تسجيل الدخول</h2>
                        <p>يرجى تسجيل الدخول لعرض طلباتك</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.orderPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaBox />
                        </div>
                        <div className={styles.headerText}>
                            <h1>طلباتي</h1>
                            <p>تتبع وإدارة جميع طلباتك</p>
                        </div>
                        {statistics && (
                            <div className={styles.headerStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{statistics.total_orders || 0}</span>
                                    <span className={styles.statLabel}>إجمالي الطلبات</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{formatPrice(statistics.total_spent || 0)}</span>
                                    <span className={styles.statLabel}>إجمالي المبلغ</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {renderError()}

                {/* Filters and Search */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="البحث في الطلبات برقم الطلب..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                            disabled={loading}
                        />
                        {loading && <FaSpinner className={styles.searchSpinner} />}
                    </div>

                    <div className={styles.statusFilters}>
                        <button
                            className={`${styles.filterBtn} ${selectedStatus === "all" ? styles.active : ""}`}
                            onClick={() => handleStatusChange("all")}
                            disabled={loading}
                        >
                            <FaFilter />
                            الكل
                        </button>
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <button
                                key={status}
                                className={`${styles.filterBtn} ${selectedStatus === status ? styles.active : ""}`}
                                onClick={() => handleStatusChange(status)}
                                disabled={loading}
                            >
                                {config.icon}
                                {config.label}
                            </button>
                        ))}
                    </div>

                    {/* Refresh Button */}
                    <div className={styles.refreshSection}>
                        <button 
                            className={styles.refreshButton}
                            onClick={refreshOrders}
                            disabled={loading}
                        >
                            <FaSyncAlt className={loading ? styles.spinning : ''} />
                            تحديث
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && !hasOrders && (
                    <div className={styles.loadingState}>
                        <FaSpinner className={styles.loadingSpinner} />
                        <p>جاري تحميل الطلبات...</p>
                    </div>
                )}

                {/* Orders List */}
                <div className={styles.ordersContainer}>
                    {!loading && !hasOrders ? (
                        <div className={styles.emptyState}>
                            <FaBox className={styles.emptyIcon} />
                            <h3>لا توجد طلبات</h3>
                            <p>
                                {searchTerm ? 
                                    `لم يتم العثور على طلبات تطابق "${searchTerm}"` :
                                    selectedStatus !== 'all' ?
                                        `لا توجد طلبات بحالة "${statusConfig[selectedStatus]?.label}"` :
                                        'لم تقم بإنشاء أي طلبات بعد'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {orders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    {/* Order Header */}
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <h3 className={styles.orderId}>#{order.order_number || order.id}</h3>
                                            <div className={styles.orderMeta}>
                                                <span className={styles.orderDate}>
                                                    <FaCalendarAlt />
                                                    {formatDate(order.created_at) || formatDate(order.date)}
                                                </span>
                                                <span className={styles.orderTotal}>
                                                    المجموع: {formatPrice(order.final_amount || order.total_amount || order.total)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.orderActions}>
                                            <span
                                                className={styles.orderStatus}
                                                style={{
                                                    backgroundColor: getStatusColor(order.status) || statusConfig[order.status]?.color,
                                                }}
                                                title={`الحالة الفعلية: ${order.status}`} // للمساعدة في التشخيص
                                            >
                                                {statusConfig[order.status]?.icon}
                                                {statusConfig[order.status]?.label || order.status_label || getStatusLabel(order.status) || 'غير محدد'}
                                            </span>
                                            <div className={styles.actionButtons}>
                                                <button 
                                                    className={styles.viewBtn}
                                                    onClick={() => navigate(`/order-detail/${order.id}`)}
                                                >
                                                    <FaEye />
                                                    عرض التفاصيل
                                                </button>
                                                {canCancelOrder(order) && (
                                                    <button 
                                                        className={styles.cancelBtn}
                                                        onClick={() => handleCancelClick(order)}
                                                        disabled={loading}
                                                    >
                                                        <FaTimesCircle />
                                                        إلغاء الطلب
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className={styles.orderItems}>
                                        {/* Products */}
                                        {order.products && order.products.map((item, index) => (
                                            <div key={`product-${index}`} className={styles.orderItem}>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.product_name}</span>
                                                    <span className={styles.itemQuantity}>
                                                        الكمية: {item.quantity}
                                                    </span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {formatPrice(item.total_price)}
                                                </span>
                                            </div>
                                        ))}
                                        
                                        {/* Packages */}
                                        {order.packages && order.packages.map((item, index) => (
                                            <div key={`package-${index}`} className={styles.orderItem}>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.package_name}</span>
                                                    <span className={styles.itemQuantity}>
                                                        الكمية: {item.quantity} (باقة)
                                                    </span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {formatPrice(item.total_price)}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Fallback for legacy items */}
                                        {order.items && order.items.map((item, index) => (
                                            <div key={`item-${index}`} className={styles.orderItem}>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.name}</span>
                                                    <span className={styles.itemQuantity}>
                                                        الكمية: {item.quantity}
                                                    </span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Details Summary */}
                                    <div className={styles.orderSummary}>
                                        {order.amounts && (
                                            <div className={styles.amountBreakdown}>
                                                <div className={styles.amountRow}>
                                                    <span>المجموع الفرعي:</span>
                                                    <span>{formatPrice(order.amounts.total_amount)}</span>
                                                </div>
                                                {order.amounts.shipping_cost > 0 && (
                                                    <div className={styles.amountRow}>
                                                        <span>رسوم الشحن:</span>
                                                        <span>{formatPrice(order.amounts.shipping_cost)}</span>
                                                    </div>
                                                )}
                                                {order.amounts.fees > 0 && (
                                                    <div className={styles.amountRow}>
                                                        <span>رسوم إضافية:</span>
                                                        <span>{formatPrice(order.amounts.fees)}</span>
                                                    </div>
                                                )}
                                                <div className={`${styles.amountRow} ${styles.finalAmount}`}>
                                                    <span>المبلغ الإجمالي:</span>
                                                    <span>{formatPrice(order.amounts.final_amount)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delivery Info */}
                                    {order.address && (
                                        <div className={styles.deliveryInfo}>
                                            <div className={styles.deliveryAddress}>
                                                <FaMapMarkerAlt className={styles.deliveryIcon} />
                                                <div>
                                                    <span className={styles.deliveryLabel}>عنوان التسليم:</span>
                                                    <span className={styles.deliveryText}>
                                                        {order.address.formatted_address || 
                                                         `${order.address.address_line1}, ${order.address.city}, ${order.address.country}`}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {order.notes && (
                                                <div className={styles.orderNotes}>
                                                    <strong>ملاحظات:</strong> {order.notes}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <div className={styles.pagination}>
                                    <div className={styles.paginationInfo}>
                                        عرض {pagination.from} - {pagination.to} من {pagination.total} طلب
                                    </div>
                                    {/* يمكن إضافة أزرار التنقل بين الصفحات هنا */}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Cancel Order Modal */}
                <CancelOrderModal
                    isOpen={showCancelModal}
                    onClose={handleCloseCancelModal}
                    onConfirm={handleConfirmCancel}
                    order={orderToCancel}
                    loading={loading}
                />
            </div>
        </div>
    );
}
