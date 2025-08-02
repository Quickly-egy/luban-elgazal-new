import React, { useState, useEffect, useRef } from 'react';
import styles from './OptimizedImage.module.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/images/placeholder.jpg',
  loading = 'lazy',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before the image comes into view
          threshold: 0.1
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageSrc = hasError ? placeholder : (isInView ? src : placeholder);

  return (
    <div 
      ref={imgRef}
      className={`${styles.imageContainer} ${className}`}
      {...props}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && (
        <div className={styles.placeholder}>
          <div className={styles.shimmer}></div>
        </div>
      )}
      
      {/* Main Image */}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
};

export default OptimizedImage; 