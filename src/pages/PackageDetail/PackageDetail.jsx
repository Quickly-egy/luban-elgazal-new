import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PackageGallery from '../../components/common/PackageGallery/PackageGallery';
import ProductInfo from '../../components/ProductDetail/ProductInfo/ProductInfo';
import useProductsStore from '../../stores/productsStore';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const { packages } = useProductsStore();
  
  useEffect(() => {
    // طباعة كل البيانات الخاصة بالباقات
    console.log('=== All Packages Data ===');
    console.log('Total Packages Count:', packages?.length || 0);
    console.log('All Packages:', packages);

    if (packages?.length > 0) {
      packages.forEach((pkg, index) => {
        console.log(`\n=== Package ${index + 1} Details ===`);
        console.log('ID:', pkg.id);
        console.log('Name:', pkg.name);
        console.log('Description:', pkg.description);
        console.log('Total Price:', pkg.total_price);
        console.log('Category:', pkg.category);
        console.log('Is Active:', pkg.is_active);
        console.log('Main Image URL:', pkg.main_image_url);
        console.log('Secondary Image URLs:', pkg.secondary_image_urls);
        console.log('Products:', pkg.products);
        console.log('------------------------');
      });
    } else {
      console.log('No packages found in the store');
    }
  }, [packages]);

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