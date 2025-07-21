import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
import { useCurrency } from "../../../hooks";
import "./ProductFilters.css";
import useProductsStore from "../../../stores/productsStore";

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
  const handleCategoryChange =async (category) => {
  const transformProduct = useProductsStore.getState().transformProduct;
 try {
    const response = await fetch(`${url}/products?category_id=${category.id}`);
    const data = await response.json();
    // console.log(data.data.data)
    const transformedProducts = data.data.data.map(transformProduct);
    setShowProductsOfCategory(transformedProducts);
      setClicked(true);
 // تأكد إنك عامل state اسمه كده
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }
 
  // onSearchChange("")
    
  //   const ProductOfCategory = AllData.filter(
  //     (item) => item.category === category.name
  //   );
   
  //   setShowProductsOfCategory(ProductOfCategory);
    // setClicked(true);

    

  
  };
  const handlePriceRangeChange = async (min, max) => {
   

  //   const productsWithPricesArray = AllData.map(product => ({
  //     ...product,
  //     pricesArray: Object.entries(product.prices).map(([countryCode, priceData]) => ({
  //         countryCode,
  //         currency: priceData.currency,
  //         symbol: priceData.symbol,
  //         price: parseFloat(priceData.price)
  //     }))
  // }));

  // if(currencyInfo.currency==="BHD")
  // {
  //   let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_bhd <= max &&item.price_bhd >=min)

  //   setShowProductsOfCategory(PriceFilterPrducts)
  //           setClicked(true)


  // }
  // if(currencyInfo.currency==="QAR")
  //   {
  //     let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_qar <= max &&item.price_qar >=min)
  
  //     setShowProductsOfCategory(PriceFilterPrducts)
  //     setClicked(true)
  //   }
  //   if(currencyInfo.currency==="SAR")
  //     {
  //       let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_sar <= max &&item.price_sar >=min)
    
  //       setShowProductsOfCategory(PriceFilterPrducts)
  //       setClicked(true)
  //     }
  //     if(currencyInfo.currency==="OMR")
  //       {
  //         let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_omr <= max &&item.price_omr >=min)
      
  //         setShowProductsOfCategory(PriceFilterPrducts)
  //         setClicked(true)
  //       }
  //       if(currencyInfo.currency==="KWD")
  //         {
  //           let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_kwd <= max &&item.price_kwd >=min)
        
  //           setShowProductsOfCategory(PriceFilterPrducts)
  //           setClicked(true)
  //         }
  //         if(currencyInfo.currency==="AED")
  //           {
  //             let PriceFilterPrducts = productsWithPricesArray.filter((item)=>item.price_aed <= max &&item.price_aed >=min)
          
  //             setShowProductsOfCategory(PriceFilterPrducts)
  //             setClicked(true)
  //           }
const transformProduct = useProductsStore.getState().transformProduct;
 try {
    const response = await fetch(`${url}/products?min_price=${min}&max_price=${max}`);
    const data = await response.json();
    // console.log(data.data.data)
    const transformedProducts = data.data.data.map(transformProduct);
    setShowProductsOfCategory(transformedProducts);
      setClicked(true);
 // تأكد إنك عامل state اسمه كده
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }

            onSearchChange("")
           setClicked(true)

  };

  

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

   
    </div>
  );
};

export default ProductFilters;
