import { MdOutlineClose } from "react-icons/md";
import styles from "./wishlistModal.module.css";
import {
  FaHeart,
  FaShoppingBag,
  FaCheck,
  FaTimes,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import useWishlistStore from "../../../../stores/wishlistStore";
import ProductCardModal from "../../ProductCardModal/ProductCardModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../../../hooks";
import useLocationStore from "../../../../stores/locationStore";

export default function WishlistModal({
  showWishlistModal,
  setShowWishlistModal,
}) {
  const { formatPrice } = useCurrency();
  // استخدام Zustand store
  const {
    wishlistItems,
    removeFromWishlist,
    moveToCart,
    getWishlistCount,
    moveAllToCart,
    clearWishlist,
  } = useWishlistStore();
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'remove'
  const navigate = useNavigate();

  const handleRemoveItem = (itemId) => {
    const item = wishlistItems.find((item) => item.id === itemId);
    removeFromWishlist(itemId);


    // إظهار إشعار الحذف
    if (item) {
      setNotificationType("remove");
      setNotification(`تم حذف "${item.name}" من المفضلة`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleMoveToCart = (itemId) => {
    const movedItem = moveToCart(itemId);
    if (movedItem) {

      // إظهار إشعار النجاح
      setNotificationType("success");
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
    navigate("/products"); // التوجه لصفحة المنتجات
  };

  const handleMoveAllToCart = () => {
    const result = moveAllToCart();
    if (result.success) {
      setNotificationType("success");
      setNotification(result.message);
    } else {
      setNotificationType("remove");
      setNotification(result.message);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) {
      setNotificationType("remove");
      setNotification("قائمة المفضلة فارغة بالفعل");
    } else {
      clearWishlist();
      setNotificationType("remove");
      setNotification("تم حذف جميع المنتجات من المفضلة");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // formatPrice is now provided by useCurrency hook

  return (
    <aside
      className={`${styles.sideBar} ${showWishlistModal ? styles.show : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.container}`}
        onClick={(e) => e.stopPropagation()}
      >
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
          <button
            className={`${styles.closeBtn}`}
            onClick={() => setShowWishlistModal(false)}
          >
            <MdOutlineClose />
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`${styles.notification} ${
              notificationType === "remove"
                ? styles.notificationRemove
                : styles.notificationSuccess
            }`}
          >
            {notificationType === "success" ? (
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
                  key={`wishlist-${item.id}-${useLocationStore.getState().countryCode}`}
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
              <button
                className={styles.moveAllBtn}
                onClick={handleMoveAllToCart}
                disabled={wishlistItems.length === 0}
              >
                <FaShoppingCart />
                <span>نقل الكل للسلة</span>
              </button>
              <button
                className={styles.clearAllBtn}
                onClick={handleClearWishlist}
                disabled={wishlistItems.length === 0}
              >
                <FaTrash />
                <span>حذف الكل</span>
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
  );
}
