import { MdOutlineClose } from 'react-icons/md';
import styles from './wishlistModal.module.css';
import { FaHeart, FaShoppingBag, FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import useWishlistStore from '../../../../stores/wishlistStore';
import ProductCardModal from '../../ProductCardModal/ProductCardModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WishlistModal({ showWishlistModal, setShowWishlistModal }) {
    // استخدام Zustand store
    const { wishlistItems, removeFromWishlist, moveToCart, getWishlistCount } = useWishlistStore();
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState('success'); // 'success' or 'remove'
    const navigate = useNavigate();

    const handleRemoveItem = (itemId) => {
        const item = wishlistItems.find(item => item.id === itemId);
        removeFromWishlist(itemId);
        console.log('تم حذف المنتج من المفضلة');
        
        // إظهار إشعار الحذف
        if (item) {
            setNotificationType('remove');
            setNotification(`تم حذف "${item.name}" من المفضلة`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleMoveToCart = (itemId) => {
        const movedItem = moveToCart(itemId);
        if (movedItem) {
            console.log('تم نقل المنتج للسلة:', movedItem.name);
            // إظهار إشعار النجاح
            setNotificationType('success');
            setNotification(`تم نقل "${movedItem.name}" للسلة بنجاح!`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowWishlistModal(false);
        }
    };

    const handleViewAllProducts = () => {
        setShowWishlistModal(false); // إغلاق المودال
        navigate('/products'); // التوجه لصفحة المنتجات
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ar-EG').format(price);
    };

    return (
        <aside className={`${styles.sideBar} ${showWishlistModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={`${styles.container}`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={`${styles.header}`}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaHeart />
                        </div>
                        <div className={styles.headerText}>
                            <h3>قائمة المفضلة</h3>
                            <p>{wishlistItems.length} منتج</p>
                        </div>
                    </div>
                    <button className={`${styles.closeBtn}`} onClick={() => setShowWishlistModal(false)}>
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
                {wishlistItems.length > 0 ? (
                    <>
                        <div className={`${styles.itemsContainer}`}>
                            {wishlistItems.map((item) => (
                                <ProductCardModal
                                    key={item.id}
                                    item={item}
                                    showAddToCartButton={true}
                                    onRemove={handleRemoveItem}
                                    onAddToCart={handleMoveToCart}
                                    removeButtonTitle="حذف من المفضلة"
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.footer}>
                            <button className={styles.viewAllBtn} onClick={handleViewAllProducts}>
                                <HiOutlineShoppingBag />
                                <span>عرض جميع المنتجات</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FaHeart />
                        </div>
                        <h3>قائمة المفضلة فارغة</h3>
                        <p>لم تقم بإضافة أي منتجات لقائمة المفضلة بعد</p>
                        <button 
                            className={styles.browseBtn}
                            onClick={handleViewAllProducts}
                        >
                            <FaShoppingBag />
                            <span>تصفح المنتجات</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
