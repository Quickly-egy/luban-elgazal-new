import React, { useState } from 'react';
import { FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ProductGallery.css';

const ProductGallery = ({ images, productName, discount }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="product-gallery">
      {/* Thumbnail Images */}
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={image} alt={`${productName} ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="main-image-container">
        {discount && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}
        
        <div 
          className="main-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={images[currentImageIndex]} 
            alt={productName}
            className={`main-image ${isZoomed ? 'zoomed' : ''}`}
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery; 