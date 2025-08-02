import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { apiService } from '../../../services/api';
import './ImageSlider.css';

const ImageSlider = ({
  images = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  const fetchSliderData = useCallback(async () => {
    try {
      setError(null);
      const response = await apiService.get('/home-sliders');

      if (response?.status === 'success' && response?.data) {
        const transformed = response.data.map((item, index) => ({
          id: item.id,
          src: isMobile ? item.mobile_image_url : item.desktop_image_url,
          alt: item.alt || `Slider ${index + 1}`,
          order: parseInt(item.order || 0)
        }));
        setSliderData(transformed.sort((a, b) => a.order - b.order));
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Slider Error:', err);
      setError('فشل في تحميل صور السلايدر');
    }
  }, [isMobile]);

  useEffect(() => {
    fetchSliderData();
  }, [fetchSliderData]);

  const slideImages = useMemo(() => {
    return images.length > 0 ? images : sliderData;
  }, [images, sliderData]);

  useEffect(() => {
    if (autoPlay && slideImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slideImages.length);
      }, autoPlayInterval);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoPlay, autoPlayInterval, slideImages.length]);

  const goToSlide = index => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slideImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slideImages.length) % slideImages.length);

  if (error) {
    return (
      <div className="image-slider error">
        <p>{error}</p>
        <button onClick={fetchSliderData}>إعادة المحاولة</button>
      </div>
    );
  }

  if (slideImages.length === 0) return null;

  return (
    <div
      className="image-slider"
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        if (autoPlay && slideImages.length > 1) {
          intervalRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
          }, autoPlayInterval);
        }
      }}
    >
      <div className="slider-container">
        <img
          src={slideImages[currentSlide].src}
          alt={slideImages[currentSlide].alt}
          className="slide-image"
          width="100%"
          height="auto"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {showArrows && slideImages.length > 1 && (
        <>
          <button className="slider-arrow slider-arrow-prev" onClick={prevSlide}>
            &#8249;
          </button>
          <button className="slider-arrow slider-arrow-next" onClick={nextSlide}>
            &#8250;
          </button>
        </>
      )}

      {showDots && slideImages.length > 1 && (
        <div className="slider-dots">
          {slideImages.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageSlider);
