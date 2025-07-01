import React from "react";
import { FaStar, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import styles from "./ProductCardModal.module.css";
import { useCurrency } from "../../../hooks";
import useCartStore from "../../../stores/cartStore";
import useLocationStore from "../../../stores/locationStore";
import { calculateItemPriceByCountry } from "../../../utils/formatters";

const ProductCardModal = ({
  item,
  showAddToCartButton = false,
  onRemove,
  onAddToCart,
  removeButtonTitle = "حذف",
  formatPrice: customFormatPrice,
  showQuantityControls = false, // New prop to show quantity controls in cart
}) => {
  const { formatPrice: defaultFormatPrice } = useCurrency();
  const formatPrice = customFormatPrice || defaultFormatPrice;
  const { increaseQuantity, decreaseQuantity } = useCartStore();
  const { countryCode } = useLocationStore();

  // Debug log for item data
  console.log("🔍 ProductCardModal item data:", {
    id: item.id,
    name: item.name,
    image: item.image,
    main_image_url: item.main_image_url,
    type: item.type,
    hasImage: !!(item.image || item.main_image_url)
  });

  // Get current price using shared utility function
  const currentPrice = calculateItemPriceByCountry(item, countryCode);

  // Get original price for discount display
  const getOriginalPrice = React.useCallback(() => {
    if (item.prices && typeof item.prices === "object") {
      const currencyMapping = {
        SA: "sar",
        AE: "aed",
        QA: "qar",
        KW: "kwd",
        BH: "bhd",
        OM: "omr",
        USD: "usd",
      };

      const currencyCode = currencyMapping[countryCode?.toUpperCase()];
      const priceData = item.prices[currencyCode];

      if (
        priceData &&
        parseFloat(priceData.price) !==
          parseFloat(priceData.final_price || priceData.price)
      ) {
        return parseFloat(priceData.price);
      }
    }

    return item.originalPrice && item.originalPrice !== currentPrice
      ? item.originalPrice
      : null;
  }, [item, countryCode, currentPrice]);
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

        {/* الأسعار والكمية */}
        <div className={styles.priceContainer}>
          {showQuantityControls && item.quantity ? (
            <>
              <div className={styles.priceInfo}>
                <div className={styles.unitPrice}>
                  <span className={styles.priceLabel}>سعر الوحدة:</span>
                  <span className={styles.currentPrice}>
                    {formatPrice(currentPrice)}
                  </span>
                </div>
                <div className={styles.totalPrice}>
                  <span className={styles.priceLabel}>المجموع:</span>
                  <span className={styles.totalAmount}>
                    {formatPrice(currentPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className={styles.currentPrice}>
                {formatPrice(currentPrice)}
              </span>
              {getOriginalPrice() && (
                <span className={styles.originalPrice}>
                  {formatPrice(getOriginalPrice())}
                </span>
              )}
            </>
          )}
        </div>

        {/* أزرار التحكم في الكمية */}
        {showQuantityControls && (
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                decreaseQuantity(item.id);
              }}
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </button>
            <span className={styles.quantityDisplay}>{item.quantity}</span>
            <button
              className={styles.quantityBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                increaseQuantity(item.id);
              }}
            >
              <FaPlus />
            </button>
          </div>
        )}

        {/* زر إضافة للسلة (فقط في المفضلة) */}
        {showAddToCartButton && (
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            title="إضافة المنتج إلى سلة التسوق"
          >
            <IoCart size={16} />
            <span>أضف للسلة</span>
          </button>
        )}
      </div>

      {/* صورة المنتج على اليمين مع التقييم تحتها */}
      <div className={styles.rightSection}>
        <div className={styles.imageContainer}>
          <img
            src={item.image || item.main_image_url || "/images/default-product.jpg"}
            alt={item.name}
            onError={(e) => {
              console.log("❌ Image load error for item:", {
                id: item.id,
                name: item.name,
                image: item.image,
                main_image_url: item.main_image_url,
                type: item.type
              });
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className={styles.imagePlaceholder} style={{ display: "none" }}>
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
                className={
                  index < item.rating ? styles.starFilled : styles.starEmpty
                }
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
