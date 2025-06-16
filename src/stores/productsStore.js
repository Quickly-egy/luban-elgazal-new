import { create } from 'zustand';
import { productsAPI } from '../services/api';

const useProductsStore = create((set, get) => ({
  // States
  allProducts: [],
  filteredProducts: [],
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    weight: '',
    searchTerm: ''
  },
  loading: false,
  error: null,
  isSearching: false,
  isInitialLoad: true, // فلاج للتحميل الأولي

  // Transform API product data to match ProductCard expected format
  transformProduct: (apiProduct) => {
    const purchaseCost = parseFloat(apiProduct.purchase_cost) || 0;
    const sellingPrice = parseFloat(apiProduct.selling_price) || 0;
    const mockRating = Math.random() * (5 - 3.5) + 3.5;
    const mockReviews = Math.floor(Math.random() * 500) + 10;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      weight: "N/A",
      image: apiProduct.main_image_url,
      originalPrice: purchaseCost,
      discountedPrice: sellingPrice,
      discountPercentage: apiProduct.profit_margin ? Math.abs(parseFloat(apiProduct.profit_margin)) : 0,
      rating: parseFloat(mockRating.toFixed(1)),
      reviewsCount: mockReviews,
      inStock: apiProduct.is_available && apiProduct.total_warehouse_quantity > 0,
      category: apiProduct.category?.name || 'غير محدد',
      description: apiProduct.description,
      sku: apiProduct.sku,
      label: apiProduct.label,
      tax: apiProduct.tax,
      secondary_images: apiProduct.secondary_image_urls || [],
      warehouse_info: apiProduct.warehouse_info
    };
  },

  // Apply filters to products
  applyFilters: (products, currentFilters) => {
    let filtered = [...products];

    // فلتر الفئة
    if (currentFilters.category) {
      filtered = filtered.filter(product => product.category === currentFilters.category);
    }

    // فلتر السعر - فقط إذا تم تغيير النطاق عن القيم الافتراضية
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 10000) {
      filtered = filtered.filter(product =>
        product.discountedPrice >= currentFilters.priceRange[0] &&
        product.discountedPrice <= currentFilters.priceRange[1]
      );
    }

    // فلتر التقييم
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= currentFilters.rating);
    }

    // ملاحظة: فلتر التوفر في المخزن تم إزالته لأننا نعرض المنتجات المتاحة فقط من البداية

    // الترتيب الافتراضي
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });

    return filtered;
  },

  // Actions
  setFilters: (newFilters) => {
    const { allProducts, applyFilters, isInitialLoad } = get();
    
    // إذا كان التغيير فقط في البحث ونحن في التحميل الأولي، لا تطبق الفلاتر
    const currentFilters = get().filters;
    const isOnlySearchChange = currentFilters.searchTerm !== newFilters.searchTerm && 
                              currentFilters.category === newFilters.category &&
                              JSON.stringify(currentFilters.priceRange) === JSON.stringify(newFilters.priceRange) &&
                              currentFilters.rating === newFilters.rating;
    
    set({ 
      filters: newFilters,
      isInitialLoad: isOnlySearchChange ? isInitialLoad : false // احتفظ بحالة التحميل الأولي إذا كان فقط البحث يتغير
    });
    
    // إذا لم يكن هناك بحث ولسنا في التحميل الأولي، طبق الفلاتر على جميع المنتجات
    if ((!newFilters.searchTerm || newFilters.searchTerm.trim().length === 0) && !isInitialLoad && !isOnlySearchChange) {
      const filtered = applyFilters(allProducts, newFilters);
      set({ filteredProducts: filtered });
    }
  },

  // Load all products
  loadProducts: async () => {
    const { transformProduct } = get();
    
    try {
      set({ loading: true, error: null });

      const response = await productsAPI.getProducts();

      if (response.success && response.data?.data) {
        const transformedProducts = response.data.data.map(transformProduct);
        // فلترة المنتجات المتاحة في المخزون فقط
        const availableProducts = transformedProducts.filter(product => product.inStock);
        const categories = [...new Set(availableProducts.map(p => p.category))];

        // في التحميل الأولي، اعرض المنتجات المتاحة فقط
        set({
          allProducts: availableProducts,
          filteredProducts: availableProducts, // عرض المنتجات المتاحة فقط
          categories: categories,
          isInitialLoad: true // تأكيد أن هذا تحميل أولي
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      set({
        error: 'فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.',
        allProducts: [],
        filteredProducts: [],
        categories: [],
        isInitialLoad: false
      });
    } finally {
      set({ loading: false });
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    const { transformProduct, applyFilters, filters, allProducts } = get();
    
    // تعيين أن هذا ليس تحميل أولي
    set({ isInitialLoad: false });

    if (!searchTerm || searchTerm.trim().length === 0) {
      // إذا كان البحث فارغ، استخدم جميع المنتجات الأصلية
      const filtered = applyFilters(allProducts, { ...filters, searchTerm: '' });
      set({ filteredProducts: filtered, isSearching: false });
      return;
    }

    try {
      set({ isSearching: true, error: null });

      const response = await productsAPI.searchProducts(searchTerm);

      if (response.success && response.data?.data) {
        const transformedProducts = response.data.data.map(transformProduct);
        // فلترة المنتجات المتاحة في المخزون فقط
        const availableProducts = transformedProducts.filter(product => product.inStock);
        const filtered = applyFilters(availableProducts, filters);
        set({ filteredProducts: filtered });
      } else {
        throw new Error('Invalid search response format');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      set({ error: 'فشل في البحث عن المنتجات. يرجى المحاولة مرة أخرى.' });
      
      // في حالة خطأ البحث، استخدم المنتجات الحالية
      const filtered = applyFilters(allProducts, { ...filters, searchTerm: '' });
      set({ filteredProducts: filtered });
    } finally {
      set({ isSearching: false });
    }
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
      category: '',
      priceRange: [0, 10000],
      rating: 0,
      weight: '',
      searchTerm: ''
    };
    
    set({ 
      filters: defaultFilters,
      filteredProducts: allProducts, // عرض جميع المنتجات عند إعادة التعيين
      isInitialLoad: false
    });
  },

  // Apply filters manually (يستخدم عند التفاعل مع الفلاتر)
  applyCurrentFilters: () => {
    const { allProducts, filters, applyFilters } = get();
    set({ isInitialLoad: false });
    
    if (!filters.searchTerm || filters.searchTerm.trim().length === 0) {
      const filtered = applyFilters(allProducts, filters);
      set({ filteredProducts: filtered });
    }
  },

  // Get product stats
  getProductStats: () => {
    const { allProducts } = get();
    
    if (allProducts.length === 0) return null;

    const avgRating = (allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1);
    const totalReviews = allProducts.reduce((sum, p) => sum + p.reviewsCount, 0);
    const avgDiscount = Math.round(
      allProducts.filter(p => p.discountPercentage).reduce((sum, p) => sum + p.discountPercentage, 0) /
      allProducts.filter(p => p.discountPercentage).length
    );

    return { avgRating, totalReviews, avgDiscount };
  }
}));

export default useProductsStore; 