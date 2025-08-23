// Cache Management Hook - Hook للإدارة المتقدمة للتخزين المؤقت
import { useState, useEffect, useCallback } from 'react';
import { cacheManager, cachedProductsAPI, cachedCategoriesAPI } from '../services/cachedAPI';
import cacheService from '../services/cacheService';

export const useCacheManager = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalSize: 0,
    expiredCount: 0,
    staleCount: 0,
    activeListeners: 0,
    backgroundTasks: 0
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // تحديث الإحصائيات
  const updateStats = useCallback(() => {
    const currentStats = cacheManager.getStats();
    setStats(currentStats);
  }, []);

  // تحديث الإحصائيات كل 30 ثانية
  useEffect(() => {
    updateStats(); // تحديث فوري
    
    const interval = setInterval(updateStats, 30000); // كل 30 ثانية
    
    return () => clearInterval(interval);
  }, [updateStats]);

  // مسح جميع الـ cache
  const clearAllCache = useCallback(() => {
    cacheManager.clearAll();
    updateStats();
  }, [updateStats]);

  // تنظيف البيانات منتهية الصلاحية
  const cleanupExpired = useCallback(() => {
    cacheManager.cleanupExpired();
    updateStats();
  }, [updateStats]);

  // فرض تحديث جميع البيانات
  const refreshAllData = useCallback(async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    
    try {
      
      const results = await cacheManager.refreshAll();
      
      setLastRefresh(new Date().toISOString());
      updateStats();
      
      return results;
    } catch (error) {
      // console.error('❌ Data refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, updateStats]);

  // تحديث المنتجات فقط
  const refreshProducts = useCallback(async (page = 1) => {
    try {
      const result = await cachedProductsAPI.refreshProductsCache(page);
      updateStats();
      return result;
    } catch (error) {
      // console.error(`❌ Products page ${page} refresh failed:`, error);
      throw error;
    }
  }, [updateStats]);

  // تحديث الفئات فقط
  const refreshCategories = useCallback(async () => {
    try {
      const result = await cachedCategoriesAPI.refreshCategoriesCache();
      updateStats();
      return result;
    } catch (error) {
      // console.error('❌ Categories refresh failed:', error);
      throw error;
    }
  }, [updateStats]);

  // مراقبة تحديثات cache معينة
  const watchCacheUpdates = useCallback((cacheKey, callback) => {
    
    const handleUpdate = (event) => {
      if (event.action === 'backgroundUpdate') {
        callback(event.data);
        updateStats(); // تحديث الإحصائيات عند التحديث
      }
    };

    cacheManager.onDataUpdate(cacheKey, handleUpdate);
    
    // إرجاع دالة لإيقاف المراقبة
    return () => {
      cacheManager.offDataUpdate(cacheKey, handleUpdate);
    };
  }, [updateStats]);

  // الحصول على معلومات cache معينة
  const getCacheInfo = useCallback((cacheKey) => {
    return cacheService.get(cacheKey);
  }, []);

  // حذف cache معينة
  const deleteCache = useCallback((cacheKey) => {
    const deleted = cacheService.delete(cacheKey);
    if (deleted) {
      updateStats();
    }
    return deleted;
  }, [updateStats]);

  // مراقبة حالة cache (مفيد للتطوير)
  const getCacheHealth = useCallback(() => {
    const totalCacheSize = stats.totalSize; // KB
    const expiredRatio = stats.totalEntries > 0 ? stats.expiredCount / stats.totalEntries : 0;
    const staleRatio = stats.totalEntries > 0 ? stats.staleCount / stats.totalEntries : 0;
    
    let health = 'good';
    let issues = [];
    
    if (totalCacheSize > 5000) { // أكثر من 5MB
      health = 'warning';
      issues.push('حجم الـ cache كبير (>5MB)');
    }
    
    if (expiredRatio > 0.3) { // أكثر من 30% منتهي الصلاحية
      health = 'warning';
      issues.push('نسبة عالية من البيانات منتهية الصلاحية');
    }
    
    if (staleRatio > 0.5) { // أكثر من 50% قديم
      health = 'info';
      issues.push('نسبة عالية من البيانات القديمة (stale)');
    }
    
    if (totalCacheSize > 10000) { // أكثر من 10MB
      health = 'critical';
      issues.push('حجم الـ cache مفرط (>10MB)');
    }
    
    return {
      health,
      issues,
      recommendations: getRecommendations(health, issues),
      stats: {
        totalSize: totalCacheSize,
        expiredRatio: Math.round(expiredRatio * 100),
        staleRatio: Math.round(staleRatio * 100),
        totalEntries: stats.totalEntries
      }
    };
  }, [stats]);

  // توصيات بناءً على حالة cache
  const getRecommendations = (health, issues) => {
    const recommendations = [];
    
    if (health === 'critical') {
      recommendations.push('امسح جميع البيانات المؤقتة فوراً');
      recommendations.push('تحقق من عدم وجود تسريب في memory');
    } else if (health === 'warning') {
      if (issues.some(issue => issue.includes('حجم'))) {
        recommendations.push('نظف البيانات منتهية الصلاحية');
      }
      if (issues.some(issue => issue.includes('منتهية الصلاحية'))) {
        recommendations.push('شغل cleanupExpired()');
      }
    }
    
    return recommendations;
  };

  return {
    // الإحصائيات
    stats,
    isRefreshing,
    lastRefresh,
    
    // الوظائف الأساسية
    clearAllCache,
    cleanupExpired,
    refreshAllData,
    refreshProducts,
    refreshCategories,
    
    // الوظائف المتقدمة
    updateStats,
    watchCacheUpdates,
    getCacheInfo,
    deleteCache,
    getCacheHealth,
    
    // معلومات مفيدة
    isHealthy: getCacheHealth().health === 'good',
    healthInfo: getCacheHealth()
  };
};

// Hook مبسط للاستخدام العادي
export const useSimpleCache = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStats, setCacheStats] = useState(null);

  // مراقبة حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // تحديث إحصائيات cache بسيطة
  useEffect(() => {
    const updateSimpleStats = () => {
      const stats = cacheManager.getStats();
      setCacheStats({
        hasCache: stats.totalEntries > 0,
        totalItems: stats.totalEntries,
        cacheSize: `${stats.totalSize}KB`
      });
    };
    
    updateSimpleStats();
    const interval = setInterval(updateSimpleStats, 60000); // كل دقيقة
    
    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    cacheManager.clearAll();
  }, []);

  return {
    isOnline,
    cacheStats,
    clearCache,
    hasCache: cacheStats?.hasCache || false
  };
};

export default useCacheManager; 