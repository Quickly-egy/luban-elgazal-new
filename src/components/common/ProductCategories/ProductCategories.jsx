import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ProductCategories.css';
import { cachedCategoriesAPI } from '../../../services/cachedAPI';
import useProductsStore from '../../../stores/productsStore';

const BG_COLORS = [
  '#5DCCF0', '#F5B041', '#F06292', '#81C784',
  '#FF9800', '#9C27B0', '#E91E63', '#4CAF50',
  '#3F51B5', '#FF5722', '#795548', '#607D8B'
];

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
        <div className="category-shape" style={{ backgroundColor: category.bgColor }} />
        <div className="category-image">
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            onError={(e) => {
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

const LoadingShimmer = React.memo(() => (
  <section className="product-categories">
    <div className="container">
      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <h2 className="section-title">فئات المنتجات</h2>
        <p className="section-subtitle">اكتشف مجموعتنا المتنوعة من منتجات العناية والجمال</p>
      </div>
      <div className="categories-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div 
            key={index} 
            className="category-card shimmer-card"
            style={{ animationDelay: `${index * 0.1}s`, animation: `shimmerCard 1.5s infinite ${index * 0.1}s` }}
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

const ProductCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isSliderMode, setIsSliderMode] = useState(false);

  const calculateSlidesPerView = useCallback((width) => {
    if (width >= 1600) return 6;
    if (width >= 1400) return 5;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }, []);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const newSlidesPerView = calculateSlidesPerView(width);
    setSlidesPerView(newSlidesPerView);
    setIsSliderMode(categories.length > newSlidesPerView);
  }, [categories.length, calculateSlidesPerView]);

  const debouncedHandleResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };
  }, [handleResize]);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = forceRefresh
        ? await cachedCategoriesAPI.refreshCategoriesCache()
        : await cachedCategoriesAPI.getCategories();

      if (response.success && response.data) {
        requestAnimationFrame(() => {
          const categoriesWithBg = response.data.map((cat, index) => ({
            ...cat,
            bgColor: BG_COLORS[index % BG_COLORS.length]
          }));
          setCategories(categoriesWithBg);
        });
      } else {
        setError('فشل في جلب فئات المنتجات');
      }
    } catch (err) {
      console.error(err);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefreshCategories = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  const handleCategoryClick = useCallback((category) => {
    const store = useProductsStore.getState();
    store.setFilters({
      ...store.filters,
      category: category.name
    });
    navigate('/products');
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', debouncedHandleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [handleResize, debouncedHandleResize]);

  const swiperConfig = useMemo(() => ({
    modules: [Autoplay],
    spaceBetween: 35,
    slidesPerView,
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

  if (loading) return <LoadingShimmer />;
  if (error) return <ErrorState error={error} onRetry={handleRefreshCategories} />;
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
                  <CategoryCard category={category} onClick={handleCategoryClick} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onClick={handleCategoryClick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
