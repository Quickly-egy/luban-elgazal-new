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
      console.log(`🌐 Fetching products page ${page} from API...`);
      const response = await productAPI.getProductsWithReviews(page);
      
      if (!response?.success || !response?.data) {
        throw new Error("No valid data received from API");
      }
      
      console.log(`✅ Products page ${page} fetched successfully`);
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
      
      console.log(`📦 Products page ${page} served (cache: ${result.fromCache}, stale: ${result.isStale})`);
      
      return {
        ...result.data,
        _cacheInfo: {
          fromCache: result.fromCache,
          isStale: result.isStale,
          age: result.age
        }
      };
    } catch (error) {
      console.error(`❌ Failed to get products page ${page}:`, error);
      throw error;
    }
  },

  // إعادة تحميل cache للمنتجات
  async refreshProductsCache(page = 1) {
    console.log(`🔄 Force refreshing products cache for page ${page}...`);
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
    
    console.log(`🗑️ Cleared ${productCacheKeys.length} product cache entries`);
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
      console.log('🌐 Fetching categories from API...');
      const response = await productsAPI.getCategories();
      
      if (!response.success || !response.data) {
        throw new Error("No valid categories data received from API");
      }
      
      console.log('✅ Categories fetched successfully');
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
      
      console.log(`📂 Categories served (cache: ${result.fromCache}, stale: ${result.isStale})`);
      
      return {
        ...result.data,
        _cacheInfo: {
          fromCache: result.fromCache,
          isStale: result.isStale,
          age: result.age
        }
      };
    } catch (error) {
      console.error('❌ Failed to get categories:', error);
      throw error;
    }
  },

  // إعادة تحميل cache للفئات
  async refreshCategoriesCache() {
    console.log('🔄 Force refreshing categories cache...');
    return this.getCategories(true);
  },

  // مسح cache الفئات
  clearCategoriesCache() {
    cacheService.delete('product_categories');
    console.log('🗑️ Categories cache cleared');
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
    console.log('🗑️ All cache cleared');
  },

  // مسح cache منتهي الصلاحية فقط
  cleanupExpired() {
    const stats = cacheService.getStats();
    console.log(`🧹 Starting cleanup - Found ${stats.expiredCount} expired entries`);
    
    cacheService._cleanupOldEntries();
    
    const newStats = cacheService.getStats();
    console.log(`🧹 Cleanup completed - Remaining entries: ${newStats.totalEntries}`);
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
    console.log('🔄 Force refreshing all cached data...');
    
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
      
      console.log('🔄 Refresh all completed:', results);
      return results;
    } catch (error) {
      console.error('❌ Refresh all failed:', error);
      throw error;
    }
  }
};

// Helper functions للاستخدام السهل
export const preloadCache = {
  // تحميل مسبق للبيانات الأساسية
  async preloadEssentials() {
    console.log('⚡ Pre-loading essential data...');
    
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
      
      console.log('⚡ Pre-loading completed:', results);
      return results;
    } catch (error) {
      console.error('❌ Pre-loading failed:', error);
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