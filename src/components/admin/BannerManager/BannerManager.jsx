import React, { useState } from 'react';
import { useBanner } from '../../../hooks/useBanner';
import { FaSpinner, FaRedo, FaEye, FaImage, FaInfoCircle } from 'react-icons/fa';
import './BannerManager.css';

/**
 * مكون إدارة البنرات - للاختبار والإدارة
 */
const BannerManager = () => {
  const { 
    banners,
    currentBanner,
    loading,
    error,
    switchBanner,
    getRandomBanner,
    getBannerStats,
    hasBanner,
    getBannerUrl,
    fetchBanners
  } = useBanner();

  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const stats = getBannerStats();

  const handleSwitchBanner = (bannerId) => {
    switchBanner(bannerId);
    setSelectedBannerId(bannerId);
  };

  if (loading) {
    return (
      <div className="banner-manager">
        <div className="loading-state">
          <FaSpinner className="fa-spin" />
          <span>جاري تحميل البنرات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="banner-manager">
        <div className="error-state">
          <FaInfoCircle />
          <span>خطأ: {error}</span>
          <button onClick={fetchBanners} className="retry-btn">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-manager">
      <div className="banner-header">
        <h2>إدارة البنرات الإعلانية</h2>
        <div className="banner-stats">
          <span>إجمالي البنرات: {stats.total}</span>
          <span>الفئات: {stats.categories}</span>
          <span>البنر الحالي: {currentBanner ? currentBanner.id : 'لا يوجد'}</span>
        </div>
      </div>

      <div className="banner-controls">
        <button 
          onClick={getRandomBanner}
          className="control-btn primary"
          disabled={banners.length === 0}
        >
          <FaRedo /> بنر عشوائي
        </button>
        <button 
          onClick={fetchBanners}
          className="control-btn secondary"
        >
          <FaSpinner /> إعادة تحميل
        </button>
      </div>

      {currentBanner && (
        <div className="current-banner-preview">
          <h3>البنر الحالي</h3>
          <div className="banner-preview-card">
            <div className="banner-image-preview">
              <img 
              loading="lazy"
                src={getBannerUrl(currentBanner)} 
                alt={currentBanner.name}
                onError={(e) => {
                  e.target.src = '/images/default-product.jpg';
                }}
              />
            </div>
            <div className="banner-info">
              <h4>{currentBanner.name}</h4>
              <p>{currentBanner.description ? currentBanner.description.substring(0, 150) + '...' : 'لا يوجد وصف'}</p>
              <span className="banner-id">ID: {currentBanner.id}</span>
            </div>
          </div>
        </div>
      )}

      <div className="banners-list">
        <h3>جميع البنرات المتاحة ({banners.length})</h3>
        
        {banners.length === 0 ? (
          <div className="no-banners">
            <FaImage />
            <span>لا توجد منتجات لها بنر إعلاني</span>
            <small>يجب إضافة banner_image_url للمنتجات في قاعدة البيانات</small>
          </div>
        ) : (
          <div className="banners-grid">
            {banners.map(banner => (
              <div 
                key={banner.id} 
                className={`banner-card ${currentBanner?.id === banner.id ? 'active' : ''}`}
                onClick={() => handleSwitchBanner(banner.id)}
              >
                <div className="banner-thumbnail">
                  <img 
                  loading="lazy"
                    src={getBannerUrl(banner)} 
                    alt={banner.name}
                    onError={(e) => {
                      e.target.src = '/images/default-product.jpg';
                    }}
                  />
                  {currentBanner?.id === banner.id && (
                    <div className="active-indicator">
                      <FaEye />
                    </div>
                  )}
                </div>
                <div className="banner-card-info">
                  <h5>{banner.name}</h5>
                  <span className="banner-sku">SKU: {banner.sku}</span>
                  <span className="banner-price">
                    {banner.prices?.sar?.price} {banner.prices?.sar?.symbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* معلومات تقنية للتشخيص */}
      <div className="banner-debug-info">
        <h4>معلومات تقنية</h4>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BannerManager;