import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import './ProductFilters.css';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    price: false,
    rating: false,
    weight: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    });
  };

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const handleWeightChange = (weight) => {
    onFilterChange({
      ...filters,
      weight: filters.weight === weight ? '' : weight
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      priceRange: [0, 10000],
      rating: 0,
      weight: '',
      searchTerm: filters.searchTerm // Keep search term
    });
  };

  const priceRanges = [
    { label: 'أقل من 100 جنيه', min: 0, max: 100 },
    { label: '100 - 500 جنيه', min: 100, max: 500 },
    { label: '500 - 1000 جنيه', min: 500, max: 1000 },
    { label: '1000 - 3000 جنيه', min: 1000, max: 3000 },
    { label: '3000 - 5000 جنيه', min: 3000, max: 5000 },
    { label: 'أكثر من 5000 جنيه', min: 5000, max: 10000 }
  ];

  const weightOptions = [
    { value: 'light', label: 'خفيف (أقل من 0.5 كجم)' },
    { value: 'medium', label: 'متوسط (0.5 - 2 كجم)' },
    { value: 'heavy', label: 'ثقيل (أكثر من 2 كجم)' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star-filled' : 'star-empty'}
        size={14}
      />
    ));
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>تصفية النتائج</h3>
        <button onClick={clearAllFilters} className="clear-filters-btn">
          مسح الكل
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <div 
          className="filter-header"
          onClick={() => toggleSection('category')}
        >
          <h4>الفئة</h4>
          {expandedSections.category ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.category && (
          <div className="filter-content">
            {categories.map(category => (
              <label key={category} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="checkmark"></span>
                {category}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <div 
          className="filter-header"
          onClick={() => toggleSection('price')}
        >
          <h4>السعر</h4>
          {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.price && (
          <div className="filter-content">
            {priceRanges.map((range, index) => (
              <label key={index} className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={
                    filters.priceRange[0] === range.min && 
                    filters.priceRange[1] === range.max
                  }
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                />
                <span className="checkmark"></span>
                {range.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="filter-section">
        <div 
          className="filter-header"
          onClick={() => toggleSection('rating')}
        >
          <h4>التقييم</h4>
          {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.rating && (
          <div className="filter-content">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="filter-option rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                <span className="checkmark"></span>
                <div className="rating-display">
                  {renderStars(rating)}
                  <span className="rating-text">
                    {rating} {rating === 1 ? 'نجمة' : 'نجوم'} فأكثر
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Weight Filter */}
      <div className="filter-section">
        <div 
          className="filter-header"
          onClick={() => toggleSection('weight')}
        >
          <h4>الوزن</h4>
          {expandedSections.weight ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.weight && (
          <div className="filter-content">
            {weightOptions.map(option => (
              <label key={option.value} className="filter-option">
                <input
                  type="radio"
                  name="weight"
                  checked={filters.weight === option.value}
                  onChange={() => handleWeightChange(option.value)}
                />
                <span className="checkmark"></span>
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters; 
 