import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { apiService } from '../../../services/api';
import './ImageSlider.css';

const ImageSlider = ({
  images = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  
  // Touch and drag support
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);

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

  // Touch and drag handlers
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    clearInterval(intervalRef.current);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    setCurrentX(clientX);
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = currentX - startX;
    const threshold = 50; // minimum distance to trigger slide change
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setDragOffset(0);
    
    // Restart autoplay
    if (autoPlay && slideImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slideImages.length);
      }, autoPlayInterval);
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, currentX, startX]);

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
      ref={sliderRef}
      className="image-slider"
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        if (autoPlay && slideImages.length > 1 && !isDragging) {
          intervalRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
          }, autoPlayInterval);
        }
      }}
    >
      <div 
        className="slider-container"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        <img
          src={slideImages[currentSlide].src}
          alt={slideImages[currentSlide].alt}
          className="slide-image"
          width="100%"
          height="100%"
          loading="eager"
          style={{ 
            objectFit: 'contain', 
            background: '#fff',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      </div>

   

          <button className="slider-arrow slider-arrow-prev" onClick={prevSlide}>
        <span> &#8250;</span>
      </button>
      <button className="slider-arrow slider-arrow-next" onClick={nextSlide}>
        <span> &#8249;</span>
      </button>
 

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
