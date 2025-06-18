import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import './ImageSlider.css';

// Cache للبيانات
let sliderCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق

const ImageSlider = ({ images = [], autoPlay = true, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if cache is valid
  const isCacheValid = () => {
    if (!sliderCache || !cacheTimestamp) return false;
    return Date.now() - cacheTimestamp < CACHE_DURATION;
  };

  // Fetch slider data from API with caching
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        if (isCacheValid()) {
          console.log('Using cached slider data');
          const transformedData = sliderCache.map((item, index) => ({
            ...item,
            src: isMobile ? item.mobile_image_url : item.desktop_image_url,
          }));
          setSliderData(transformedData);
          setLoading(false);
          return;
        }

        console.log('Fetching fresh slider data');
        const response = await apiService.get('/home-sliders');

        if (response?.status === 'success' && response?.data) {
          // Cache the raw data
          sliderCache = response.data;
          cacheTimestamp = Date.now();
          
          // Transform API data to match component structure
          const transformedData = response.data.map((item, index) => ({
            id: item.id,
            src: isMobile ? item.mobile_image_url : item.desktop_image_url,
            alt: `Slider ${index + 1}`,
            order: item.order,
            mobile_image_url: item.mobile_image_url,
            desktop_image_url: item.desktop_image_url
          }));

          // Sort by order if needed
          const sortedData = transformedData.sort((a, b) => parseInt(a.order) - parseInt(b.order));
          setSliderData(sortedData);
        }
      } catch (err) {
        console.error('Error fetching slider data:', err);
        setError('فشل في تحميل صور السلايدر');
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, [isMobile]);

  // Use provided images or fetched slider data
  const slideImages = images.length > 0 ? images : sliderData;

  // Preload images and track loading states
  useEffect(() => {
    if (slideImages.length > 0) {
      const newLoadingStates = {};
      
      slideImages.forEach((image, index) => {
        newLoadingStates[index] = true;
        
        const img = new Image();
        img.onload = () => {
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: false
          }));
        };
        img.onerror = () => {
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: false
          }));
        };
        img.src = image.src;
      });
      
      setImageLoadingStates(newLoadingStates);
    }
  }, [slideImages]);

  // Auto play functionality
  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideImages.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isPlaying, slideImages.length, autoPlayInterval]);



  if (loading) {
    return (
      <div className="image-slider">
        <div className="slider-loading">
          <div className="loading-animation">
            <div className="loading-bar"></div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>جارٍ تحميل الصور...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-slider">
        <div className="slider-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (slideImages.length === 0) return null;

  return (
    <div className="image-slider">
      <div className="slider-container">
        {slideImages.map((image, index) => (
          <div
            key={image.id || index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
          >
            {/* Image loading overlay */}
            {imageLoadingStates[index] && (
              <div className="image-loading-overlay">
                <div className="image-loading-spinner"></div>
              </div>
            )}
          </div>
        ))}


      </div>
    </div>
  );
};

export default ImageSlider; 