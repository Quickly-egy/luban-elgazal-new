import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import './ImageSlider.css';

const ImageSlider = ({ images = [], autoPlay = true, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch slider data from API
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/home-sliders');

        if (response?.status === 'success' && response?.data) {
          // Transform API data to match component structure
          const transformedData = response.data.map((item, index) => ({
            id: item.id,
            src: isMobile ? item.mobile_image_url : item.desktop_image_url,
            alt: `Slider ${index + 1}`,
            order: item.order
          }));

          // Sort by order if needed
          const sortedData = transformedData.sort((a, b) => parseInt(a.order) - parseInt(b.order));
          setSliderData(sortedData);
        }
      } catch (err) {
        console.error('Error fetching slider data:', err);
        setError('Failed to load slider images');
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, [isMobile]);

  // Use provided images or fetched slider data
  const slideImages = images.length > 0 ? images : sliderData;

  // Auto play functionality
  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideImages.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isPlaying, slideImages.length, autoPlayInterval]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="image-slider">
        <div className="slider-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
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
            key={image.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
          >
          </div>
        ))}

        {/* Navigation Controls */}
        {slideImages.length > 1 && (
          <>
            <button className="slider-nav prev" onClick={prevSlide}>
              &#8249;
            </button>
            <button className="slider-nav next" onClick={nextSlide}>
              &#8250;
            </button>

            {/* Dots Indicator */}
            <div className="slider-dots">
              {slideImages.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button className="play-pause-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSlider; 