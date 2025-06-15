import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images = [], autoPlay = true, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Default images if none provided
  const defaultImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'منتجات عالية الجودة'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'تسوق أونلاين'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'عروض خاصة'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'خدمة عملاء'
    }
  ];

  const slideImages = images.length > 0 ? images : defaultImages;

  // Auto play functionality
  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideImages.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isPlaying, slideImages.length, autoPlayInterval]);



  if (slideImages.length === 0) return null;

  return (
    <div className="image-slider">
      <div className="slider-container">
        {slideImages.map((image, index) => (
          <div
            key={image.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
          >
          </div>
        ))}
      </div>


    </div>
  );
};

export default ImageSlider; 