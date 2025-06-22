import { create } from "zustand";
import { productAPI } from "../services/endpoints";

const useProductsStore = create((set, get) => ({
  // States
  allProducts: [],
  filteredProducts: [],
  categories: [],
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

  // Transform API product data to match ProductCard expected format
  transformProduct: (apiProduct) => {
    const reviewsInfo = apiProduct.reviews_info || {};

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: apiProduct.weight,
      image: apiProduct.main_image_url,
      // استخدام البيانات الفعلية من API
      original_price: apiProduct.original_price,
      selling_price: apiProduct.selling_price,
      formatted_original_price: apiProduct.formatted_original_price,
      formatted_selling_price: apiProduct.formatted_selling_price,
      // الاحتفاظ بالبيانات القديمة للتوافق
      originalPrice: parseFloat(apiProduct.original_price) || 0,
      discountedPrice: parseFloat(apiProduct.selling_price) || 0,
      discountPercentage: apiProduct.discount_info?.discount_percentage || 0,
      rating: reviewsInfo.average_rating || 0,
      reviewsCount: reviewsInfo.total_reviews || 0,
      inStock: apiProduct.stock_info?.in_stock || false,
      category: apiProduct.category?.name || "غير محدد",
      description: apiProduct.description,
      sku: apiProduct.sku,
      label: apiProduct.label || null,
      secondary_images: apiProduct.secondary_image_urls || [],
      stock_info: apiProduct.stock_info,
      reviews_info: reviewsInfo,
      discount_info: apiProduct.discount_info || null, // إضافة معلومات الخصم
      is_available: apiProduct.is_available,
      created_at: apiProduct.created_at,
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

  // Load all products with reviews
  loadProducts: async () => {
    const { transformProduct, allProducts } = get();

    // تجنب إعادة التحميل إذا كانت البيانات موجودة بالفعل
    if (allProducts.length > 0) {
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await productAPI.getProductsWithReviews();

      if (response.success && response.data) {
        const transformedProducts = response.data.map(transformProduct);
        // فلترة المنتجات المتاحة في المخزون فقط
        const availableProducts = transformedProducts.filter(
          (product) => product.inStock
        );
        const categories = [
          ...new Set(availableProducts.map((p) => p.category)),
        ];

        // في التحميل الأولي، اعرض المنتجات المتاحة فقط
        set({
          allProducts: availableProducts,
          filteredProducts: availableProducts, // عرض المنتجات المتاحة فقط
          categories: categories,
          isInitialLoad: true, // تأكيد أن هذا تحميل أولي
          loading: false, // إنهاء التحميل فوراً
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      set({
        error: "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.",
        allProducts: [],
        filteredProducts: [],
        categories: [],
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
}));

export default useProductsStore;
