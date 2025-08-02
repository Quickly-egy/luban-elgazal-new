import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { apiService } from '../../../services/api';
import './ImageSlider.css';

// Optimized cache management
const sliderCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  
  isValid() {
    return this.data && this.timestamp && 
           (Date.now() - this.timestamp < this.CACHE_DURATION);
  },
  
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  
  get() {
    return this.isValid() ? this.data : null;
  },
  
  clear() {
    this.data = null;
    this.timestamp = null;
  }
};

// Custom hook for mobile detection with debounce
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

// Custom hook for image preloading
const useImagePreloader = (slideImages) => {
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const loadedImagesRef = useRef(new Set());

  useEffect(() => {
    if (!slideImages.length) return;

    const newLoadingStates = {};
    const loadPromises = [];

    slideImages.forEach((image, index) => {
      const src = image.src;
      
      // Skip if already loaded
      if (loadedImagesRef.current.has(src)) {
        newLoadingStates[index] = false;
        return;
      }

      newLoadingStates[index] = true;
      
      const loadPromise = new Promise((resolve) => {
        const img = new Image();
        
        const handleLoad = () => {
          loadedImagesRef.current.add(src);
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: false
          }));
          resolve();
        };
        
        const handleError = () => {
          console.warn(`Failed to load image: ${src}`);
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: false
          }));
          resolve();
        };

        img.onload = handleLoad;
        img.onerror = handleError;
        
        // Set loading="lazy" equivalent
        img.loading = 'lazy';
        img.src = src;
      });
      
      loadPromises.push(loadPromise);
    });

    setImageLoadingStates(newLoadingStates);

    // Preload first 2 images immediately, others lazily
    Promise.all(loadPromises.slice(0, 2)).then(() => {
      // Load remaining images after a delay
      setTimeout(() => {
        Promise.all(loadPromises.slice(2));
      }, 1000);
    });

  }, [slideImages]);

  return imageLoadingStates;
};

const ImageSlider = ({ 
  images = [], 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = false 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMobile = useIsMobile();

  // Memoized API call function
  const fetchSliderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cachedData = sliderCache.get();
      if (cachedData) {
        console.log('📦 Using cached slider data');
        const transformedData = cachedData.map((item, index) => ({
          ...item,
          src: isMobile ? item.mobile_image_url : item.desktop_image_url,
        }));
        setSliderData(transformedData);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching fresh slider data...');
      const response = await apiService.get('/home-sliders');

      if (response?.status === 'success' && response?.data) {
        // Cache the raw data
        sliderCache.set(response.data);
        
        // Transform API data
        const transformedData = response.data.map((item, index) => ({
          id: item.id,
          src: isMobile ? item.mobile_image_url : item.desktop_image_url,
          alt: item.alt || `Slider ${index + 1}`,
          order: item.order,
          mobile_image_url: item.mobile_image_url,
          desktop_image_url: item.desktop_image_url
        }));

        // Sort by order
        const sortedData = transformedData.sort((a, b) => 
          parseInt(a.order || 0) - parseInt(b.order || 0)
        );
        
        setSliderData(sortedData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('🚫 Slider fetch error:', err);
      setError('فشل في تحميل صور السلايدر');
    } finally {
      setLoading(false);
    }
  }, [isMobile]);

  // Fetch data on mount and when mobile state changes
  useEffect(() => {
    fetchSliderData();
  }, [fetchSliderData]);

  // Memoize slide images
const slideImages = useMemo(() => {
  if (Array.isArray(images) && images.length > 0) {
    return images;
  }
  if (Array.isArray(sliderData) && sliderData.length > 0) {
    return sliderData;
  }
  return [];
}, [images, sliderData]);
  // Preload images
  const imageLoadingStates = useImagePreloader(slideImages);

  // Auto play with cleanup
  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideImages.length);
      }, autoPlayInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isPlaying, slideImages.length, autoPlayInterval]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slideImages.length) {
      setCurrentSlide(index);
    }
  }, [slideImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  }, [slideImages.length]);

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          event.preventDefault();
          toggleAutoPlay();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleAutoPlay]);

  // Loading state
  if (loading) {
    return (
      <div className="image-slider" role="region" aria-label="Image Slider Loading">
        <div className="slider-loading">
          <div className="shimmer-container">
            {[1, 2, 3].map(i => (
              <div key={i} className="shimmer-item" aria-hidden="true"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="image-slider" role="region" aria-label="Image Slider Error">
        <div className="slider-error">
          <p>{error}</p>
          <button onClick={fetchSliderData} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (slideImages.length === 0) return null;

  return (
    <div 
      className="image-slider" 
      role="region" 
      aria-label="Image Slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
    >
      <div className="slider-container">
        {slideImages.map((image, index) => {
          const isActive = index === currentSlide;
          const isNext = index === (currentSlide + 1) % slideImages.length;
          const isPrev = index === (currentSlide - 1 + slideImages.length) % slideImages.length;
          
          return (
           <div
  key={image.id || index}
  className={`slide ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
  role="group"
  aria-roledescription="slide"
  aria-hidden={!isActive}
>
  {(isActive || isNext || isPrev) && (
    <img
      src={image.src}
      alt={image.alt}
      width={"100%"}
      height={"auto"}
      loading="lazy"
      className="slide-image"
      style={{ objectFit: "cover" }}
    />
  )}

  {imageLoadingStates[index] && (
    <div className="image-loading-overlay" aria-hidden="true">
      <div className="image-loading-spinner"></div>
    </div>
  )}
</div>

          );
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideImages.length > 1 && (
        <>
          <button
            className="slider-arrow slider-arrow-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
            type="button"
          >
            &#8249;
          </button>
          <button
            className="slider-arrow slider-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
            type="button"
          >
            &#8250;
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slideImages.length > 1 && (
        <div className="slider-dots" role="tablist" aria-label="Slide navigation">
          {slideImages.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
              type="button"
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      <button
        className="slider-play-pause"
        onClick={toggleAutoPlay}
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        type="button"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  );
};

export default React.memo(ImageSlider);