import React from 'react';
import { useParams } from 'react-router-dom';
import PackageGallery from '../../components/common/PackageGallery/PackageGallery';
import ProductInfo from '../../components/ProductDetail/ProductInfo/ProductInfo';
import useProductsStore from '../../stores/productsStore';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const { packages } = useProductsStore();
  
  // Find the package by id
  const packageData = packages?.find(pkg => pkg.id === parseInt(id));

  if (!packageData) {
    return <div>جاري تحميل الباقة...</div>;
  }

  return (
    <div className="package-detail-page">
      <div className="container">
        <div className="package-detail-content">
          {/* Package Gallery */}
          <div className="package-detail-left">
            <PackageGallery packageData={packageData} />
          </div>

          {/* Package Info */}
          <div className="package-detail-right">
            <ProductInfo product={{
              ...packageData,
              type: 'package',
              selling_price: packageData.total_price,
              is_available: packageData.is_active,
              category: packageData.category?.name || '',
              description: packageData.description,
              inStock: packageData.is_active
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail; 