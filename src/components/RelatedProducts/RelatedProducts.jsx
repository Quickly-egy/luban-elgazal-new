import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../common/ProductCard/ProductCard';
import './RelatedProducts.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RelatedProducts = ({ currentProduct }) => {
  // منتجات ذات صلة من نفس الفئة
  const relatedProducts = [
    {
      id: 2,
      name: "لابتوب HP Pavilion Gaming I7",
      weight: "2.3kg",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      originalPrice: 1800,
      discountedPrice: 1299,
      discountPercentage: 28,
      rating: 4.3,
      reviewsCount: 156,
      inStock: true,
      category: "لابتوب"
    },
    {
      id: 3,
      name: "لابتوب Dell Inspiron 15 Gaming",
      weight: "2.7kg", 
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
      originalPrice: 1650,
      discountedPrice: 1199,
      discountPercentage: 27,
      rating: 4.1,
      reviewsCount: 89,
      inStock: true,
      category: "لابتوب"
    },
    {
      id: 4,
      name: "لابتوب Lenovo IdeaPad Gaming",
      weight: "2.4kg",
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
      originalPrice: 1400,
      discountedPrice: 1050,
      discountPercentage: 25,
      rating: 4.0,
      reviewsCount: 72,
      inStock: true,
      category: "لابتوب"
    },
    {
      id: 5,
      name: "لابتوب MSI Gaming GF63",
      weight: "2.2kg",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
      originalPrice: 1900,
      discountedPrice: 1399,
      discountPercentage: 26,
      rating: 4.4,
      reviewsCount: 134,
      inStock: true,
      category: "لابتوب"
    },
    {
      id: 6,
      name: "لابتوب Acer Nitro 5 Gaming",
      weight: "2.5kg",
      image: "https://images.unsplash.com/photo-1515343480029-43d60d9dce80?w=400&h=300&fit=crop",
      originalPrice: 1600,
      discountedPrice: 1150,
      discountPercentage: 28,
      rating: 3.9,
      reviewsCount: 98,
      inStock: true,
      category: "لابتوب"
    },
    {
      id: 7,
      name: "لابتوب ROG Strix Gaming",
      weight: "2.8kg",
      image: "https://images.unsplash.com/photo-1603787081207-362bcef7f542?w=400&h=300&fit=crop",
      originalPrice: 2200,
      discountedPrice: 1699,
      discountPercentage: 23,
      rating: 4.6,
      reviewsCount: 203,
      inStock: true,
      category: "لابتوب"
    }
  ];

  const handleRatingClick = (product) => {
    console.log('عرض تقييمات المنتج:', product.name);
  };

  return (
    <div className="related-products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">منتجات ذات صلة</h2>
        </div>

        <div className="swiper-container">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom'
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 40,
              }
            }}
            className="related-products-swiper"
          >
            {relatedProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product}
                  onRatingClick={handleRatingClick}
                  showTimer={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <div className="swiper-pagination-custom"></div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts; 