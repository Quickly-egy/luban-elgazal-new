import { create } from "zustand";
import { productAPI } from "../services/endpoints";
import { productsAPI } from "../services/api";

const useProductsStore = create((set, get) => ({
  // States
  allProducts: [],
  filteredProducts: [],
  categories: [],
  packages: [],
    page: 1,
    totalPages:1,
  filters: {
    category: "",
    priceRange: [0, 10000],
    rating: 0,
    weight: "",
    searchTerm: "",
   
  },
  loading: false,
  error: null,
  isSearching: false,
  isInitialLoad: true, // فلاج للتحميل الأولي
  products: [],
  isLoading: false,
  cachedProducts: [], // إضافة مصفوفة لتخزين المنتجات المجلوبة

  // Transform package data
  transformPackage: (apiPackage) => {
    const displayPrice = apiPackage.calculated_price > 0 
      ? parseFloat(apiPackage.calculated_price) 
      : parseFloat(apiPackage.total_price);

 

    // Add discount_details from API if available
    let discount_details = apiPackage.discount_details || null;
    
    // If the package has scheduled discount timing, ensure proper structure
    if (discount_details && discount_details.timing_type === "scheduled") {
      // Make sure we have all required fields for timer functionality
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
      // إضافة prices object من API
      prices: apiPackage.prices || null,
      // إضافة discount_details
      discount_details: discount_details,
      // أسعار البلدان المختلفة (للـ fallback)
      price_sar: apiPackage.price_sar,
      price_aed: apiPackage.price_aed,
      price_qar: apiPackage.price_qar,
      price_kwd: apiPackage.price_kwd,
      price_bhd: apiPackage.price_bhd,
      price_omr: apiPackage.price_omr,
      price_usd: apiPackage.price_usd,
      selling_price: displayPrice, // Add for compatibility
      price: displayPrice, // Add for compatibility
      discountedPrice: displayPrice, // Add for compatibility
      originalPrice: parseFloat(apiPackage.total_price), // Add for compatibility
      type: 'package', // Mark as package
      isPackage: true, // Mark as package
      product_category_id: apiPackage.product_category_id,
      is_active: apiPackage.is_active,
      inStock: apiPackage.is_active, // Add for compatibility
      created_at: apiPackage.created_at,
      updated_at: apiPackage.updated_at,
      deleted_at: apiPackage.deleted_at,
      main_image: apiPackage.main_image,
      main_image_url: apiPackage.main_image_url,
      image: apiPackage.main_image_url, // Add for compatibility
      secondary_images: apiPackage.secondary_images,
      secondary_image_urls: apiPackage.secondary_image_urls || [],
      products: apiPackage.products ? apiPackage.products.map((product) => ({
        ...get().transformProduct(product),
        quantity: product.pivot?.quantity || product.quantity || 1,
      })) : [],
      category: apiPackage.category?.name || "الباقات",
      rating: apiPackage.active_reviews_avg_rating || 5, // Add for compatibility
      reviewsCount: apiPackage.active_reviews_count || 0, // Add for compatibility
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
    // Debug only for main product during development

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

    // تحويل السعر الأساسي
    const basePrice = parseFloat(apiProduct.selling_price || 0);

    // تحويل معلومات الخصم
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

    // التحقق من توفر المنتج
    const isAvailable =
      apiProduct.is_available && apiProduct.total_warehouse_quantity > 0;


    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: apiProduct.weight,
      image: apiProduct.main_image_url,
      main_image_url: apiProduct.main_image_url,
      // بيانات السعر والخصم
      selling_price: basePrice,
      discount_details: discountDetails,
      // إضافة كائن prices الأصلي من API
      prices: apiProduct.prices || null,
      price_sar: apiProduct.price_sar,
      price_aed: apiProduct.price_aed,
      price_qar: apiProduct.price_qar,
      price_kwd: apiProduct.price_kwd,
      price_bhd: apiProduct.price_bhd,
      price_omr: apiProduct.price_omr,
      // معلومات إضافية
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
      // معلومات الخصومات المتاحة
      valid_discounts: apiProduct.valid_discounts || [],
    };
  },

  // Apply filters to products
  applyFilters: (products, currentFilters) => {
    let filtered = [...products];

    // فلتر الفئة
    if (currentFilters.category) {
      filtered = filtered.filter(
        (product) => product.category === currentFilters.category
      );
    }

    // فلتر السعر - فقط إذا تم تغيير النطاق عن القيم الافتراضية
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

    // فلتر التقييم
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(
        (product) => product.rating >= currentFilters.rating
      );
    }

    // فلتر الوزن (إذا كان متوفراً)
    if (currentFilters.weight) {
      // يمكن تحسين هذا حسب بيانات الوزن الفعلية
      // حالياً نستخدم مثال بسيط
      switch (currentFilters.weight) {
        case "light":
          // المنتجات الخفيفة
          break;
        case "medium":
          // المنتجات المتوسطة
          break;
        case "heavy":
          // المنتجات الثقيلة
          break;
        default:
          break;
      }
    }

    // الترتيب الافتراضي
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });

    return filtered;
  },

  // Actions
  setFilters: (newFilters) => {
    // First, update the filters state
    set({
      filters: newFilters,
      isInitialLoad: false,
    });

    // Then, update filtered products based on the new filters
    const { allProducts, applyFilters } = get();
    const filtered = applyFilters(allProducts, newFilters);
    set({ filteredProducts: filtered });
  },

  // Load all products and packages with reviews
loadProducts: async () => {
  const { transformProduct, transformPackage, page } = get(); // جلب الصفحة من store

  set({ loading: true, error: null });

  try {
    const response = await productAPI.getProductsWithReviews(page); // إرسال رقم الصفحة

    if (!response?.success || !response?.data) {
      throw new Error("No valid data received from API");
    }

    const apiProducts = response.data.products?.data || [];
    const apiPackages = response.data.packages || [];
    const LastPage=response.data.products.last_page || 4

    const transformedProducts = apiProducts.map(transformProduct);
    const transformedPackages = apiPackages.map(transformPackage);

    const availableProducts = transformedProducts.filter(p => p.is_available);
    const categories = [...new Set(availableProducts.map(p => p.category))];

    set({
      allProducts: availableProducts,
      filteredProducts: availableProducts,
      categories: categories,
      packages: transformedPackages,
      isInitialLoad: true,
      loading: false,
      totalPages:LastPage
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
    });
  }
},









 

  // وظيفة البحث المحدثة
  searchProducts: (query) => {
   
      const { allProducts, packages, filters, applyFilters } = get();
 

  if (!query || query.trim() === "") {
    // لو مفيش بحث، نطبق الفلاتر العادية
    const filtered = applyFilters(allProducts, filters);
    set({ filteredProducts: filtered });
    return filtered;
  }

  const searchTerm = query.trim().toLowerCase();

  // البحث في المنتجات
  const matchedProducts = allProducts.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchTerm);
    const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
    const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
    return nameMatch || descriptionMatch || categoryMatch;
  });

  // البحث في الباقات
  const matchedPackages = packages.filter((pkg) => {
    const nameMatch = pkg.name?.toLowerCase().includes(searchTerm);
    const descriptionMatch = pkg.description?.toLowerCase().includes(searchTerm);
    const categoryMatch = pkg.category?.toLowerCase().includes(searchTerm);
    return nameMatch || descriptionMatch || categoryMatch;
  });

  // دمج النتائج
  const results = [...matchedProducts, ...matchedPackages];


  // حفظ النتائج
  set({ filteredProducts: results });
  return results;
  },

  // Clear error and reload if no products
  clearError: () => {
    set({ error: null });
    const { allProducts } = get();
    // فقط أعد التحميل إذا لم توجد منتجات نهائياً
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
      weight: "",
      searchTerm: "",
    };

    set({
      filters: defaultFilters,
      filteredProducts: allProducts, // عرض جميع المنتجات عند إعادة التعيين
      isInitialLoad: false,
    });
  },

  // Apply filters manually (يستخدم عند التفاعل مع الفلاتر)
  applyCurrentFilters: () => {
    const { allProducts, filters, applyFilters } = get();
    set({ isInitialLoad: false });

    if (filters.searchTerm && filters.searchTerm.trim().length > 0) {
      // إذا كان هناك بحث، ابحث أولاً ثم طبق الفلاتر
      get().searchProducts(filters.searchTerm);
    } else {
      // إذا لم يكن هناك بحث، طبق الفلاتر على جميع المنتجات
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

  // إعادة تعيين حالة التحميل الأولي دون فقدان البيانات
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

  // الحصول على منتج بواسطة المعرف
  getProductById: (id) => {
    const { products } = get();
    if (!Array.isArray(products)) return null;
    return products.find((product) => product && product.id === id);
  },
}));

export default useProductsStore;
