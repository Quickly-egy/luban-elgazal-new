import { create } from "zustand";
import { productAPI } from "../services/endpoints";

const useProductsStore = create((set, get) => ({
  // States
  allProducts: [],
  filteredProducts: [],
  categories: [],
  packages: [],
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

  // Transform package data
  transformPackage: (apiPackage) => {
    return {
      id: apiPackage.id,
      name: apiPackage.name,
      description: apiPackage.description,
      total_price: apiPackage.total_price,
      product_category_id: apiPackage.product_category_id,
      is_active: apiPackage.is_active,
      created_at: apiPackage.created_at,
      updated_at: apiPackage.updated_at,
      deleted_at: apiPackage.deleted_at,
      calculated_price: apiPackage.calculated_price,
      main_image: apiPackage.main_image,
      main_image_url: apiPackage.main_image_url,
      secondary_images: apiPackage.secondary_images,
      secondary_image_urls: apiPackage.secondary_image_urls || [],
      products: apiPackage.products.map(product => ({
        ...get().transformProduct(product),
        quantity: product.quantity
      })),
      category: apiPackage.category,
      reviews_info: apiPackage.reviews_info || {
        total_reviews: 0,
        average_rating: 0,
        rating_stars: "",
        rating_distribution: {
          "5": 0,
          "4": 0,
          "3": 0,
          "2": 0,
          "1": 0
        },
        latest_reviews: []
      }
    };
  },

  // Transform API product data to match ProductCard expected format
  transformProduct: (apiProduct) => {
    const reviewsInfo = {
      total_reviews: apiProduct.active_reviews_count || 0,
      average_rating: apiProduct.active_reviews_avg_rating || 0,
      rating_distribution: {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      },
      latest_reviews: apiProduct.active_reviews || []
    };

    const warehouseInfo = {
      total_available: apiProduct.total_warehouse_quantity || 0,
      total_quantity: apiProduct.total_warehouse_quantity || 0,
      total_sold: 0
    };

    // تحويل معلومات الخصم
    const hasDiscount = apiProduct.discount_details && 
                       (apiProduct.discount_details.type === 'percentage' || 
                        apiProduct.discount_details.type === 'fixed') && 
                       parseFloat(apiProduct.discount_details.value) > 0;

    // التحقق من توفر المنتج
    const isAvailable = apiProduct.is_available && 
                       apiProduct.total_warehouse_quantity > 0;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: apiProduct.weight,
      image: apiProduct.main_image_url,
      // بيانات السعر والخصم
      selling_price: apiProduct.selling_price,
      discount_details: hasDiscount ? {
        ...apiProduct.discount_details,
        final_price: parseFloat(apiProduct.discount_details.final_price),
        value: parseFloat(apiProduct.discount_details.value),
        type: apiProduct.discount_details.type,
        discount_amount: parseFloat(apiProduct.discount_details.discount_amount || 0)
      } : null,
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
        total_available: apiProduct.total_warehouse_quantity || 0
      },
      reviews_info: reviewsInfo,
      is_available: apiProduct.is_available,
      total_warehouse_quantity: apiProduct.total_warehouse_quantity || 0,
      created_at: apiProduct.created_at,
      // معلومات الخصومات المتاحة
      valid_discounts: apiProduct.valid_discounts || []
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
    set({
      filters: newFilters,
      isInitialLoad: false,
    });

    // طبق الفلاتر تلقائياً بعد تحديثها
    const { allProducts, applyFilters } = get();

    if (newFilters.searchTerm && newFilters.searchTerm.trim().length > 0) {
      // إذا كان هناك بحث، ابحث أولاً ثم طبق الفلاتر
      get().searchProducts(newFilters.searchTerm);
    } else {
      // إذا لم يكن هناك بحث، طبق الفلاتر على جميع المنتجات
      const filtered = applyFilters(allProducts, newFilters);
      set({ filteredProducts: filtered });
    }
  },

  // Load all products and packages with reviews
  loadProducts: async () => {
    const { transformProduct, transformPackage, allProducts } = get();

    // Don't reload if we already have products
    if (allProducts.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await productAPI.getProductsWithReviews();
      
      // طباعة الريسبونس في الكونسول
      console.log('=== بيانات المنتجات ===');
      console.log('Response:', response);
      console.log('المنتجات:', response.data.products.data);
      console.log('الباقات:', response.data.packages);
      console.log('=== نهاية بيانات المنتجات ===');

      const transformedProducts = response.data.products.data.map(transformProduct);
      const transformedPackages = response.data.packages.map(transformPackage);

      if (response.status && response.data) {
        // Transform and set products
        const availableProducts = transformedProducts.filter(
          (product) => product.is_available
        );
        const categories = [
          ...new Set(availableProducts.map((p) => p.category)),
        ];

        // Transform and set packages
        const activePackages = transformedPackages.filter(
          (pkg) => pkg.is_active
        );

        // Set all data
        set({
          allProducts: availableProducts,
          filteredProducts: availableProducts,
          categories: categories,
          packages: activePackages,
          isInitialLoad: true,
          loading: false,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error loading products:", error);
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

  // Search products locally (client-side filtering)
  searchProducts: (searchTerm) => {
    const { allProducts, applyFilters } = get();
    const currentFilters = get().filters; // احصل على الفلاتر الحالية

    if (!searchTerm || searchTerm.trim().length === 0) {
      // إذا كان البحث فارغ، استخدم جميع المنتجات مع الفلاتر الحالية
      const filtered = applyFilters(allProducts, currentFilters);
      set({ filteredProducts: filtered, isSearching: false });
      return;
    }

    // البحث المحلي في المنتجات
    const searchTermLower = searchTerm.toLowerCase().trim();
    const searchResults = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTermLower) ||
        product.category.toLowerCase().includes(searchTermLower) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTermLower)) ||
        (product.sku && product.sku.toLowerCase().includes(searchTermLower))
    );

    // طبق الفلاتر الأخرى على نتائج البحث
    const filtered = applyFilters(searchResults, currentFilters);

    set({
      filteredProducts: filtered,
      isSearching: false,
    });
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
    return get().packages.find(pkg => pkg.id === packageId);
  },

  // Get active packages
  getActivePackages: () => {
    return get().packages.filter(pkg => pkg.is_active);
  },

  // Get packages by category
  getPackagesByCategory: (categoryId) => {
    return get().packages.filter(pkg => pkg.category.id === categoryId);
  },
}));

export default useProductsStore;
