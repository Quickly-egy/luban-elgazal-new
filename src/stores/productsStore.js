import { create } from "zustand";
import { productAPI } from "../services/endpoints";
import { productsAPI } from "../services/api";
import { cachedProductsAPI, cacheManager } from "../services/cachedAPI";

const useProductsStore = create((set, get) => ({
  // States
  allProducts: [],
  filteredProducts: [],
  categories: [],
  packages: [],
  page: 1,
  totalPages: 1,
  filters: {
    category: "",
    priceRange: [0, 10000],
    rating: 0,
    searchTerm: "",
  },
  loading: false,
  error: null,
  isSearching: false,
  isInitialLoad: true,
  products: [],
  isLoading: false,
  cachedProducts: [],
  
  // Cache info للمراقبة
  cacheInfo: {
    fromCache: false,
    isStale: false,
    age: 0,
    lastUpdate: null
  },

  // Transform package data
  transformPackage: (apiPackage) => {
    const displayPrice = apiPackage.calculated_price > 0 
      ? parseFloat(apiPackage.calculated_price) 
      : parseFloat(apiPackage.total_price);

    // Add discount_details from API if available
    let discount_details = apiPackage.discount_details || null;
    
    // If the package has scheduled discount timing, ensure proper structure
    if (discount_details && discount_details.timing_type === "scheduled") {
      discount_details = {
        ...discount_details,
        type: discount_details.type || "percentage",
        value: discount_details.value || "0",
        timing_type: "scheduled",
        start_at: discount_details.start_at,
        end_at: discount_details.end_at,
        final_price: discount_details.final_price || displayPrice,
        discount_amount: discount_details.discount_amount || 0
      };
    }
    
    // TEST: Add temporary scheduled discount for package ID 14 (remove this after API is updated)
    if (apiPackage.id === 14 && !discount_details) {
      discount_details = {
        type: "fixed",
        value: "35.00",
        timing_type: "scheduled",
        start_at: "2025-06-30 12:00:00",
        end_at: "2025-07-02 03:52:00",
        final_price: displayPrice - 35,
        discount_amount: 35
      };
    }
      
    return {
      id: apiPackage.id,
      name: apiPackage.name,
      description: apiPackage.description,
      total_price: apiPackage.total_price,
      calculated_price: apiPackage.calculated_price,
      prices: apiPackage.prices || null,
      discount_details: discount_details,
      price_sar: apiPackage.price_sar,
      price_aed: apiPackage.price_aed,
      price_qar: apiPackage.price_qar,
      price_kwd: apiPackage.price_kwd,
      price_bhd: apiPackage.price_bhd,
      price_omr: apiPackage.price_omr,
      price_usd: apiPackage.price_usd,
      selling_price: displayPrice,
      price: displayPrice,
      discountedPrice: displayPrice,
      originalPrice: parseFloat(apiPackage.total_price),
      type: 'package',
      isPackage: true,
      product_category_id: apiPackage.product_category_id,
      is_active: apiPackage.is_active,
      inStock: apiPackage.is_active,
      created_at: apiPackage.created_at,
      updated_at: apiPackage.updated_at,
      deleted_at: apiPackage.deleted_at,
      main_image: apiPackage.main_image,
      main_image_url: apiPackage.main_image_url,
      image: apiPackage.main_image_url,
      secondary_images: apiPackage.secondary_images,
      secondary_image_urls: apiPackage.secondary_image_urls || [],
      products: apiPackage.products ? apiPackage.products.map((product) => ({
        ...get().transformProduct(product),
        quantity: product.pivot?.quantity || product.quantity || 1,
      })) : [],
      category: apiPackage.category?.name || "الباقات",
      rating: apiPackage.active_reviews_avg_rating || 5,
      reviewsCount: apiPackage.active_reviews_count || 0,
      reviews_info: apiPackage.reviews_info || {
        total_reviews: apiPackage.active_reviews_count || 0,
        average_rating: apiPackage.active_reviews_avg_rating || 5,
        rating_stars: "",
        rating_distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        latest_reviews: apiPackage.active_reviews || [],
      },
    };
  },

  setPage: (newPage) => {
    if (typeof newPage === 'number' && !isNaN(newPage)) {
      set({ page: newPage });
    }
  },

  // Transform API product data to match ProductCard expected format
  transformProduct: (apiProduct) => {
    const reviewsInfo = {
      total_reviews: apiProduct.active_reviews_count || 0,
      average_rating: apiProduct.active_reviews_avg_rating || 0,
      rating_distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      latest_reviews: apiProduct.active_reviews || [],
    };

    const warehouseInfo = {
      total_available: apiProduct.total_warehouse_quantity || 0,
      total_quantity: apiProduct.total_warehouse_quantity || 0,
      total_sold: 0,
    };

    const basePrice = parseFloat(apiProduct.selling_price || 0);

    const hasDiscount =
      apiProduct.discount_details &&
      (apiProduct.discount_details.type === "percentage" ||
        apiProduct.discount_details.type === "fixed") &&
      parseFloat(apiProduct.discount_details.value) > 0;

    const discountDetails = hasDiscount
      ? {
          ...apiProduct.discount_details,
          final_price: parseFloat(
            apiProduct.discount_details.final_price || basePrice
          ),
          value: parseFloat(apiProduct.discount_details.value || 0),
          type: apiProduct.discount_details.type,
          discount_amount: parseFloat(
            apiProduct.discount_details.discount_amount || 0
          ),
          end_at: apiProduct.discount_details.end_at,
        }
      : null;

    const isAvailable =
      apiProduct.is_available && apiProduct.total_warehouse_quantity > 0;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: apiProduct.weight,
      image: apiProduct.main_image_url,
      main_image_url: apiProduct.main_image_url,
      selling_price: basePrice,
      discount_details: discountDetails,
      prices: apiProduct.prices || null,
      price_sar: apiProduct.price_sar,
      price_aed: apiProduct.price_aed,
      price_qar: apiProduct.price_qar,
      price_kwd: apiProduct.price_kwd,
      price_bhd: apiProduct.price_bhd,
      price_omr: apiProduct.price_omr,
      rating: reviewsInfo.average_rating || 0,
      reviewsCount: reviewsInfo.total_reviews || 0,
      inStock: isAvailable,
      category: apiProduct.category?.name || "غير محدد",
      description: apiProduct.description,
      sku: apiProduct.sku,
      label: apiProduct.label || null,
      secondary_image_urls: apiProduct.secondary_image_urls || [],
      stock_info: {
        in_stock: isAvailable,
        total_quantity: apiProduct.total_warehouse_quantity || 0,
        total_sold: warehouseInfo.total_sold || 0,
        total_available: apiProduct.total_warehouse_quantity || 0,
      },
      reviews_info: reviewsInfo,
      is_available: apiProduct.is_available,
      total_warehouse_quantity: apiProduct.total_warehouse_quantity || 0,
      created_at: apiProduct.created_at,
      valid_discounts: apiProduct.valid_discounts || [],
    };
  },

  // Apply filters to products
  applyFilters: (products, currentFilters) => {
    let filtered = [...products];

    if (currentFilters.category) {
      filtered = filtered.filter(
        (product) => product.category === currentFilters.category
      );
    }

    if (
      currentFilters.priceRange[0] > 0 ||
      currentFilters.priceRange[1] < 10000
    ) {
      filtered = filtered.filter(
        (product) =>
          product.discountedPrice >= currentFilters.priceRange[0] &&
          product.discountedPrice <= currentFilters.priceRange[1]
      );
    }

    if (currentFilters.rating > 0) {
      filtered = filtered.filter(
        (product) => product.rating >= currentFilters.rating
      );
    }

    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });

    return filtered;
  },

  // Actions
  setFilters: (newFilters) => {
    set({
      filters: newFilters,
      isInitialLoad: false,
    });

    const { allProducts, applyFilters } = get();
    const filtered = applyFilters(allProducts, newFilters);
    set({ filteredProducts: filtered });
  },

  // Load all products and packages with reviews - NOW WITH CACHING
  loadProducts: async () => {
    const { transformProduct, transformPackage, page } = get();

    set({ loading: true, error: null });

    try {
      console.log(`📦 Loading products with cache-first strategy (page: ${page})...`);
      
      // استخدام الـ cached API بدلاً من الـ API المباشر
      const response = await cachedProductsAPI.getProductsWithReviews(page);
      
      // 📋 طباعة response الـ API الخاص بجلب المنتجات
      console.log('📋 Products API Response (/products):');
      console.log(JSON.stringify(response, null, 2));

      if (!response?.success || !response?.data) {
        throw new Error("No valid data received from API");
      }

      const apiProducts = response.data.products?.data || [];
      const apiPackages = response.data.packages || [];
      const lastPage = response.data.products.last_page || 4;

      const transformedProducts = apiProducts.map(transformProduct);
      const transformedPackages = apiPackages.map(transformPackage);

      const availableProducts = transformedProducts.filter(p => p.is_available);
      const categories = [...new Set(availableProducts.map(p => p.category))];

      // حفظ معلومات الـ cache
      const cacheInfo = response._cacheInfo || {
        fromCache: false,
        isStale: false,
        age: 0
      };

      set({
        allProducts: availableProducts,
        filteredProducts: availableProducts,
        categories: categories,
        packages: transformedPackages,
        isInitialLoad: true,
        loading: false,
        totalPages: lastPage,
        cacheInfo: {
          ...cacheInfo,
          lastUpdate: new Date().toISOString()
        }
      });

      console.log(`✅ Products loaded successfully (fromCache: ${cacheInfo.fromCache}, products: ${availableProducts.length}, packages: ${transformedPackages.length})`);
      
      // إذا كانت البيانات من cache وقديمة، أشعر المستخدم (اختياري)
      if (cacheInfo.fromCache && cacheInfo.isStale) {
        console.log('🔄 Data is from cache but stale, background update is running...');
      }

    } catch (error) {
      console.error('❌ Failed to load products:', error);
      
      set({
        error: "فشل في تحميل المنتجات والباقات. يرجى المحاولة مرة أخرى.",
        allProducts: [],
        filteredProducts: [],
        categories: [],
        packages: [],
        isInitialLoad: false,
        loading: false,
        cacheInfo: {
          fromCache: false,
          isStale: false,
          age: 0,
          lastUpdate: null
        }
      });
    }
  },

  // Force refresh products cache
  forceRefreshProducts: async () => {
    const { page } = get();
    console.log('🔄 Force refreshing products cache...');
    
    set({ loading: true });
    
    try {
      await cachedProductsAPI.refreshProductsCache(page);
      await get().loadProducts(); // إعادة تحميل البيانات
      console.log('✅ Products cache refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh products cache:', error);
      set({ 
        loading: false,
        error: "فشل في تحديث البيانات. يرجى المحاولة مرة أخرى."
      });
    }
  },

  // البحث المحسن مع دعم cache
  searchProducts: (query) => {
    const { allProducts, packages, filters, applyFilters } = get();

    if (!query || query.trim() === "") {
      const filtered = applyFilters(allProducts, filters);
      set({ filteredProducts: filtered });
      return filtered;
    }

    const searchTerm = query.trim().toLowerCase();

    const matchedProducts = allProducts.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
      return nameMatch || descriptionMatch || categoryMatch;
    });

    const matchedPackages = packages.filter((pkg) => {
      const nameMatch = pkg.name?.toLowerCase().includes(searchTerm);
      const descriptionMatch = pkg.description?.toLowerCase().includes(searchTerm);
      const categoryMatch = pkg.category?.toLowerCase().includes(searchTerm);
      return nameMatch || descriptionMatch || categoryMatch;
    });

    const results = [...matchedProducts, ...matchedPackages];
    set({ filteredProducts: results });
    return results;
  },

  // Clear error and reload if no products
  clearError: () => {
    set({ error: null });
    const { allProducts } = get();
    if (allProducts.length === 0) {
      get().loadProducts();
    }
  },

  // Reset filters
  resetFilters: () => {
    const { allProducts } = get();
    const defaultFilters = {
      category: "",
      priceRange: [0, 10000],
      rating: 0,
      searchTerm: "",
    };

    set({
      filters: defaultFilters,
      filteredProducts: allProducts,
      isInitialLoad: false,
    });
  },

  // Apply filters manually
  applyCurrentFilters: () => {
    const { allProducts, filters, applyFilters } = get();
    set({ isInitialLoad: false });

    if (filters.searchTerm && filters.searchTerm.trim().length > 0) {
      get().searchProducts(filters.searchTerm);
    } else {
      const filtered = applyFilters(allProducts, filters);
      set({ filteredProducts: filtered });
    }
  },

  // Get product stats
  getProductStats: () => {
    const { allProducts } = get();

    if (allProducts.length === 0) return null;

    const avgRating = (
      allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length
    ).toFixed(1);
    const totalReviews = allProducts.reduce(
      (sum, p) => sum + p.reviewsCount,
      0
    );
    const avgDiscount = Math.round(
      allProducts
        .filter((p) => p.discountPercentage)
        .reduce((sum, p) => sum + p.discountPercentage, 0) /
        allProducts.filter((p) => p.discountPercentage).length
    );

    return { avgRating, totalReviews, avgDiscount };
  },

  // Preserve data on return
  preserveDataOnReturn: () => {
    const { allProducts } = get();
    if (allProducts.length > 0) {
      set({
        isInitialLoad: true,
        loading: false,
        error: null,
      });
    }
  },

  // Get package by ID
  getPackageById: (packageId) => {
    return get().packages.find((pkg) => pkg.id === packageId);
  },

  // Get active packages
  getActivePackages: () => {
    return get().packages.filter((pkg) => pkg.is_active);
  },

  // Get packages by category
  getPackagesByCategory: (categoryId) => {
    return get().packages.filter((pkg) => pkg.category.id === categoryId);
  },

  // Get product by ID
  getProductById: (id) => {
    const { products } = get();
    if (!Array.isArray(products)) return null;
    return products.find((product) => product && product.id === id);
  },

  // Cache management methods
  getCacheStats: () => {
    return cacheManager.getStats();
  },

  clearAllCache: () => {
    cacheManager.clearAll();
    console.log('🗑️ All product cache cleared');
  },

  // Subscribe to cache updates (for real-time updates)
  subscribeToCacheUpdates: (callback) => {
    const handleUpdate = (data) => {
      console.log('🔔 Cache updated with new data, refreshing store...');
      callback(data);
      // يمكن أن نحدث البيانات تلقائياً هنا
      get().loadProducts();
    };

    cacheManager.onDataUpdate('products_with_reviews', handleUpdate);
    
    // إرجاع دالة لإلغاء الاشتراك
    return () => {
      cacheManager.offDataUpdate('products_with_reviews', handleUpdate);
    };
  }
}));

export default useProductsStore;
