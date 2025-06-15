import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FAQSearch = ({ onFilter, totalItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCount, setFilteredCount] = useState(totalItems);

  useEffect(() => {
    const filtered = onFilter(searchTerm);
    setFilteredCount(filtered);
  }, [searchTerm, onFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <motion.div
      className="faq-search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="search-container">
        {/* Search Input */}
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="ابحث في الأسئلة الشائعة... (مثال: دعم، منتجات، ضمان)"
            className="search-input"
          />
          
          {/* Search Icon */}
          <div className="search-icon">
            <span>🔍</span>
          </div>

          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="clear-btn"
            >
              <span>✖</span>
            </button>
          )}
        </div>

        {/* Search Results Info */}
        <div className="search-results">
          {searchTerm ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredCount > 0 ? (
                <>
                  تم العثور على <span className="search-count">{filteredCount}</span> من النتائج
                  {searchTerm && (
                    <>
                      {' '}للبحث عن "<span className="search-term">{searchTerm}</span>"
                    </>
                  )}
                </>
              ) : (
                <>
                  لم يتم العثور على نتائج للبحث عن "<span className="search-term">{searchTerm}</span>"
                  <br />
                  <span>
                    جرب كلمات مفتاحية أخرى مثل: "دعم فني" أو "منتجات" أو "ضمان"
                  </span>
                </>
              )}
            </motion.p>
          ) : (
            <p>
              <span className="search-count">{totalItems}</span> سؤال وجواب متاح
            </p>
          )}
        </div>


      </div>
    </motion.div>
  );
};

export default FAQSearch; 