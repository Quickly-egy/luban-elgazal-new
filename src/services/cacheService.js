// Cache Service - نظام التخزين المؤقت المتطور
// يطبق استراتيجية "Cache First + Background Sync"

class CacheService {
  constructor() {
    this.prefix = 'luban_elgazal_cache_';
    this.listeners = new Map(); // للمراقبة
    this.backgroundTasks = new Map(); // للمهام الخلفية
    
    // إعدادات افتراضية للـ cache
    this.defaultSettings = {
      maxAge: 30 * 60 * 1000,     // 30 دقيقة
      staleTime: 5 * 60 * 1000,   // 5 دقائق (بعدها نبدأ background sync)
      retryAttempts: 3,           // محاولات إعادة الطلب
      retryDelay: 1000,           // تأخير بين المحاولات
    };
  }

  // الحصول على مفتاح cache كامل
  _getCacheKey(key) {
    return `${this.prefix}${key}`;
  }

  // حفظ البيانات في cache
  set(key, data, customSettings = {}) {
    const settings = { ...this.defaultSettings, ...customSettings };
    const cacheKey = this._getCacheKey(key);
    
    const cacheData = {
      data,
      timestamp: Date.now(),
      maxAge: settings.maxAge,
      staleTime: settings.staleTime,
      version: 1, // لإدارة إصدارات البيانات
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`💾 Cache saved: ${key}`);
      
      // إشعار المراقبين
      this._notifyListeners(key, 'set', data);
      
      return true;
    } catch (error) {
      console.error(`❌ Cache save failed for ${key}:`, error);
      // محاولة تنظيف cache إذا امتلأ التخزين
      this._cleanupOldEntries();
      
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        return true;
      } catch (retryError) {
        console.error(`❌ Cache save retry failed for ${key}:`, retryError);
        return false;
      }
    }
  }

  // الحصول على البيانات من cache
  get(key) {
    const cacheKey = this._getCacheKey(key);
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        console.log(`📭 Cache miss: ${key}`);
        return null;
      }

      const cacheData = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheData.timestamp;

      // التحقق من انتهاء صلاحية البيانات
      if (age > cacheData.maxAge) {
        console.log(`⏰ Cache expired: ${key} (age: ${Math.round(age/1000)}s)`);
        this.delete(key);
        return null;
      }

      // التحقق إذا كانت البيانات "قديمة" لكن لا تزال صالحة
      const isStale = age > cacheData.staleTime;
      
      console.log(`💾 Cache hit: ${key} (age: ${Math.round(age/1000)}s, stale: ${isStale})`);
      
      return {
        data: cacheData.data,
        isStale,
        age,
        timestamp: cacheData.timestamp
      };
    } catch (error) {
      console.error(`❌ Cache read failed for ${key}:`, error);
      this.delete(key); // حذف البيانات التالفة
      return null;
    }
  }

  // حذف بيانات من cache
  delete(key) {
    const cacheKey = this._getCacheKey(key);
    
    try {
      localStorage.removeItem(cacheKey);
      console.log(`🗑️ Cache deleted: ${key}`);
      
      // إشعار المراقبين
      this._notifyListeners(key, 'delete', null);
      
      return true;
    } catch (error) {
      console.error(`❌ Cache delete failed for ${key}:`, error);
      return false;
    }
  }

  // الحصول على البيانات مع استراتيجية "Cache First + Background Sync"
  async getWithBackgroundSync(key, fetchFunction, settings = {}) {
    const finalSettings = { ...this.defaultSettings, ...settings };
    
    // محاولة الحصول على البيانات من cache أولاً
    const cached = this.get(key);
    
    if (cached) {
      // البيانات موجودة في cache
      console.log(`🎯 Serving from cache: ${key}`);
      
      // إذا كانت البيانات "قديمة" ولكن لا تزال صالحة، ابدأ background sync
      if (cached.isStale) {
        console.log(`🔄 Starting background sync for: ${key}`);
        this._performBackgroundSync(key, fetchFunction, finalSettings);
      }
      
      return {
        data: cached.data,
        fromCache: true,
        isStale: cached.isStale,
        age: cached.age
      };
    } else {
      // البيانات غير موجودة، جلبها مباشرة
      console.log(`🌐 Fetching fresh data: ${key}`);
      
      try {
        const freshData = await this._fetchWithRetry(fetchFunction, finalSettings);
        
        // حفظ البيانات الجديدة
        this.set(key, freshData, finalSettings);
        
        return {
          data: freshData,
          fromCache: false,
          isStale: false,
          age: 0
        };
      } catch (error) {
        console.error(`❌ Fresh fetch failed for ${key}:`, error);
        throw error;
      }
    }
  }

  // تنفيذ background sync
  async _performBackgroundSync(key, fetchFunction, settings) {
    // منع تشغيل عدة background sync للمفتاح نفسه
    if (this.backgroundTasks.has(key)) {
      console.log(`⏳ Background sync already running for: ${key}`);
      return;
    }

    this.backgroundTasks.set(key, true);
    
    try {
      console.log(`🔄 Background sync started: ${key}`);
      
      const freshData = await this._fetchWithRetry(fetchFunction, settings);
      
      // مقارنة البيانات الجديدة مع القديمة
      const cached = this.get(key);
      if (cached && this._dataChanged(cached.data, freshData)) {
        console.log(`🔄 Data changed, updating cache: ${key}`);
        this.set(key, freshData, settings);
        
        // إشعار المراقبين بالتحديث
        this._notifyListeners(key, 'backgroundUpdate', freshData);
      } else if (cached) {
        console.log(`✅ Data unchanged, refreshing timestamp: ${key}`);
        // تحديث timestamp فقط
        this.set(key, cached.data, settings);
      } else {
        // إذا تم حذف البيانات أثناء background sync
        console.log(`💾 Cache was cleared, saving fresh data: ${key}`);
        this.set(key, freshData, settings);
      }
      
      console.log(`✅ Background sync completed: ${key}`);
    } catch (error) {
      console.error(`❌ Background sync failed for ${key}:`, error);
    } finally {
      this.backgroundTasks.delete(key);
    }
  }

  // جلب البيانات مع إعادة المحاولة
  async _fetchWithRetry(fetchFunction, settings) {
    let lastError;
    
    for (let attempt = 1; attempt <= settings.retryAttempts; attempt++) {
      try {
        const data = await fetchFunction();
        
        if (attempt > 1) {
          console.log(`✅ Fetch succeeded on attempt ${attempt}`);
        }
        
        return data;
      } catch (error) {
        lastError = error;
        console.error(`❌ Fetch attempt ${attempt} failed:`, error);
        
        if (attempt < settings.retryAttempts) {
          const delay = settings.retryDelay * attempt; // exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // مقارنة البيانات للتحقق من التغيير
  _dataChanged(oldData, newData) {
    try {
      // مقارنة بسيطة باستخدام JSON
      const oldJson = JSON.stringify(oldData);
      const newJson = JSON.stringify(newData);
      return oldJson !== newJson;
    } catch (error) {
      console.error('❌ Data comparison failed:', error);
      return true; // افتراض التغيير في حالة الخطأ
    }
  }

  // تنظيف البيانات القديمة
  _cleanupOldEntries() {
    console.log('🧹 Cleaning up old cache entries...');
    
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
    
    let cleanedCount = 0;
    
    cacheKeys.forEach(cacheKey => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const cacheData = JSON.parse(cached);
          const age = Date.now() - cacheData.timestamp;
          
          if (age > cacheData.maxAge) {
            localStorage.removeItem(cacheKey);
            cleanedCount++;
          }
        }
      } catch (error) {
        // حذف البيانات التالفة
        localStorage.removeItem(cacheKey);
        cleanedCount++;
      }
    });
    
    console.log(`🧹 Cleaned ${cleanedCount} old cache entries`);
  }

  // إضافة مراقب للتغييرات
  addListener(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    console.log(`👂 Listener added for: ${key}`);
  }

  // إزالة مراقب
  removeListener(key, callback) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).delete(callback);
      
      if (this.listeners.get(key).size === 0) {
        this.listeners.delete(key);
      }
    }
  }

  // إشعار المراقبين
  _notifyListeners(key, action, data) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        try {
          callback({ key, action, data });
        } catch (error) {
          console.error(`❌ Listener callback failed for ${key}:`, error);
        }
      });
    }
  }

  // إحصائيات cache
  getStats() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
    
    let totalSize = 0;
    let expiredCount = 0;
    let staleCount = 0;
    const now = Date.now();
    
    cacheKeys.forEach(cacheKey => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          totalSize += cached.length;
          
          const cacheData = JSON.parse(cached);
          const age = now - cacheData.timestamp;
          
          if (age > cacheData.maxAge) {
            expiredCount++;
          } else if (age > cacheData.staleTime) {
            staleCount++;
          }
        }
      } catch (error) {
        // تجاهل البيانات التالفة
      }
    });
    
    return {
      totalEntries: cacheKeys.length,
      totalSize: Math.round(totalSize / 1024), // KB
      expiredCount,
      staleCount,
      activeListeners: this.listeners.size,
      backgroundTasks: this.backgroundTasks.size
    };
  }

  // مسح cache كاملاً
  clear() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
    
    console.log(`🗑️ Cleared ${cacheKeys.length} cache entries`);
    
    // إشعار جميع المراقبين
    this.listeners.forEach((callbacks, key) => {
      this._notifyListeners(key, 'clear', null);
    });
  }
}

// إنشاء instance وحيد (Singleton)
const cacheService = new CacheService();

export default cacheService;

// تصدير دوال مساعدة سهلة الاستخدام
export const cache = {
  // للمنتجات والباقات
  products: {
    get: () => cacheService.getWithBackgroundSync('products_with_reviews', null, { 
      maxAge: 20 * 60 * 1000, // 20 دقيقة
      staleTime: 5 * 60 * 1000 // 5 دقائق
    }),
    set: (data) => cacheService.set('products_with_reviews', data),
    clear: () => cacheService.delete('products_with_reviews')
  },
  
  // للفئات
  categories: {
    get: () => cacheService.getWithBackgroundSync('product_categories', null, {
      maxAge: 60 * 60 * 1000, // ساعة واحدة
      staleTime: 30 * 60 * 1000 // 30 دقيقة
    }),
    set: (data) => cacheService.set('product_categories', data),
    clear: () => cacheService.delete('product_categories')
  },

  // دوال عامة
  clear: () => cacheService.clear(),
  stats: () => cacheService.getStats(),
  addListener: (key, callback) => cacheService.addListener(key, callback),
  removeListener: (key, callback) => cacheService.removeListener(key, callback)
}; 