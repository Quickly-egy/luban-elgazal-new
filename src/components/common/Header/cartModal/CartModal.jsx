import { MdOutlineClose } from 'react-icons/md';
import styles from './cartModal.module.css';
import { FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import useCartStore from '../../../../stores/cartStore';
import ProductCardModal from '../../ProductCardModal/ProductCardModal';
import { useNavigate } from 'react-router-dom';

export default function CartModal({ showCartModal, setShowCartModal }) {
    const navigate = useNavigate();
    
    // استخدام Zustand store
    const { 
        cartItems, 
        removeFromCart, 
        clearCart,
        getCartCount,
        getTotalPrice,
        notification,
        notificationType,
        clearNotification
    } = useCartStore();

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
    };

    const handleClearCart = () => {
        if (cartItems.length > 0) {
            clearCart();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowCartModal(false);
        }
    };

    const handleCheckout = () => {
        console.log('الانتقال لصفحة الدفع');
        // يمكن إضافة navigation هنا
        setShowCartModal(false);
    };

    const handleBrowseProducts = () => {
        setShowCartModal(false); // إغلاق المودال
        navigate('/products'); // التوجه لصفحة المنتجات
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ar-EG').format(price);
    };

    return (
        <aside className={`${styles.sideBar} ${showCartModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={`${styles.container}`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={`${styles.header}`}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaShoppingCart />
                        </div>
                        <div className={styles.headerText}>
                            <h3>سلة المشتريات</h3>
                            <p>{getCartCount()} منتج</p>
                        </div>
                    </div>
                    <button className={`${styles.closeBtn}`} onClick={() => setShowCartModal(false)}>
                        <MdOutlineClose />
                    </button>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`${styles.notification} ${notificationType === 'remove' ? styles.notificationRemove : styles.notificationSuccess}`}>
                        {notificationType === 'success' ? (
                            <FaCheck className={styles.notificationIcon} />
                        ) : (
                            <FaTimes className={styles.notificationIcon} />
                        )}
                        <span>{notification}</span>
                    </div>
                )}

                {/* Content */}
                {cartItems.length > 0 ? (
                    <>
                        <div className={`${styles.itemsContainer}`}>
                            {cartItems.map((item) => (
                                <ProductCardModal
                                    key={item.id}
                                    item={item}
                                    showAddToCartButton={false}
                                    onRemove={handleRemoveItem}
                                    removeButtonTitle="حذف من السلة"
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.footer}>
                            <div className={styles.totalSection}>
                                <div className={styles.totalPrice}>
                                    <span className={styles.totalLabel}>الإجمالي:</span>
                                    <span className={styles.totalAmount}>
                                        {formatPrice(getTotalPrice())} جنيه
                                    </span>
                                </div>
                                <div className={styles.deliveryInfo}>
                                    <IoCheckmarkCircle className={styles.deliveryIcon} />
                                    <span>شحن مجاني للطلبات أكثر من 500 جنيه</span>
                                </div>
                            </div>
                            
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.clearBtn}
                                    onClick={handleClearCart}
                                >
                                    مسح السلة
                                </button>
                                <button 
                                    className={styles.checkoutBtn}
                                    onClick={handleCheckout}
                                >
                                    <HiOutlineShoppingBag />
                                    <span>إتمام الطلب</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FaShoppingCart />
                        </div>
                        <h3>سلة المشتريات فارغة</h3>
                        <p>لم تقم بإضافة أي منتجات لسلة المشتريات بعد</p>
                        <button 
                            className={styles.browseBtn}
                            onClick={handleBrowseProducts}
                        >
                            <HiOutlineShoppingBag />
                            <span>تصفح المنتجات</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
} 