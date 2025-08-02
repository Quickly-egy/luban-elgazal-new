import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ProductCategories.css';
import { cachedCategoriesAPI } from '../../../services/cachedAPI';
import useProductsStore from '../../../stores/productsStore';

// تحسين 1: نقل الألوان خارج الكومبوننت لتجنب إعادة إنشائها
const BG_COLORS = [
  '#5DCCF0', '#F5B041', '#F06292', '#81C784',
  '#FF9800', '#9C27B0', '#E91E63', '#4CAF50',
  '#3F51B5', '#FF5722', '#795548', '#607D8B'
];

// تحسين 2: كومبوننت منفصل للبطاقة مع React.memo
const CategoryCard = React.memo(({ category, onClick }) => (
  <div
    className="category-card"
    onClick={() => onClick(category)}
    style={{ cursor: 'pointer' }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(category);
      }
    }}
  >
    <div className="category-content">
      <div className="category-wrapper">
        <div
          className="category-shape"
          style={{ backgroundColor: category.bgColor }}
        />
        <div className="category-image">
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy" // تحسين 3: Lazy loading للصور
            onError={(e) => {
              // تحسين 4: معالجة أخطاء الصور
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
    <div className="category-name">
      <h3>{category.name}</h3>
    </div>
  </div>
));

CategoryCard.displayName = 'CategoryCard';

// تحسين 5: كومبوننت Loading منفصل
const LoadingShimmer = React.memo(() => (
  <section className="product-categories">
    <div className="container">
      <div className="" style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <h2 className="section-title">فئات المنتجات</h2>
        <p className="section-subtitle">اكتشف مجموعتنا المتنوعة من منتجات العناية والجمال</p>
      </div>
      <div className="categories-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div 
            key={index} 
            className="category-card shimmer-card"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: `shimmerCard 1.5s infinite ${index * 0.1}s`
            }}
          >
            <div className="category-content">
              <div className="category-wrapper">
                <div className="category-shape shimmer-shape"></div>
                <div className="category-image shimmer-image"></div>
              </div>
            </div>
            <div className="category-name">
              <div className="shimmer-text"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

LoadingShimmer.displayName = 'LoadingShimmer';

// تحسين 6: كومبوننت Error منفصل
const ErrorState = React.memo(({ error, onRetry }) => (
  <section className="product-categories">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">فئات المنتجات</h2>
        <p className="section-subtitle" style={{ color: '#dc2626' }}>{error}</p>
        <button 
          onClick={onRetry}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 إعادة المحاولة
        </button>
      </div>
    </div>
  </section>
));

ErrorState.displayName = 'ErrorState';

const ProductCategories = () => {
  const navigate = useNavigate();
  const [isSliderMode, setIsSliderMode] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState({
    fromCache: false,
    isStale: false,
    age: 0
  });

  // تحسين 7: useCallback لمنع إعادة إنشاء الدوال
  const calculateSlidesPerView = useCallback((width) => {
    if (width >= 1600) return 6;
    if (width >= 1400) return 5;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }, []);

  // تحسين 8: دمج handleResize مع useCallback
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const newSlidesPerView = calculateSlidesPerView(width);
    
    setSlidesPerView(newSlidesPerView);
    setIsSliderMode(categories.length > newSlidesPerView);
  }, [categories.length, calculateSlidesPerView]);

  // تحسين 9: debounce للـ resize event
  const debouncedHandleResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };
  }, [handleResize]);

  // تحسين 10: معالجة النقر مع useCallback
  const handleCategoryClick = useCallback((category) => {
    const store = useProductsStore.getState();
    store.setFilters({
      ...store.filters,
      category: category.name
    });
    navigate('/products');
  }, [navigate]);

  // تحسين 11: تحسين fetchCategories
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📂 ${forceRefresh ? 'Force refreshing' : 'Fetching'} categories...`);
      
      const response = forceRefresh 
        ? await cachedCategoriesAPI.refreshCategoriesCache()
        : await cachedCategoriesAPI.getCategories();

      if (response.success && response.data) {
        // تحسين 12: استخدام requestAnimationFrame لتحديث حالة UI
        requestAnimationFrame(() => {
          const categoriesWithBg = response.data.map((category, index) => ({
            ...category,
            bgColor: BG_COLORS[index % BG_COLORS.length]
          }));
          
          setCategories(categoriesWithBg);
          
          if (response._cacheInfo) {
            setCacheInfo(response._cacheInfo);
            console.log(`📂 Categories loaded (fromCache: ${response._cacheInfo.fromCache}, count: ${categoriesWithBg.length})`);
            
            if (response._cacheInfo.fromCache && response._cacheInfo.isStale) {
              console.log('🔄 Categories data is from cache but stale, background update is running...');
            }
          }
        });
      } else {
        setError('فشل في جلب فئات المنتجات');
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  // تحسين 13: handleRefreshCategories مع useCallback
  const handleRefreshCategories = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // تحسين 14: useEffect للتحميل الأولي
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // تحسين 15: useEffect للـ resize مع cleanup محسن
  useEffect(() => {
    handleResize(); // تشغيل فوري
    window.addEventListener('resize', debouncedHandleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [handleResize, debouncedHandleResize]);

  // تحسين 16: Swiper config كـ useMemo
  const swiperConfig = useMemo(() => ({
    modules: [Autoplay],
    spaceBetween: 35,
    slidesPerView: slidesPerView,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      480: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 25 },
      1400: { slidesPerView: 5, spaceBetween: 30 },
      1600: { slidesPerView: 6, spaceBetween: 35 },
    },
    className: "categories-swiper"
  }), [slidesPerView]);

  // تحسين 17: Early returns للحالات المختلفة
  if (loading) {
    return <LoadingShimmer />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefreshCategories} />;
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="product-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">فئات المنتجات</h2>
            <p className="section-subtitle">لا توجد فئات متوفرة حالياً</p>
            <button 
              onClick={handleRefreshCategories}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 تحديث البيانات
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-categories">
      <div className={`container ${isSliderMode ? 'full-width' : ''}`}>
        <div className="" style={isSliderMode ? { padding: '0 60px' } : {}}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>فئات المنتجات</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', paddingBottom: '20px' }}>
            اكتشف مجموعتنا المتنوعة من منتجات العناية والجمال
          </p>
        </div>
        
        <div className={`categories-container ${isSliderMode ? 'slider-mode' : ''}`}>
          {isSliderMode ? (
            <Swiper {...swiperConfig}>
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <CategoryCard 
                    category={category} 
                    onClick={handleCategoryClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  category={category} 
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;