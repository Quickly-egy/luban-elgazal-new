import { create } from "zustand";
import { persist } from "zustand/middleware";
import { productAPI } from "../services/endpoints";
import { productsAPI } from "../services/api";
import { cachedProductsAPI, cacheManager } from "../services/cachedAPI";
import axios from "axios";

const useProductsStore = create(
  persist(
    (set, get) => ({
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

      // Discounts state
      discounts: [],
      discountsLoading: false,
      discountsLastFetched: null,
      discountsError: null,

      // Discount Actions
      setDiscounts: (discounts) => set({ 
        discounts, 
        discountsLastFetched: Date.now(),
        discountsError: null 
      }),
      
      setDiscountsLoading: (discountsLoading) => set({ discountsLoading }),
      
      setDiscountsError: (discountsError) => set({ discountsError }),

      // Get discounts for specific product
      getProductDiscounts: (productId) => {
        const { discounts } = get();
        return discounts.filter(discount => discount.product?.id === productId);
      },

      // Get discounts for specific package
      getPackageDiscounts: (packageId) => {
        const { discounts } = get();
        return discounts.filter(discount => discount.package?.id === packageId);
      },

      // Get discount for specific product and country
      getProductDiscount: (productId, countryCode) => {
        const productDiscounts = get().getProductDiscounts(productId);
        if (!productDiscounts.length) return null;

        const productDiscount = productDiscounts[0];
        if (!productDiscount?.country_discounts?.length) return null;

        return productDiscount.country_discounts.find(
          discount => discount.country_code === countryCode
        ) || null;
      },

      // Get discount for specific package and country
      getPackageDiscount: (packageId, countryCode) => {
        const packageDiscounts = get().getPackageDiscounts(packageId);
        if (!packageDiscounts.length) return null;

        const packageDiscount = packageDiscounts[0];
        if (!packageDiscount?.country_discounts?.length) return null;

        return packageDiscount.country_discounts.find(
          discount => discount.country_code === countryCode
        ) || null;
      },

      // Fetch discounts from API
      fetchDiscounts: async (force = false) => {
        const { discounts, discountsLastFetched, discountsLoading } = get();
        
        // Don't fetch if already loading
        if (discountsLoading) return;

        // Don't fetch if data is fresh (less than 5 minutes old) unless forced
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        if (!force && discountsLastFetched && (Date.now() - discountsLastFetched) < CACHE_DURATION) {
          return;
        }

        set({ discountsLoading: true, discountsError: null });

        try {
          const res = await axios.get("https://app.quickly.codes/luban-elgazal/public/api/discounts");
          const fetchedDiscounts = res.data?.data?.discounts || [];
          
          set({ 
            discounts: fetchedDiscounts, 
            discountsLoading: false, 
            discountsLastFetched: Date.now(),
            discountsError: null 
          });

        } catch (err) {
          // console.error("Failed to fetch discounts", err);
          set({ 
            discountsError: err.message, 
            discountsLoading: false 
          });
        }
      },

      // Clear all discounts
      clearDiscounts: () => set({ 
        discounts: [], 
        discountsLastFetched: null, 
        discountsError: null 
      }),

      // Refresh discounts (force fetch)
      refreshDiscounts: () => {
        return get().fetchDiscounts(true);
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
// استبدل دالة setFilters في useProductsStore بهذه الدالة المحدثة

setFilters: (newFilters) => {
  set({
    filters: newFilters,
    isInitialLoad: false,
  });

  const { allProducts, packages, applyFilters } = get();
  
  // تطبيق الفلاتر على المنتجات
  const filteredProducts = applyFilters(allProducts, newFilters);
  
  // تطبيق الفلاتر على الباقات أيضاً إذا لزم الأمر
  let filteredPackages = [...packages];
  
  // فلتر الباقات حسب الفئة إذا كانت محددة
  if (newFilters.category && newFilters.category !== "") {
    filteredPackages = filteredPackages.filter(
      (pkg) => pkg.category === newFilters.category
    );
  }

  // فلتر الباقات حسب السعر
  if (
    newFilters.priceRange &&
    (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 10000)
  ) {
    filteredPackages = filteredPackages.filter((pkg) => {
      const finalPrice = pkg.discount_details?.final_price || pkg.selling_price || pkg.price || 0;
      return (
        finalPrice >= newFilters.priceRange[0] &&
        finalPrice <= newFilters.priceRange[1]
      );
    });
  }

  // فلتر الباقات حسب التقييم
  if (newFilters.rating && newFilters.rating > 0) {
    filteredPackages = filteredPackages.filter(
      (pkg) => {
        const pkgRating = pkg.rating || 0;
        return pkgRating >= newFilters.rating;
      }
    );
  }

  // حفظ النتائج المفلترة
  set({ 
    filteredProducts: filteredProducts,
    // يمكنك حفظ الباقات المفلترة في متغير منفصل إذا أردت
    filteredPackages: filteredPackages 
  });
},

      // Load all products and packages with reviews - NOW WITH CACHING AND DISCOUNTS
      loadProducts: async () => {
        const { transformProduct, transformPackage, page } = get();

        set({ loading: true, error: null });

        try {
          
          // Load products and discounts in parallel
          const [productsResponse] = await Promise.all([
            cachedProductsAPI.getProductsWithReviews(page),
            get().fetchDiscounts() // Fetch discounts alongside products
          ]);
          
          if (!productsResponse?.success || !productsResponse?.data) {
            throw new Error("No valid data received from API");
          }

          const apiProducts = productsResponse.data.products?.data || [];
          const apiPackages = productsResponse.data.packages || [];
          const lastPage = productsResponse.data.products.last_page || 4;

          const transformedProducts = apiProducts.map(transformProduct);
          const transformedPackages = apiPackages.map(transformPackage);

          const availableProducts = transformedProducts.filter(p => p.is_available);
          const categories = [...new Set(availableProducts.map(p => p.category))];

          // حفظ معلومات الـ cache
          const cacheInfo = productsResponse._cacheInfo || {
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

       
         
        } catch (error) {
         
          
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
        
        set({ loading: true });
        
        try {
          await cachedProductsAPI.refreshProductsCache(page);
          await Promise.all([
            get().loadProducts(), // إعادة تحميل البيانات
            get().refreshDiscounts() // تحديث الخصومات أيضاً
          ]);
        } catch (error) {
          // console.error('❌ Failed to refresh products cache:', error);
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
      // إضافة هذه الدالة المحدثة إلى useProductsStore بدلاً من الدالة الحالية

// Apply filters to products - دالة محسنة للتصفية
applyFilters: (products, currentFilters) => {
  let filtered = [...products];

  // فلتر الفئة
  if (currentFilters.category && currentFilters.category !== "") {
    filtered = filtered.filter(
      (product) => product.category === currentFilters.category
    );
  }

  // فلتر السعر
  if (
    currentFilters.priceRange &&
    (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 10000)
  ) {
    filtered = filtered.filter((product) => {
      // الحصول على السعر النهائي للمنتج (مع الخصم إن وجد)
      const finalPrice = product.discount_details?.final_price || product.selling_price || product.price || 0;
      
      return (
        finalPrice >= currentFilters.priceRange[0] &&
        finalPrice <= currentFilters.priceRange[1]
      );
    });
  }

  // فلتر التقييم
  if (currentFilters.rating && currentFilters.rating > 0) {
    filtered = filtered.filter(
      (product) => {
        const productRating = product.rating || 0;
        return productRating >= currentFilters.rating;
      }
    );
  }

  // ترتيب النتائج حسب التقييم ثم عدد المراجعات
  filtered.sort((a, b) => {
    // المنتجات المتوفرة أولاً
    if (a.inStock !== b.inStock) {
      return b.inStock ? 1 : -1;
    }
    
    // ثم حسب التقييم
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    if (Math.abs(ratingDiff) > 0.1) {
      return ratingDiff;
    }
    
    // ثم حسب عدد المراجعات
    const reviewsDiff = (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (reviewsDiff !== 0) {
      return reviewsDiff;
    }
    
    // أخيراً ترتيب أبجدي
    return a.name.localeCompare(b.name, "ar");
  });

  return filtered;
},

      clearAllCache: () => {
        cacheManager.clearAll();
        get().clearDiscounts(); // Clear discounts cache too
      },

      // Subscribe to cache updates (for real-time updates)
      subscribeToCacheUpdates: (callback) => {
        const handleUpdate = (data) => {
          callback(data);
          // يمكن أن نحدث البيانات تلقائياً هنا
          get().loadProducts();
        };

        cacheManager.onDataUpdate('products_with_reviews', handleUpdate);
        
        // إرجاع دالة لإلغاء الاشتراك
        return () => {
          cacheManager.offDataUpdate('products_with_reviews', handleUpdate);
        };
      },

      // Get discounts stats
      getDiscountsStats: () => {
        const { discounts } = get();
        const totalDiscounts = discounts.length;
        const productDiscounts = discounts.filter(d => d.product).length;
        const packageDiscounts = discounts.filter(d => d.package).length;
        
        return {
          total: totalDiscounts,
          products: productDiscounts,
          packages: packageDiscounts
        };
      }
    }),
    {
      name: 'products-store', // localStorage key
      partialize: (state) => ({ 
        // Persist products and discounts
        allProducts: state.allProducts,
        packages: state.packages,
        categories: state.categories,
        discounts: state.discounts,
        discountsLastFetched: state.discountsLastFetched,
        cacheInfo: state.cacheInfo,
        // Don't persist loading states and errors
      }),
    }
    
  )
);

export default useProductsStore;