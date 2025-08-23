// Cached API Service - وسطاء API مع دعم التخزين المؤقت
import cacheService from './cacheService';
import { productAPI } from './endpoints';
import { productsAPI } from './api';

// Cached Products API
export const cachedProductsAPI = {
  // جلب المنتجات والباقات مع المراجعات - مع cache
  async getProductsWithReviews(page = 1, forceRefresh = false) {
    const cacheKey = `products_with_reviews_page_${page}`;
    
    // إذا كان forceRefresh true، احذف cache واجلب جديد
    if (forceRefresh) {
      cacheService.delete(cacheKey);
    }
    
    // دالة جلب البيانات من API
    const fetchFunction = async () => {
      const response = await productAPI.getProductsWithReviews(page);
      
      // 📋 طباعة response الـ API الخاص بجلب المنتجات من Cache
      
      if (!response?.success || !response?.data) {
        throw new Error("No valid data received from API");
      }
      
      return response;
    };
    
    // إعدادات cache مخصصة للمنتجات
    const cacheSettings = {
      maxAge: 20 * 60 * 1000,     // 20 دقيقة صالحية كاملة
      staleTime: 5 * 60 * 1000,   // 5 دقائق بعدها background sync
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    try {
      const result = await cacheService.getWithBackgroundSync(
        cacheKey, 
        fetchFunction, 
        cacheSettings
      );
      
      
      return {
        ...result.data,
        _cacheInfo: {
          fromCache: result.fromCache,
          isStale: result.isStale,
          age: result.age
        }
      };
    } catch (error) {
      // console.error(`❌ Failed to get products page ${page}:`, error);
      throw error;
    }
  },

  // إعادة تحميل cache للمنتجات
  async refreshProductsCache(page = 1) {
    return this.getProductsWithReviews(page, true);
  },

  // مسح cache المنتجات
  clearProductsCache() {
    // مسح جميع pages للمنتجات
    const keys = Object.keys(localStorage);
    const productCacheKeys = keys.filter(key => 
      key.includes('luban_elgazal_cache_products_with_reviews_page_')
    );
    
    productCacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
  }
};

// Cached Categories API
export const cachedCategoriesAPI = {
  // جلب فئات المنتجات - مع cache
  async getCategories(forceRefresh = false) {
    const cacheKey = 'product_categories';
    
    // إذا كان forceRefresh true، احذف cache واجلب جديد
    if (forceRefresh) {
      cacheService.delete(cacheKey);
    }
    
    // دالة جلب البيانات من API
    const fetchFunction = async () => {
      const response = await productsAPI.getCategories();
      
      if (!response.success || !response.data) {
        throw new Error("No valid categories data received from API");
      }
      
      return response;
    };
    
    // إعدادات cache مخصصة للفئات (cache أطول لأنها تتغير نادراً)
    const cacheSettings = {
      maxAge: 60 * 60 * 1000,     // ساعة واحدة صالحية كاملة
      staleTime: 30 * 60 * 1000,  // 30 دقيقة بعدها background sync
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    try {
      const result = await cacheService.getWithBackgroundSync(
        cacheKey, 
        fetchFunction, 
        cacheSettings
      );
      
      
      return {
        ...result.data,
        _cacheInfo: {
          fromCache: result.fromCache,
          isStale: result.isStale,
          age: result.age
        }
      };
    } catch (error) {
      // console.error('❌ Failed to get categories:', error);
      throw error;
    }
  },

  // إعادة تحميل cache للفئات
  async refreshCategoriesCache() {
    return this.getCategories(true);
  },

  // مسح cache الفئات
  clearCategoriesCache() {
    cacheService.delete('product_categories');
  }
};

// Cache Management Functions
export const cacheManager = {
  // إحصائيات عامة للـ cache
  getStats() {
    return cacheService.getStats();
  },

  // مسح جميع cache
  clearAll() {
    cacheService.clear();
  },

  // مسح cache منتهي الصلاحية فقط
  cleanupExpired() {
    const stats = cacheService.getStats();
    
    cacheService._cleanupOldEntries();
    
    const newStats = cacheService.getStats();
  },

  // مراقبة تحديثات البيانات
  onDataUpdate(key, callback) {
    cacheService.addListener(key, (event) => {
      if (event.action === 'backgroundUpdate') {
        callback(event.data);
      }
    });
  },

  // إيقاف مراقبة التحديثات
  offDataUpdate(key, callback) {
    cacheService.removeListener(key, callback);
  },

  // فرض إعادة تحميل كل البيانات
  async refreshAll() {
    
    try {
      // إعادة تحميل المنتجات والفئات بالتوازي
      const [products, categories] = await Promise.allSettled([
        cachedProductsAPI.refreshProductsCache(),
        cachedCategoriesAPI.refreshCategoriesCache()
      ]);
      
      const results = {
        products: products.status === 'fulfilled' ? 'success' : 'failed',
        categories: categories.status === 'fulfilled' ? 'success' : 'failed'
      };
      
      return results;
    } catch (error) {
      // console.error('❌ Refresh all failed:', error);
      throw error;
    }
  }
};

// Helper functions للاستخدام السهل
export const preloadCache = {
  // تحميل مسبق للبيانات الأساسية
  async preloadEssentials() {
    
    try {
      // تحميل البيانات بالتوازي
      const [categories, products] = await Promise.allSettled([
        cachedCategoriesAPI.getCategories(),
        cachedProductsAPI.getProductsWithReviews()
      ]);
      
      const results = {
        categories: categories.status === 'fulfilled',
        products: products.status === 'fulfilled'
      };
      
      return results;
    } catch (error) {
      // console.error('❌ Pre-loading failed:', error);
      return {
        categories: false,
        products: false
      };
    }
  }
};

export default {
  products: cachedProductsAPI,
  categories: cachedCategoriesAPI,
  manager: cacheManager,
  preload: preloadCache
}; 