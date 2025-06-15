import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import ProductFilters from '../../components/Products/ProductFilters/ProductFilters';
import ProductSearch from '../../components/Products/ProductSearch/ProductSearch';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    weight: '',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const mockProducts = [
    {
      id: 1,
      name: "لابتوب Asus Vivobook I5 1355U، 8GB رام، 512GB SSD",
      weight: "1.7kg",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      originalPrice: 15360,
      discountedPrice: 9999,
      discountPercentage: 35,
      rating: 4.5,
      reviewsCount: 128,
      inStock: true,
      category: "إلكترونيات"
    },
    {
      id: 2,
      name: "تنورة جينز نسائية من LV مع تفاصيل جلدية",
      weight: "0.3kg",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
      originalPrice: 2500,
      discountedPrice: 1390,
      discountPercentage: 44,
      rating: 4.2,
      reviewsCount: 89,
      inStock: true,
      category: "ملابس"
    },
    {
      id: 3,
      name: "حذاء رياضي Nike Air Max للرجال والنساء",
      weight: "0.8kg",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      originalPrice: 250,
      discountedPrice: 148,
      discountPercentage: 41,
      rating: 4.8,
      reviewsCount: 256,
      inStock: true,
      category: "أحذية"
    },
    {
      id: 4,
      name: "باقة العناية بالشعر الطبيعية",
      weight: "250g",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
      originalPrice: 8711.25,
      discountedPrice: 3750,
      discountPercentage: 57,
      rating: 4.0,
      reviewsCount: 93,
      inStock: true,
      category: "جمال وعناية"
    },
    {
      id: 5,
      name: "ساعة ذكية Apple Watch Series 9",
      weight: "0.05kg",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
      originalPrice: 4500,
      discountedPrice: 3200,
      discountPercentage: 29,
      rating: 4.7,
      reviewsCount: 342,
      inStock: true,
      category: "إلكترونيات"
    },
    {
      id: 6,
      name: "كتاب تطوير الذات والنجاح",
      weight: "0.4kg",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      originalPrice: 150,
      discountedPrice: 89,
      discountPercentage: 41,
      rating: 4.3,
      reviewsCount: 67,
      inStock: true,
      category: "كتب"
    },
    {
      id: 7,
      name: "سماعات لاسلكية Sony WH-1000XM5",
      weight: "0.25kg",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      originalPrice: 3500,
      discountedPrice: 2800,
      discountPercentage: 20,
      rating: 4.6,
      reviewsCount: 189,
      inStock: true,
      category: "إلكترونيات"
    },
    {
      id: 8,
      name: "حقيبة يد نسائية من الجلد الطبيعي",
      weight: "0.6kg",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      originalPrice: 1200,
      discountedPrice: 850,
      discountPercentage: 29,
      rating: 4.1,
      reviewsCount: 124,
      inStock: true,
      category: "إكسسوارات"
    },
    {
      id: 9,
      name: "هاتف iPhone 15 Pro Max 256GB",
      weight: "0.221kg",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      originalPrice: 12000,
      discountedPrice: 10500,
      discountPercentage: 13,
      rating: 4.9,
      reviewsCount: 567,
      inStock: true,
      category: "إلكترونيات"
    },
    {
      id: 10,
      name: "عطر عود طبيعي فاخر 50ml",
      weight: "0.15kg",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
      originalPrice: 800,
      discountedPrice: 560,
      discountPercentage: 30,
      rating: 4.4,
      reviewsCount: 78,
      inStock: true,
      category: "جمال وعناية"
    },
    {
      id: 11,
      name: "قميص قطني كاجوال للرجال",
      weight: "0.2kg",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      originalPrice: 350,
      discountedPrice: 245,
      discountPercentage: 30,
      rating: 4.1,
      reviewsCount: 156,
      inStock: true,
      category: "ملابس"
    },
    {
      id: 12,
      name: "نظارات شمسية راي بان كلاسيكية",
      weight: "0.03kg",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop",
      originalPrice: 600,
      discountedPrice: 420,
      discountPercentage: 30,
      rating: 4.6,
      reviewsCount: 234,
      inStock: true,
      category: "إكسسوارات"
    }
  ];

  useEffect(() => {
    // محاكاة تحميل البيانات مع تأخير واقعي
    const loadProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // فلتر البحث
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // فلتر الفئة
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // فلتر السعر
    filtered = filtered.filter(product =>
      product.discountedPrice >= filters.priceRange[0] &&
      product.discountedPrice <= filters.priceRange[1]
    );

    // فلتر التقييم
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // فلتر الوزن
    if (filters.weight) {
      filtered = filtered.filter(product => {
        const productWeight = parseFloat(product.weight);
        switch (filters.weight) {
          case 'light':
            return productWeight <= 0.5;
          case 'medium':
            return productWeight > 0.5 && productWeight <= 2;
          case 'heavy':
            return productWeight > 2;
          default:
            return true;
        }
      });
    }

    // ترتيب النتائج
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // الترتيب الافتراضي: الأعلى تقييماً ثم الأكثر مبيعاً
        filtered.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviewsCount - a.reviewsCount;
        });
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleRatingClick = (product) => {
    console.log('عرض تقييمات المنتج:', product.id);
    // يمكن إضافة Modal للتقييمات هنا
  };

  // حساب إحصائيات المنتجات
  const getProductStats = () => {
    if (products.length === 0) return null;
    
    const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);
    const totalReviews = products.reduce((sum, p) => sum + p.reviewsCount, 0);
    const avgDiscount = Math.round(
      products.filter(p => p.discountPercentage).reduce((sum, p) => sum + p.discountPercentage, 0) / 
      products.filter(p => p.discountPercentage).length
    );

    return { avgRating, totalReviews, avgDiscount };
  };

  const stats = getProductStats();

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading">
            <div>جاري تحميل المنتجات...</div>
            <p style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.7 }}>
              يرجى الانتظار قليلاً
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">جميع المنتجات</h1>
          <p className="page-subtitle">
            اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة بأفضل الأسعار
          </p>
          {stats && (
            <div style={{ 
              marginTop: '2rem', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem',
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              <span>⭐ متوسط التقييم: {stats.avgRating}</span>
              <span>💬 {stats.totalReviews.toLocaleString()} تقييم</span>
              <span>🏷️ متوسط الخصم: {stats.avgDiscount}%</span>
            </div>
          )}
        </div>

        <div className="products-content">
          <aside className="filters-sidebar">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={[...new Set(products.map(p => p.category))]}
            />
          </aside>

          <main className="products-main">
            <div className="products-header">
              <ProductSearch
                searchTerm={filters.searchTerm}
                onSearchChange={(term) => handleFilterChange({...filters, searchTerm: term})}
                placeholder="ابحث عن المنتجات، الفئات..."
              />
              
              <div className="products-controls">
                <div className="results-count">
                  عرض {filteredProducts.length} من أصل {products.length} منتج
                </div>
                
                <div className="sort-controls">
                  <label htmlFor="sort">ترتيب حسب:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="default">الأفضل (مُوصى به)</option>
                    <option value="popularity">الأكثر شعبية</option>
                    <option value="rating">التقييم الأعلى</option>
                    <option value="price-low">السعر: من الأقل للأعلى</option>
                    <option value="price-high">السعر: من الأعلى للأقل</option>
                    <option value="discount">أكبر خصم</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRatingClick={handleRatingClick}
                    showTimer={false}
                    style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                  />
                ))
              ) : (
                <div className="no-products">
                  <h3>لا توجد منتجات تطابق معايير البحث</h3>
                  <p>
                    جرب تغيير الفلاتر أو البحث بكلمات مختلفة للعثور على المنتجات المناسبة
                  </p>
                  <button 
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem 2rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    onClick={() => {
                      setFilters({
                        category: '',
                        priceRange: [0, 10000],
                        rating: 0,
                        weight: '',
                        searchTerm: ''
                      });
                      setSortBy('default');
                    }}
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;