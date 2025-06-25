import React, { useState } from "react";
import { FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./PackageGallery.css";

const PackageGallery = ({ packageData }) => {
  // Get all images from the package
  const mainImage = packageData?.main_image_url;
  const secondaryImages = packageData?.secondary_image_urls || [];
  const allImages = mainImage ? [mainImage, ...secondaryImages] : secondaryImages;

  // التأكد من وجود صور صالحة
  const validImages = allImages.filter(
    (img) => img && typeof img === "string" && img.trim() !== ""
  );
  const displayImages =
    validImages.length > 0
      ? validImages
      : ["https://via.placeholder.com/600x400?text=صورة+الباقة"];

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
    <div className="package-gallery">
      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="thumbnail-container">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${
                index === currentImageIndex ? "active" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`${packageData.name} ${index + 1}`}
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
        <div
          className="main-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={packageData.name}
            className={`main-image ${isZoomed ? "zoomed" : ""}`}
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x400?text=صورة+الباقة";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PackageGallery; 