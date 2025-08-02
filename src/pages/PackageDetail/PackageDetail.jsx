import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PackageGallery from "../../components/common/PackageGallery/PackageGallery";
import ProductInfo from "../../components/ProductDetail/ProductInfo/ProductInfo";
import useProductsStore from "../../stores/productsStore";
import useLocationStore from "../../stores/locationStore";
import { getPriceForCountry } from "../../utils/formatters";
import CashBack from "../../components/CashBack/CashBack";
import "./PackageDetail.css";
import FooterBanner from "../ProductDetail/FooterBanner";

const PackageDetail = () => {
  const { id } = useParams();
  const { packages } = useProductsStore();
  const { countryCode } = useLocationStore();
  const [loading, setLoading] = useState(true);

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

    // استخدام نفس منطق حساب السعر المستخدم في PackageCard
    let displayPrice, originalPrice, savings, discountPercentage;

    // أولاً، محاولة استخدام prices object
    if (packageData.prices && typeof packageData.prices === "object" && countryCode) {
      const currencyMapping = {
        SA: "sar",
        AE: "aed",
        QA: "qar",
        KW: "kwd",
        BH: "bhd",
        OM: "omr",
        USD: "usd",
      };

      const currencyCodeKey = currencyMapping[countryCode.toUpperCase()];
      const priceData = packageData.prices[currencyCodeKey];

      if (priceData && priceData.price) {
        originalPrice = parseFloat(priceData.price);
        displayPrice = parseFloat(priceData.final_price || priceData.price);
        savings = originalPrice - displayPrice;
        discountPercentage = savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;
      } else {
        // Fallback إذا لم تتوفر أسعار للدولة الحالية
        originalPrice = parseFloat(packageData.total_price);
        displayPrice = packageData.calculated_price > 0 
          ? parseFloat(packageData.calculated_price) 
          : originalPrice;
        savings = originalPrice - displayPrice;
        discountPercentage = savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;
      }
    } else {
      // Fallback للطريقة القديمة
      originalPrice = parseFloat(packageData.total_price);
      displayPrice = packageData.calculated_price > 0 
        ? parseFloat(packageData.calculated_price) 
        : originalPrice;
      savings = originalPrice - displayPrice;
      discountPercentage = savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;
    }

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
      packageImages.push(...packageData.secondary_image_urls);
    }

    // عدم إضافة صور المنتجات - عرض صور الباقة فقط

    // Ensure we have at least one image
    const displayImages =
      packageImages.length > 0
        ? packageImages
        : ["/images/default-package.jpg"];


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
      image: displayImages[0], // إضافة image للسلة
      main_image_url: displayImages[0],
      secondary_image_urls: displayImages.slice(1),
      specialOffers: [
        "شحن مجاني للطلبات أكثر من 200 جنيه",
        "ضمان استرداد المال خلال 30 يوم",
      ],
      description:
        packageData.description ||
        "باقة مميزة تحتوي على مجموعة من أفضل المنتجات المختارة بعناية لتوفر لك تجربة مثالية وقيمة أكبر.",
      label: { name: "باقة مميزة", color: "#00bd7e" },
      type: "package",
      products: packageData.products || [], // Keep the products for package display
      packageData: packageData, // Keep original package data
      prices: packageData.prices, // إضافة prices للاستخدام في ProductInfo
      // إضافة discount_details من packageData للتايمر
      discount_details: packageData.discount_details || null,
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
            <PackageGallery
              packageData={{
                name: transformedPackage.name,
                main_image_url: transformedPackage.main_image_url,
                secondary_image_urls: transformedPackage.secondary_image_urls
              }}
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
{/*  */}
      {/* <CashBack /> */}
      <FooterBanner/>
    </div>
  );
};

export default PackageDetail;
