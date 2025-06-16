import { MdOutlineClose } from 'react-icons/md';
import styles from './wishlistModal.module.css';
import { FaStar, FaTrash, FaHeart, FaShoppingBag, FaCheck, FaTimes } from 'react-icons/fa';
import { IoCart } from 'react-icons/io5';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import useWishlistStore from '../../../../stores/wishlistStore';
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
                                <div key={item.id} className={`${styles.item}`}>
                                    {/* زر الحذف في أقصى الشمال */}
                                    <button 
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveItem(item.id)}
                                        title="حذف من المفضلة"
                                    >
                                        <FaTrash />
                                    </button>

                                    {/* تفاصيل المنتج على الشمال */}
                                    <div className={`${styles.itemInfo}`}>
                                        <h5 className={styles.itemName}>{item.name}</h5>
                                        <p className={styles.itemCategory}>{item.category}</p>
                                        
                                        <div className={styles.ratingContainer}>
                                            <div className={styles.stars}>
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar 
                                                        key={index}
                                                        className={index < item.rating ? styles.starFilled : styles.starEmpty} 
                                                    />
                                                ))}
                                            </div>
                                            <span className={styles.reviewCount}>({item.reviewsCount})</span>
                                        </div>

                                        <div className={styles.priceContainer}>
                                            <span className={styles.currentPrice}>
                                                {item.discountedPrice || item.price || 0} جنيه
                                            </span>
                                            {item.originalPrice && item.originalPrice !== (item.discountedPrice || item.price) && (
                                                <span className={styles.originalPrice}>{item.originalPrice} جنيه</span>
                                            )}
                                        </div>

                                        <button 
                                            className={styles.addToCartBtn}
                                            onClick={() => handleMoveToCart(item.id)}
                                        >
                                            <IoCart />
                                            <span>أضف للسلة</span>
                                        </button>
                                    </div>

                                    {/* صورة المنتج على اليمين */}
                                    <div className={`${styles.imageContainer}`}>
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                                            صورة المنتج
                                        </div>
                                        {item.discountPercentage && (
                                            <div className={styles.discountBadge}>
                                                -{item.discountPercentage}%
                                            </div>
                                        )}
                                    </div>
                                </div>
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
