import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ProductCategories.css';
import { productsAPI } from '../../../services/api';
import useProductsStore from '../../../stores/productsStore';

const ProductCategories = () => {
  const navigate = useNavigate();
  const [isSliderMode, setIsSliderMode] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default background colors for categories
  const bgColors = [
    '#5DCCF0', '#F5B041', '#F06292', '#81C784',
    '#FF9800', '#9C27B0', '#E91E63', '#4CAF50',
    '#3F51B5', '#FF5722', '#795548', '#607D8B'
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getCategories();

        if (response.success && response.data) {
          // Add background colors to categories (API already filters categories with stock)
          const categoriesWithBg = response.data.map((category, index) => ({
            ...category,
            bgColor: bgColors[index % bgColors.length]
          }));
          setCategories(categoriesWithBg);
        } else {
          setError('فشل في جلب فئات المنتجات');
        }
      } catch (err) {
        setError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



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
        newSlidesPerView = 1; // موبايل
      }

      setSlidesPerView(newSlidesPerView);
      setIsSliderMode(categories.length > newSlidesPerView);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="product-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" >فئات المنتجات</h2>
            <p className="section-subtitle">جاري تحميل الفئات...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="product-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">فئات المنتجات</h2>
            <p className="section-subtitle" style={{ color: '#dc2626' }}>{error}</p>
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
          <p className="section-subtitle" style={{ textAlign: 'center', paddingBottom: '20px' }}>اكتشف مجموعتنا المتنوعة من منتجات العناية والجمال</p>
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
                  slidesPerView: 1,
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