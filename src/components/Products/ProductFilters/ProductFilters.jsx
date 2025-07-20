import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
import { useCurrency } from "../../../hooks";
import "./ProductFilters.css";
import { productsAPI } from "../../../services/api";

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
  const [expandedSections, setExpandedSections] = useState({
    displayType: true, // نوع العرض مفتوح افتراضياً
    category: false,
    price: false,
    rating: false,
    weight: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  let AllData = [...products, ...packages];
  const handleCategoryChange = (category) => {
 
  onSearchChange("")
    
    const ProductOfCategory = AllData.filter(
      (item) => item.category === category.name
    );
   
    setShowProductsOfCategory(ProductOfCategory);
    setClicked(true);
      // fetch(`${url}/products?category_id=${category.id}`)
      // .then((res)=>res.json()).then((data)=>setAllData(data.data.data))
      // .catch((error)=>{
      //  console.log(error)
      // })

  
  };
  const handlePriceRangeChange = (min, max) => {
   

    const productsWithPricesArray = AllData.map(product => ({
      ...product,
      pricesArray: Object.entries(product.prices).map(([countryCode, priceData]) => ({
          countryCode,
          currency: priceData.currency,
          symbol: priceData.symbol,
          price: parseFloat(priceData.price)
      }))
  }));

  if(currencyInfo.currency==="BHD")
  {
    let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_bhd <= max &&item.price_bhd >=min)
    console.log(PriceFilterPrducts,"yousef Khaled")
    setShowProductsOfCategory(PriceFilterPrducts)
            setClicked(true)


  }
  if(currencyInfo.currency==="QAR")
    {
      let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_qar <= max &&item.price_qar >=min)
      console.log(PriceFilterPrducts,"yousef Khaled")
      setShowProductsOfCategory(PriceFilterPrducts)
      setClicked(true)
    }
    if(currencyInfo.currency==="SAR")
      {
        let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_sar <= max &&item.price_sar >=min)
        console.log(PriceFilterPrducts,"yousef Khaled")
        setShowProductsOfCategory(PriceFilterPrducts)
        setClicked(true)
      }
      if(currencyInfo.currency==="OMR")
        {
          let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_omr <= max &&item.price_omr >=min)
          console.log(PriceFilterPrducts,"yousef Khaled")
          setShowProductsOfCategory(PriceFilterPrducts)
          setClicked(true)
        }
        if(currencyInfo.currency==="KWD")
          {
            let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_kwd <= max &&item.price_kwd >=min)
            console.log(PriceFilterPrducts,"yousef Khaled")
            setShowProductsOfCategory(PriceFilterPrducts)
            setClicked(true)
          }
          if(currencyInfo.currency==="AED")
            {
              let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_aed <= max &&item.price_aed >=min)
              console.log(PriceFilterPrducts,"yousef Khaled")
              setShowProductsOfCategory(PriceFilterPrducts)
              setClicked(true)
            }


            onSearchChange("")
           setClicked(true)

  };

  // const handleRatingChange = (rating) => {
  //   // onFilterChange({
  //   //   ...filters,
  //   //   rating: filters.rating === rating ? 0 : rating,
  //   // });
  //   console.log(rating, 'hamooooo')
  // };

  const handleWeightChange = (weight) => {
    onFilterChange({
      ...filters,
      weight: filters.weight === weight ? "" : weight,
    });
  };

  const clearAllFilters = () => {
    setClicked(false)
  };

  const priceRanges = [
    { label: `أقل من 100 ${currencyInfo.symbol}`, min: 0, max: 100 },
    { label: `100 - 500 ${currencyInfo.symbol}`, min: 100, max: 500 },
    { label: `500 - 1000 ${currencyInfo.symbol}`, min: 500, max: 1000 },
    { label: `1000 - 3000 ${currencyInfo.symbol}`, min: 1000, max: 3000 },
    { label: `3000 - 5000 ${currencyInfo.symbol}`, min: 3000, max: 5000 },
    { label: `أكثر من 5000 ${currencyInfo.symbol}`, min: 5000, max: 10000 },
  ];

  // const weightOptions = [
  //   { value: "light", label: "خفيف (أقل من 0.5 كجم)" },
  //   { value: "medium", label: "متوسط (0.5 - 2 كجم)" },
  //   { value: "heavy", label: "ثقيل (أكثر من 2 كجم)" },
  // ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star-filled" : "star-empty"}
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

      {/* Display Type Filter */}
      <div className="filter-section">
        <div
          className="filter-header"
          onClick={() => toggleSection("displayType")}
        >
          <h4>نوع العرض</h4>
          {expandedSections.displayType ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.displayType && (
          <div className="filter-content">
            <label className="filter-option">
              <input
                type="radio"
                name="displayType"
                checked={showProducts && !showPackages}
                onChange={() => handleDisplayTypeChange(true, false)}
              />
              <span className="checkmark"></span>
              <span className="option-text">
                <span className="option-title">المنتجات فقط</span>
                <span className="option-description">
                  عرض المنتجات الفردية فقط
                </span>
              </span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="displayType"
                checked={showPackages && !showProducts}
                onChange={() => handleDisplayTypeChange(false, true)}
              />
              <span className="checkmark"></span>
              <span className="option-text">
                <span className="option-title">الباقات فقط</span>
                <span className="option-description">
                  عرض الباقات والعروض المجمعة فقط
                </span>
              </span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="displayType"
                checked={showProducts && showPackages}
                onChange={() => handleDisplayTypeChange(true, true)}
              />
              <span className="checkmark"></span>
              <span className="option-text">
                <span className="option-title">الكل</span>
                <span className="option-description">
                  عرض المنتجات والباقات معاً
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <div
          className="filter-header"
          onClick={() => toggleSection("category")}
        >
          <h4>الفئة</h4>
          {expandedSections.category ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.category && (
          <div className="filter-content">
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                // checked={filters.category === ""}
                onChange={() =>setClicked(false)}
              />
              <span className="checkmark"></span>
              جميع الفئات
            </label>
           {categories? categories.map((category, index) => (
              <label key={index} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  // checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="checkmark"></span>
                {category.name}
              </label>
            )): 'لا توجد فئات للمنتجات '}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("price")}>
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
                  // checked={
                  //   filters.priceRange[0] === range.min &&
                  //   filters.priceRange[1] === range.max
                  // }
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
      {/* <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("rating")}>
          <h4>التقييم</h4>
          {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.rating && (
          <div className="filter-content">
            <label className="filter-option rating-option">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === 0}
                onChange={() => handleRatingChange(0)}
              />
              <span className="checkmark"></span>
              <div className="rating-display">
                <span>جميع التقييمات</span>
              </div>
            </label>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="filter-option rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                <span className="checkmark"></span>
                <div className="rating-display">
                  <div className="stars">{renderStars(rating)}</div>
                  <span>و أكثر</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div> */}

      {/* Weight Filter */}
      {/* <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("weight")}>
          <h4>الوزن</h4>
          {expandedSections.weight ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expandedSections.weight && (
          <div className="filter-content">
            {weightOptions.map((option) => (
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
      </div> */}
    </div>
  );
};

export default ProductFilters;
