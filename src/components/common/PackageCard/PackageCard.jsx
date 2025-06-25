import React from 'react';
import styles from './PackageCard.module.css';
import { Link } from 'react-router-dom';

const PackageCard = ({ packageData }) => {
  const {
    id,
    name,
    description,
    total_price,
    calculated_price,
    products,
    category,
    is_active
  } = packageData;

  if (!is_active) {
    return null;
  }

  const displayPrice = calculated_price > 0 ? calculated_price : total_price;

  return (
    <div className={styles.packageCard}>
      <div className={styles.packageHeader}>
        <h3 className={styles.packageName}>{name}</h3>
        {category && (
          <span className={styles.packageCategory}>{category.name}</span>
        )}
      </div>

      <div className={styles.packageDescription}>
        <p>{description}</p>
      </div>

      <div className={styles.productsPreview}>
        <h4>المنتجات المضمنة:</h4>
        <div className={styles.productsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <img 
                src={product.main_image_url} 
                alt={product.name}
                className={styles.productImage} 
              />
              <div className={styles.productInfo}>
                <span className={styles.productName}>{product.name}</span>
                <div className={styles.productDetails}>
                  <span className={styles.productQuantity}>
                    الكمية: {product.quantity}
                  </span>
                  <span className={styles.productPrice}>
                    {product.selling_price} ريال
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.packageFooter}>
        <div className={styles.priceSection}>
          <span className={styles.totalPrice}>
            السعر الإجمالي: {displayPrice} ريال
          </span>
          {calculated_price > 0 && calculated_price < total_price && (
            <span className={styles.savings}>
              وفرت: {(total_price - calculated_price).toFixed(2)} ريال
            </span>
          )}
        </div>
        <Link to={`/package/${id}`} className={styles.viewButton}>
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default PackageCard; 