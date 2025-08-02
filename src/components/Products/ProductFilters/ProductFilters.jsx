import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaTimes } from "react-icons/fa";
import { useCurrency } from "../../../hooks";
import "./ProductFilters.css";
import useProductsStore from "../../../stores/productsStore";
import BottomSheet from "../../common/BottomSheet";

const ProductFilters = ({
  filters,
  onFilterChange,
  categories,
  showProducts,
  showPackages,
  onShowProductsChange,
  onShowPackagesChange,
  products,
  packages,
  setShowProductsOfCategory,
  setClicked,
  setShowProductsOfPrice,
  onSearchChange,
}) => {
  // Helper function to handle display type changes
  const handleDisplayTypeChange = (products, packages) => {
    // Ensure at least one option is always selected
    if (!products && !packages) {
      return; // Don't allow both to be false
    }
    onShowProductsChange(products);
    onShowPackagesChange(packages);
    setClicked(false)
    onSearchChange("")
  };

  const url="https://app.quickly.codes/luban-elgazal/public/api"

  const { currencyInfo } = useCurrency();
  
  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  // Mobile dropdown states
  const [mobileDropdowns, setMobileDropdowns] = useState({
    displayType: false,
    category: false,
    price: false,
    rating: false,
  });
  

  
  // Desktop accordion sections (only functional ones)
  const [expandedSections, setExpandedSections] = useState({
    displayType: false,
    category: false,
    price: false,
    rating: false,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup body scroll lock
      document.body.style.overflow = '';
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleMobileDropdown = (section) => {
    setMobileDropdowns((prev) => {
      const newState = {
        ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Close all others
        [section]: !prev[section],
      };
      
      // Lock/unlock body scroll
      const isAnyOpen = Object.values(newState).some(value => value);
      document.body.style.overflow = isAnyOpen ? 'hidden' : '';
      
      return newState;
    });
  };

  const handleClearFilters = () => {
    setClicked(false);
    onSearchChange("");
    // Reset filters using the main filter handler
    onFilterChange({
      searchTerm: "",
      category: null,
      priceRange: null,
      rating: null,
    });
  };

  let AllData = [...products, ...packages];
  
  const handleCategoryChange = async (category) => {
    const transformProduct = useProductsStore.getState().transformProduct;
    try {
      const response = await fetch(`${url}/products?category_id=${category.id}`);
      const data = await response.json();
      const transformedProducts = data.data.data.map(transformProduct);
      setShowProductsOfCategory(transformedProducts);
      setClicked(true);
    } catch (error) {
      console.error("خطأ أثناء جلب المنتجات:", error);
    }
  };
  
  const handlePriceRangeChange = async (min, max) => {
    const transformProduct = useProductsStore.getState().transformProduct;
    try {
      const response = await fetch(`${url}/products?min_price=${min}&max_price=${max}`);
      const data = await response.json();
      const transformedProducts = data.data.data.map(transformProduct);
      setShowProductsOfCategory(transformedProducts);
      setClicked(true);
    } catch (error) {
      console.error("خطأ أثناء جلب المنتجات:", error);
    }
  };

  // Enhanced filter handlers for mobile to sync with main state
  const handleMobileFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value,
    });
  };



  // Price ranges (same as before)
  const priceRanges = [
    { min: 0, max: 50, label: `أقل من 50 ${currencyInfo.symbol}` },
    { min: 50, max: 100, label: `50 - 100 ${currencyInfo.symbol}` },
    { min: 100, max: 200, label: `100 - 200 ${currencyInfo.symbol}` },
    { min: 200, max: 500, label: `200 - 500 ${currencyInfo.symbol}` },
    { min: 500, max: 1000, label: `500 - 1000 ${currencyInfo.symbol}` },
    { min: 1000, max: Infinity, label: `أكثر من 1000 ${currencyInfo.symbol}` },
  ];

  // Rating options
  const ratingOptions = [
    { value: 5, label: "5 نجوم" },
    { value: 4, label: "4 نجوم فأكثر" },
    { value: 3, label: "3 نجوم فأكثر" },
    { value: 2, label: "2 نجوم فأكثر" },
    { value: 1, label: "1 نجمة فأكثر" },
  ];

  // Mobile Filter Button Component
  const MobileFilterButton = ({ title, onClick, isActive }) => {
    return (
      <button 
        className="mobile-filter-header"
        onClick={onClick}
      >
        <span>{title}</span>
        <FaChevronDown className={`mobile-filter-arrow ${isActive ? 'open' : ''}`} />
      </button>
    );
  };

  if (isMobile) {
    return (
      <div className="mobile-filters-container">
        <div className="mobile-filters-scroll">
          {/* نوع العرض */}
          <div className="mobile-filter-dropdown">
            <MobileFilterButton
              title="نوع العرض"
              onClick={() => toggleMobileDropdown('displayType')}
              isActive={mobileDropdowns.displayType}
            />
          </div>
          
          <BottomSheet
            isOpen={mobileDropdowns.displayType}
            onClose={() => toggleMobileDropdown('displayType')}
            title="نوع العرض"
            showSearch={false}
          >
            <div className="mobile-filter-options">
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobileDisplayType"
                  checked={showProducts && !showPackages}
                  onChange={() => {
                    handleDisplayTypeChange(true, false);
                    toggleMobileDropdown('displayType');
                  }}
                />
                المنتجات فقط
              </label>
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobileDisplayType"
                  checked={showPackages && !showProducts}
                  onChange={() => {
                    handleDisplayTypeChange(false, true);
                    toggleMobileDropdown('displayType');
                  }}
                />
                الباقات فقط
              </label>
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobileDisplayType"
                  checked={showProducts && showPackages}
                  onChange={() => {
                    handleDisplayTypeChange(true, true);
                    toggleMobileDropdown('displayType');
                  }}
                />
                الكل
              </label>
            </div>
          </BottomSheet>

          {/* الفئة */}
          <div className="mobile-filter-dropdown">
            <MobileFilterButton
              title="الفئة"
              onClick={() => toggleMobileDropdown('category')}
              isActive={mobileDropdowns.category}
            />
          </div>
          
          <BottomSheet
            isOpen={mobileDropdowns.category}
            onClose={() => toggleMobileDropdown('category')}
            title="الماركات"
            showSearch={true}
            searchPlaceholder="بحث في الماركات..."
          >
            <div className="mobile-filter-options">
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobileCategory"
                  checked={!filters.category}
                  onChange={() => {
                    handleMobileFilterChange('category', null);
                    setClicked(false);
                    toggleMobileDropdown('category');
                  }}
                />
                جميع الفئات
              </label>
              {categories ? categories.map((category, index) => (
                <label key={index} className="mobile-filter-option">
                  <input
                    type="radio"
                    name="mobileCategory"
                    checked={filters.category?.id === category.id}
                    onChange={() => {
                      handleCategoryChange(category);
                      toggleMobileDropdown('category');
                    }}
                  />
                  {category.name}
                </label>
              )) : null}
            </div>
          </BottomSheet>

          {/* السعر */}
          <div className="mobile-filter-dropdown">
            <MobileFilterButton
              title="السعر"
              onClick={() => toggleMobileDropdown('price')}
              isActive={mobileDropdowns.price}
            />
          </div>
          
          <BottomSheet
            isOpen={mobileDropdowns.price}
            onClose={() => toggleMobileDropdown('price')}
            title="نطاق السعر"
            showSearch={false}
          >
            <div className="mobile-filter-options">
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobilePrice"
                  checked={!filters.priceRange}
                  onChange={() => {
                    handleMobileFilterChange('priceRange', null);
                    toggleMobileDropdown('price');
                  }}
                />
                جميع الأسعار
              </label>
              {priceRanges.map((range, index) => (
                <label key={index} className="mobile-filter-option">
                  <input
                    type="radio"
                    name="mobilePrice"
                    checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                    onChange={() => {
                      handlePriceRangeChange(range.min, range.max);
                      handleMobileFilterChange('priceRange', range);
                      toggleMobileDropdown('price');
                    }}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </BottomSheet>

          {/* التقييم */}
          <div className="mobile-filter-dropdown">
            <MobileFilterButton
              title="التقييم"
              onClick={() => toggleMobileDropdown('rating')}
              isActive={mobileDropdowns.rating}
            />
          </div>
          
          <BottomSheet
            isOpen={mobileDropdowns.rating}
            onClose={() => toggleMobileDropdown('rating')}
            title="تقييم المنتجات"
            showSearch={false}
          >
            <div className="mobile-filter-options">
              <label className="mobile-filter-option">
                <input
                  type="radio"
                  name="mobileRating"
                  checked={!filters.rating}
                  onChange={() => {
                    handleMobileFilterChange('rating', null);
                    toggleMobileDropdown('rating');
                  }}
                />
                جميع التقييمات
              </label>
              {ratingOptions.map((rating, index) => (
                <label key={index} className="mobile-filter-option">
                  <input
                    type="radio"
                    name="mobileRating"
                    checked={filters.rating === rating.value}
                    onChange={() => {
                      handleMobileFilterChange('rating', rating.value);
                      toggleMobileDropdown('rating');
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {rating.label}
                    {Array.from({ length: Math.floor(rating.value) }, (_, i) => (
                      <FaStar key={i} style={{ color: '#fbbf24', fontSize: '12px' }} />
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </BottomSheet>
        </div>
      </div>
    );
  }

  return (
    <aside className="product-filters-new" role="complementary">
      {/* Clear Filters Header */}
      <div className="filters-header-new">
        <h3>فرز حسب</h3>
        <button 
          className="clear-filters-btn-new"
          onClick={handleClearFilters}
          aria-label="مسح جميع الفلاتر"
        >
          <FaTimes />
          مسح
        </button>
      </div>

      {/* Display Type Filter */}
      <div className="filter-section-new">
        <button
          className="filter-header-new"
          onClick={() => toggleSection("displayType")}
          aria-expanded={expandedSections.displayType}
        >
          <span>نوع العرض</span>
          {expandedSections.displayType ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.displayType && (
          <div className="filter-content-new">
            <label className="radio-option-new">
              <input
                type="radio"
                name="displayType"
                checked={showProducts && !showPackages}
                onChange={() => handleDisplayTypeChange(true, false)}
              />
              <span className="radio-checkmark-new"></span>
              <span>المنتجات فقط</span>
            </label>
            <label className="radio-option-new">
              <input
                type="radio"
                name="displayType"
                checked={showPackages && !showProducts}
                onChange={() => handleDisplayTypeChange(false, true)}
              />
              <span className="radio-checkmark-new"></span>
              <span>الباقات فقط</span>
            </label>
            <label className="radio-option-new">
              <input
                type="radio"
                name="displayType"
                checked={showProducts && showPackages}
                onChange={() => handleDisplayTypeChange(true, true)}
              />
              <span className="radio-checkmark-new"></span>
              <span>الكل</span>
            </label>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-section-new">
        <button
          className="filter-header-new"
          onClick={() => toggleSection("category")}
          aria-expanded={expandedSections.category}
        >
          <span>الفئة</span>
          {expandedSections.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.category && (
          <div className="filter-content-new">
            <label className="radio-option-new">
              <input
                type="radio"
                name="category"
                onChange={() => setClicked(false)}
              />
              <span className="radio-checkmark-new"></span>
              <span>جميع الفئات</span>
            </label>
            {categories ? categories.map((category, index) => (
              <label key={index} className="radio-option-new">
                <input
                  type="radio"
                  name="category"
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="radio-checkmark-new"></span>
                <span>{category.name}</span>
              </label>
            )) : <div className="filter-placeholder">لا توجد فئات للمنتجات</div>}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-section-new">
        <button
          className="filter-header-new"
          onClick={() => toggleSection("price")}
          aria-expanded={expandedSections.price}
        >
          <span>السعر</span>
          {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.price && (
          <div className="filter-content-new">
            {priceRanges.map((range, index) => (
              <label key={index} className="radio-option-new">
                <input
                  type="radio"
                  name="price"
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                />
                <span className="radio-checkmark-new"></span>
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="filter-section-new">
        <button
          className="filter-header-new"
          onClick={() => toggleSection("rating")}
          aria-expanded={expandedSections.rating}
        >
          <span>التقييم</span>
          {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.rating && (
          <div className="filter-content-new">
            {ratingOptions.map((rating, index) => (
              <label key={index} className="radio-option-new">
                <input
                  type="radio"
                  name="rating"
                  onChange={() => onFilterChange({ ...filters, rating: rating.value })}
                />
                <span className="radio-checkmark-new"></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rating.label}
                  {Array.from({ length: Math.floor(rating.value) }, (_, i) => (
                    <FaStar key={i} style={{ color: '#fbbf24', fontSize: '14px' }} />
                  ))}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProductFilters;
