import React from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';
import { IoCart } from 'react-icons/io5';
import styles from './ProductCardModal.module.css';
import { useCurrency } from '../../../hooks';

const ProductCardModal = ({
  item,
  showAddToCartButton = false,
  onRemove,
  onAddToCart,
  removeButtonTitle = "حذف",
  formatPrice: customFormatPrice
}) => {
  const { formatPrice: defaultFormatPrice } = useCurrency();
  const formatPrice = customFormatPrice || defaultFormatPrice;
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) onRemove(item.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(item.id);
  };

  return (
    <div className={styles.item}>
      {/* زر الحذف في أقصى الشمال */}
      <button
        className={styles.removeBtn}
        onClick={handleRemove}
        title={removeButtonTitle}
      >
        <FaTrash />
      </button>

      {/* تفاصيل المنتج على الشمال */}
      <div className={styles.itemInfo}>
        <h5 className={styles.itemName}>{item.name}</h5>
        <p className={styles.itemCategory}>{item.category}</p>

        {/* الأسعار تحت الكاتيجوري */}
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            {formatPrice(item.discountedPrice || item.price || 0)}
          </span>
          {item.originalPrice && item.originalPrice !== (item.discountedPrice || item.price) && (
            <span className={styles.originalPrice}>
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>

        {/* زر إضافة للسلة (فقط في المفضلة) */}
        {showAddToCartButton && (
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            <IoCart />
            <span>أضف للسلة</span>
          </button>
        )}
      </div>

      {/* صورة المنتج على اليمين مع التقييم تحتها */}
      <div className={styles.rightSection}>
        <div className={styles.imageContainer}>
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
      </div>
    </div>
  );
};

export default ProductCardModal; 