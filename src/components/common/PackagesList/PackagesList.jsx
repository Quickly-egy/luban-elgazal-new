import React from 'react';
import styles from './PackagesList.module.css';
import PackageCard from '../PackageCard/PackageCard';
import useProductsStore from '../../../stores/productsStore';

const PackagesList = () => {
  const packages = useProductsStore((state) => state.packages);
  const loading = useProductsStore((state) => state.loading);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>جاري تحميل الباقات...</p>
      </div>
    );
  }

  if (!packages.length) {
    return (
      <div className={styles.emptyState}>
        <p>لا توجد باقات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className={styles.packagesContainer}>
      <h2 className={styles.sectionTitle}>الباقات المتاحة</h2>
      <div className={styles.packagesGrid}>
        {packages.map((packageItem) => (
          <PackageCard key={packageItem.id} packageData={packageItem} />
        ))}
      </div>
    </div>
  );
};

export default PackagesList; 