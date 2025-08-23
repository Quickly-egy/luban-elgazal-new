import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

/**
 * Hook لجلب بيانات البنر من API
 */
export const useBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب جميع البنرات
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const result = await apiService.get('/products');
      
      if (result.success && result.data) {
        // فلترة المنتجات التي لها banner_image_url
        const bannersData = result.data.filter(product => 
          product.banner_image_url && product.banner_image_url.trim() !== ''
        );
        
        setBanners(bannersData);
        
        // اختيار بنر عشوائي للعرض
        if (bannersData.length > 0) {
          const randomIndex = Math.floor(Math.random() * bannersData.length);
          setCurrentBanner(bannersData[randomIndex]);
        }
        
        setError(null);
      } else {
        throw new Error(result.message || 'فشل في جلب البنرات');
      }
    } catch (err) {
      // console.error('Error fetching banners:', err);
      setError(err.message);
      setBanners([]);
      setCurrentBanner(null);
    } finally {
      setLoading(false);
    }
  };

  // تغيير البنر الحالي
  const switchBanner = (bannerId) => {
    const banner = banners.find(b => b.id === bannerId);
    if (banner) {
      setCurrentBanner(banner);
    }
  };

  // الحصول على بنر عشوائي
  const getRandomBanner = () => {
    if (banners.length > 0) {
      const randomIndex = Math.floor(Math.random() * banners.length);
      const randomBanner = banners[randomIndex];
      setCurrentBanner(randomBanner);
      return randomBanner;
    }
    return null;
  };

  // فلترة البنرات حسب فئة المنتج
  const getBannersByCategory = (categoryId) => {
    return banners.filter(banner => banner.category_id === categoryId);
  };

  // فحص وجود بنر للمنتج
  const hasBanner = (product) => {
    return product && product.banner_image_url && product.banner_image_url.trim() !== '';
  };

  // الحصول على رابط البنر
  const getBannerUrl = (product) => {
    return hasBanner(product) ? product.banner_image_url : null;
  };

  // إحصائيات البنرات
  const getBannerStats = () => {
    return {
      total: banners.length,
      categories: [...new Set(banners.map(b => b.category_id))].length,
      currentBanner: currentBanner ? currentBanner.id : null
    };
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    currentBanner,
    loading,
    error,
    fetchBanners,
    switchBanner,
    getRandomBanner,
    getBannersByCategory,
    hasBanner,
    getBannerUrl,
    getBannerStats
  };
};