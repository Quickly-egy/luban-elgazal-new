import React, { useState } from "react";
import { FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ProductGallery.css";

const ProductGallery = ({ images = [], productName, discount, label }) => {
  // التأكد من وجود صور صالحة
  const validImages = images.filter(
    (img) => img && typeof img === "string" && img.trim() !== ""
  );
  const displayImages =
    validImages.length > 0
      ? validImages
      : ["https://via.placeholder.com/600x400?text=صورة+المنتج"];

  // تطوير مؤقت - معلومات مفصلة
  console.log("=== ProductGallery Debug ===");
  console.log("Raw images received:", images);
  console.log("Images type:", typeof images);
  console.log("Images is array:", Array.isArray(images));
  console.log("Images length:", images?.length);
  console.log("Valid images:", validImages);
  console.log("Display images:", displayImages);
  console.log("Display images count:", displayImages.length);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
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
      {/* Thumbnail Images - عرض دائماً للاختبار */}
      {true && (
        <div className="thumbnail-container">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${
                index === currentImageIndex ? "active" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              {label && (
                <div
                  className="thumbnail-label"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </div>
              )}
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/100x100?text=صورة";
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="main-image-container">
        {/* {discount && discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )} */}

        {label && (
          <div className="main-label" style={{ backgroundColor: label.color }}>
            {label.name}
          </div>
        )}

        <div
          className="main-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={productName}
            className={`main-image ${isZoomed ? "zoomed" : ""}`}
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x400?text=صورة+المنتج";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
