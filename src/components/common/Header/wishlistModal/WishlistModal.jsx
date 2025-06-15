import { MdOutlineClose } from 'react-icons/md';
import styles from './wishlistModal.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'
import { FaStar, FaTrash, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { GrStatusGood } from 'react-icons/gr';
import { IoCart } from 'react-icons/io5';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import useWishlistStore from '../../../../stores/wishlistStore';

export default function WishlistModal({ showWishlistModal, setShowWishlistModal }) {
    // استخدام Zustand store
    const { wishlistItems, removeFromWishlist, moveToCart, getWishlistCount } = useWishlistStore();

    const handleRemoveItem = (itemId) => {
        removeFromWishlist(itemId);
        console.log('تم حذف المنتج من المفضلة');
    };

    const handleMoveToCart = (itemId) => {
        const movedItem = moveToCart(itemId);
        if (movedItem) {
            console.log('تم نقل المنتج للسلة:', movedItem.name);
            // يمكن إضافة إشعار هنا
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowWishlistModal(false);
        }
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

                {/* Content */}
                {wishlistItems.length > 0 ? (
                    <>
                        <div className={`${styles.itemsContainer}`}>
                            {wishlistItems.map((item) => (
                                <div key={item.id} className={`${styles.item}`}>
                                    <div className={`${styles.imageContainer}`}>
                                        <img src={item.image} alt={item.name} />
                                        {item.discount && (
                                            <div className={styles.discountBadge}>
                                                -{item.discount}%
                                            </div>
                                        )}
                                    </div>
                                    
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
                            <span className={styles.currentPrice}>{item.price} جنيه</span>
                            {item.originalPrice && (
                                <span className={styles.originalPrice}>{item.originalPrice} جنيه</span>
                            )}
                        </div>

                                        <div className={styles.stockStatus}>
                                            <GrStatusGood className={styles.statusIcon} />
                                            <span>متوفر في المخزن</span>
                                        </div>

                                        <div className={`${styles.buttonsContainer}`}>
                                            <button 
                                                className={styles.removeBtn}
                                                onClick={() => handleRemoveItem(item.id)}
                                                title="حذف من المفضلة"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button 
                                                className={styles.addToCartBtn}
                                                onClick={() => handleMoveToCart(item.id)}
                                            >
                                                <IoCart />
                                                <span>أضف للسلة</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className={styles.footer}>
                            <button className={styles.viewAllBtn}>
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
                            onClick={() => setShowWishlistModal(false)}
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
