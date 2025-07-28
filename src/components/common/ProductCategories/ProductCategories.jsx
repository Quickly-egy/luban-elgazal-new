import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ProductCategories.css';
import { cachedCategoriesAPI } from '../../../services/cachedAPI';
import useProductsStore from '../../../stores/productsStore';

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

  // Default background colors for categories
  const bgColors = [
    '#5DCCF0', '#F5B041', '#F06292', '#81C784',
    '#FF9800', '#9C27B0', '#E91E63', '#4CAF50',
    '#3F51B5', '#FF5722', '#795548', '#607D8B'
  ];

  // Fetch categories using cached API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📂 Fetching categories with cache-first strategy...');
        
        // استخدام الـ cached API
        const response = await cachedCategoriesAPI.getCategories();

        if (response.success && response.data) {
          // Add background colors to categories
          const categoriesWithBg = response.data.map((category, index) => ({
            ...category,
            bgColor: bgColors[index % bgColors.length]
          }));
          
          setCategories(categoriesWithBg);
          
          // حفظ معلومات الـ cache
          if (response._cacheInfo) {
            setCacheInfo(response._cacheInfo);
            console.log(`📂 Categories loaded (fromCache: ${response._cacheInfo.fromCache}, count: ${categoriesWithBg.length})`);
            
            if (response._cacheInfo.fromCache && response._cacheInfo.isStale) {
              console.log('🔄 Categories data is from cache but stale, background update is running...');
            }
          }
        } else {
          setError('فشل في جلب فئات المنتجات');
        }
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Force refresh categories
  const handleRefreshCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Force refreshing categories...');
      
      const response = await cachedCategoriesAPI.refreshCategoriesCache();
      
      if (response.success && response.data) {
        const categoriesWithBg = response.data.map((category, index) => ({
          ...category,
          bgColor: bgColors[index % bgColors.length]
        }));
        
        setCategories(categoriesWithBg);
        setError(null);
        console.log('✅ Categories refreshed successfully');
      }
    } catch (err) {
      console.error('❌ Error refreshing categories:', err);
      setError('فشل في تحديث الفئات');
    } finally {
      setLoading(false);
    }
  };

  // Handle category click - navigate to products page with selected category
  const handleCategoryClick = (category) => {
    // Set the category filter in the products store
    const store = useProductsStore.getState();
    store.setFilters({
      ...store.filters,
      category: category.name
    });

    // Navigate to products page
    navigate('/products');
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSlidesPerView;

      if (width >= 1600) {
        newSlidesPerView = 6; // شاشات كبيرة جداً
      } else if (width >= 1400) {
        newSlidesPerView = 5; // شاشات كبيرة
      } else if (width >= 1024) {
        newSlidesPerView = 4; // ديسكتوب
      } else if (width >= 768) {
        newSlidesPerView = 3; // تابلت كبير
      } else if (width >= 480) {
        newSlidesPerView = 2; // تابلت صغير
      } else {
        newSlidesPerView = 2; // موبايل - عرض عنصرين
      }

      setSlidesPerView(newSlidesPerView);
      setIsSliderMode(categories.length > newSlidesPerView);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories.length]);

  // Show loading state with shimmer
  if (loading) {
    return (
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
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <section className="product-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">فئات المنتجات</h2>
            <p className="section-subtitle" style={{ color: '#dc2626' }}>{error}</p>
            <button 
              onClick={handleRefreshCategories}
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
    );
  }

  // Show empty state if no categories
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
            <Swiper
              modules={[Autoplay]}
              spaceBetween={35}
              slidesPerView={slidesPerView}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 25,
                },
                1400: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
                1600: {
                  slidesPerView: 6,
                  spaceBetween: 35,
                },
              }}
              className="categories-swiper"
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <div
                    className="category-card"
                    onClick={() => handleCategoryClick(category)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="category-content">
                      <div className="category-wrapper">
                        <div
                          className="category-shape"
                          style={{ backgroundColor: category.bgColor }}
                        >
                        </div>
                        <div className="category-image">
                          <img
                            src={category.image_url}
                            alt={category.name}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="category-name">
                      <h3>{category.name}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="category-content">
                    <div className="category-wrapper">
                      <div
                        className="category-shape"
                        style={{ backgroundColor: category.bgColor }}
                      >
                      </div>
                      <div className="category-image">
                        <img
                          src={category.image_url}
                          alt={category.name}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="category-name">
                    <h3>{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories; 