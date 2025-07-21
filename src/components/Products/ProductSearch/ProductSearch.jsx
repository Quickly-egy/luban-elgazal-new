import React from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import './ProductSearch.css';
import useProductsStore from '../../../stores/productsStore';

const ProductSearch = ({ searchTerm, onSearchChange,setClicked,setShowProductsOfCategory, isLoading = false, placeholder = "ابحث عن المنتجات..." }) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

 const url="https://app.quickly.codes/luban-elgazal/public/api"
  const handleSearch=async (term)=>{

if(term){
    const transformProduct = useProductsStore.getState().transformProduct;
 try {
    const response = await fetch(`${url}/products?search=${term}`);
    const data = await response.json();
    // console.log(data.data.data)
    const transformedProducts = data.data.data.map(transformProduct);
    setShowProductsOfCategory(transformedProducts);
      setClicked(true);
 // تأكد إنك عامل state اسمه كده
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }

           setClicked(true)
}
else{
           setClicked(false)
}

  }

  return (
    <div className="product-search">
      <div className={`search-container ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <FaSpinner className="search-icon loading-spinner" />
        ) : (
          <FaSearch className="search-icon" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          // value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
          disabled={isLoading}
        />
        {searchTerm && !isLoading && (
          <button
            onClick={handleClearSearch}
            className="clear-search-btn"
            type="button"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSearch; 