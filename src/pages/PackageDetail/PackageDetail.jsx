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

  // Find the package by id
  const packageData = packages?.find((pkg) => pkg.id === parseInt(id));

  useEffect(() => {
    // Simulate loading delay to avoid flash
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [packageData]);

  // Transform package data to product format for display
  const transformPackageData = (packageData) => {
    if (!packageData) return null;

    const displayPrice =
      packageData.calculated_price > 0
        ? packageData.calculated_price
        : parseFloat(packageData.total_price);

    // Get package images from products or use main_image_url
    const packageImages = [];

    // Add package main image if available
    if (packageData.main_image_url) {
      packageImages.push(packageData.main_image_url);
    }

    // Add secondary images if available
    if (
      packageData.secondary_image_urls &&
      Array.isArray(packageData.secondary_image_urls)
    ) {
      packageIma
      ges.push(...packageData.secondary_image_urls);
    }

    // Add product images as fallback
    if (packageData.products && packageData.products.length > 0) {
      packageData.products.forEach((product) => {
        if (
          product.main_image_url &&
          !packageImages.includes(product.main_image_url)
        ) {
          packageImages.push(product.main_image_url);
        }
        if (
          product.secondary_image_urls &&
          Array.isArray(product.secondary_image_urls)
        ) {
          product.secondary_image_urls.forEach((img) => {
            if (img && !packageImages.includes(img)) {
              packageImages.push(img);
            }
          });
        }
      });
    }

    // Ensure we have at least one image
    const displayImages =
      packageImages.length > 0
        ? packageImages
        : ["/images/default-package.jpg"];

    const originalPrice = parseFloat(packageData.total_price);
    const savings = originalPrice - displayPrice;
    const discountPercentage =
      savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;

    return {
      id: packageData.id,
      name: packageData.name,
      weight: "",
      brand: "لبان الغزال",
      originalPrice: originalPrice,
      salePrice: displayPrice,
      discountedPrice: displayPrice,
      selling_price: displayPrice,
      discount: discountPercentage,
      rating: packageData.reviews_info?.average_rating || 5,
      reviewsCount: packageData.reviews_info?.total_reviews || 0,
      inStock: packageData.is_active,
      sku: `PKG-${packageData.id}`,
      category: packageData.category?.name || "الباقات",
      categories: [packageData.category?.name || "الباقات"],
      features: [
        "باقة مميزة تحتوي على منتجات متنوعة",
        "توفير في السعر مقارنة بالشراء المنفصل",
        "منتجات أصلية 100%",
        "ضمان الجودة",
        "شحن مجاني للباقات",
      ],
      images: displayImages,
      main_image_url: displayImages[0],
      secondary_image_urls: displayImages.slice(1),
      specialOffers: [
        "شحن مجاني للطلبات أكثر من 500 جنيه",
        "ضمان استرداد المال خلال 30 يوم",
      ],
      description:
        packageData.description ||
        "باقة مميزة تحتوي على مجموعة من أفضل المنتجات المختارة بعناية لتوفر لك تجربة مثالية وقيمة أكبر.",
      label: { name: "باقة مميزة", color: "#00bd7e" },
      type: "package",
      products: packageData.products || [], // Keep the products for package display
      packageData: packageData, // Keep original package data
      reviews_info: packageData.reviews_info || {
        total_reviews: 0,
        average_rating: 5,
        rating_stars: "",
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        latest_reviews: [],
      },
      discount_info:
        savings > 0
          ? {
              has_discount: true,
              discount_percentage: discountPercentage,
              savings: savings.toFixed(2),
              active_discount: {
                type: "percentage",
                value: discountPercentage,
              },
            }
          : null,
    };
  };

  const transformedPackage = packageData
    ? transformPackageData(packageData)
    : null;

  if (loading) {
    return (
      <div className="package-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>جاري تحميل تفاصيل الباقة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData || !transformedPackage) {
    return (
      <div className="package-detail-page">
        <div className="container">
          <div className="not-found-state">
            <h2>الباقة غير موجودة</h2>
            <p>الباقة التي تبحث عنها غير متوفرة حالياً</p>
            <button
              onClick={() => window.history.back()}
              className="back-button"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      <div className="container">
        <div className="package-detail-content">
          {/* Package Gallery */}
          <div className="package-detail-left">
            <ProductGallery
              images={transformedPackage.images}
              productName={transformedPackage.name}
              discount={transformedPackage.discount}
              label={transformedPackage.label}
            />
          </div>

          {/* Package Info */}
          <div className="package-detail-right">
            <ProductInfo product={transformedPackage} />
          </div>
        </div>
      </div>

      {/* Package Description */}
      {transformedPackage.description && (
        <div className="package-description-section">
          <div className="container">
            <h2 className="description-title">وصف الباقة</h2>
            <div className="description-content">
              {/<[^>]*>/g.test(transformedPackage.description) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: transformedPackage.description,
                  }}
                />
              ) : (
                <p>{transformedPackage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <CashBack />
      <FrequentlyBought />
      <RelatedProducts currentProduct={transformedPackage} />
    </div>
  );
};

export default PackageDetail;
