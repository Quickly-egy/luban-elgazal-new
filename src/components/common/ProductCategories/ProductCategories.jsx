import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ProductCategories.css';

const ProductCategories = () => {
  const [isSliderMode, setIsSliderMode] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);

  const categories = [
    {
      id: 1,
      name: 'العناية بالبشرة',
      bgColor: '#5DCCF0',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 2,
      name: 'منتجات الشعر',
      bgColor: '#F5B041',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 3,
      name: 'مستحضرات التجميل',
      bgColor: '#F06292',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 4,
      name: 'العطور والروائح',
      bgColor: '#81C784',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 5,
      name: 'منتجات الأطفال',
      bgColor: '#FF9800',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 6,
      name: 'المكملات الغذائية',
      bgColor: '#9C27B0',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 7,
      name: 'العناية بالجسم',
      bgColor: '#E91E63',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    },
    {
      id: 8,
      name: 'منتجات طبيعية',
      bgColor: '#4CAF50',
      image: '/src/assets/images/products/cosmetic-brand-2.png'
    }
  ];

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

  return (
    <section className="product-categories">
      <div className={`container ${isSliderMode ? 'full-width' : ''}`}>
        <div className="section-header" style={isSliderMode ? { padding: '0 60px' } : {}}>
          <h2 className="section-title">فئات المنتجات</h2>
          <p className="section-subtitle">اكتشف مجموعتنا المتنوعة من منتجات العناية والجمال</p>
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
                  <div className="category-card">
                    <div className="category-content">
                      <div className="category-wrapper">
                        <div 
                          className="category-shape"
                          style={{ backgroundColor: category.bgColor }}
                        >
                        </div>
                        <div className="category-image">
                          <img 
                            src={category.image} 
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
                          src={category.image} 
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