import React, { useState } from "react";
import "./FooterBanner.css";
import bannerImg from "../../assets/images/banner.png"; // fallback image
import { useBanner } from "../../hooks/useBanner";
import { FaSpinner, FaRedo } from "react-icons/fa";

const FooterAdBanner = () => {
  const [visible, setVisible] = useState(true);
  const { 
    currentBanner, 
    loading, 
    error, 
    getRandomBanner, 
    getBannerStats,
    banners 
  } = useBanner();

  if (!visible) return null;

  // إذا كان يوجد خطأ أو لا يوجد بنرات، استخدم البنر الافتراضي
  const shouldShowDefault = error || !currentBanner || loading;
  const bannerImage = shouldShowDefault ? bannerImg : currentBanner.banner_image_url;
  const productName = currentBanner ? currentBanner.name : '';

  return (
    <div className="footer-banner-wrapper">
      <div
        className="footer-banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-overlay">
          <div className="banner-text">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaSpinner className="fa-spin" />
                <span>جاري تحميل البنر...</span>
              </div>
            ) : currentBanner ? (
              <>
                <h2>{currentBanner.name}</h2>
                {currentBanner.description && (
                  <p>{currentBanner.description.substring(0, 100)}...</p>
                )}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="banner-button"
                    onClick={() => window.location.href = `/products/${currentBanner.id}`}
                  >
                    عرض المنتج
                  </button>
                  {banners.length > 1 && (
                    <button
                      className="banner-button"
                      style={{ backgroundColor: '#6c757d' }}
                      onClick={getRandomBanner}
                      title="عرض بنر آخر"
                    >
                      <FaRedo />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>اكتشف منتجاتنا المميزة</h2>
                <p>تسوق الآن واحصل على أفضل العروض</p>
                <button
                  className="banner-button"
                  onClick={() => window.location.href = "/products"}
                >
                  اكتشف المزيد
                </button>
              </>
            )}
          </div>
          
          {/* معلومات إضافية للتشخيص في وضع التطوير */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              البنرات: {getBannerStats().total} | الحالي: {currentBanner ? currentBanner.id : 'افتراضي'}
            </div>
          )}
          
          <span className="banner-close" onClick={() => setVisible(false)}>
            &times;
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterAdBanner;
