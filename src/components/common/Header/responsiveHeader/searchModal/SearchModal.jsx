import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaClock, FaTags, FaArrowLeft } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import styles from './searchModal.module.css';

export default function SearchModal({ showSearchModal, setShowSearchModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);



  // Categories data
  const categories = [
    { name: 'العطور', icon: '🌸', count: 45 },
    { name: 'البخور', icon: '🔥', count: 32 },
    { name: 'العود', icon: '🪵', count: 28 },
    { name: 'المسك', icon: '💎', count: 19 },
    { name: 'العنبر', icon: '🟡', count: 15 },
    { name: 'الزعفران', icon: '🌾', count: 12 }
  ];

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [showSearchModal]);

  // Suggestions data
  const suggestionsList = [
    'عطور رجالية',
    'عطور نسائية', 
    'عود طبيعي',
    'بخور فاخر',
    'مسك أبيض',
    'عنبر خالص',
    'ورد طائفي',
    'زعفران أصلي',
    'عطر فرنسي',
    'بخور هندي',
    'مسك أسود',
    'عنبر أزرق'
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Generate suggestions based on input
    if (value.length > 0) {
      const filtered = suggestionsList.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Perform search (you can implement your search logic here)
      console.log('Searching for:', query);
      
      // Show search results or navigate to search page
      // Example: navigate to search results page
      // window.location.href = `/search?q=${encodeURIComponent(query)}`;
      
      // Close modal
      setShowSearchModal(false);
      setSearchQuery('');
      setSuggestions([]);
      
      // Show success message
      alert(`البحث عن: ${query}`);
    }
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        
        // Auto-focus input after voice recognition
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('البحث الصوتي غير مدعوم في هذا المتصفح');
    }
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Remove single history item
  const removeHistoryItem = (item) => {
    const newHistory = searchHistory.filter(historyItem => historyItem !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSearchModal(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchModal(false);
    }
  };

  // Prevent background scroll
  useEffect(() => {
    if (showSearchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearchModal]);

  return (
    <aside 
      className={`${styles.searchModal} ${showSearchModal ? styles.show : ""}`} 
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.searchHeader}>
          <button className={styles.backBtn} onClick={() => setShowSearchModal(false)}>
            <FaArrowLeft />
          </button>
          <div className={styles.searchInputContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <button 
              className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
              onClick={handleVoiceSearch}
              title="البحث الصوتي"
            >
              <IoMdMicrophone />
            </button>
          </div>
          <button className={styles.closeBtn} onClick={() => setShowSearchModal(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.searchContent}>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>اقتراحات البحث</h4>
              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSearch(suggestion)}
                  >
                    <FaSearch className={styles.suggestionIcon} />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && suggestions.length === 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>
                  <FaClock className={styles.titleIcon} />
                  عمليات البحث الأخيرة
                </h4>
                <button className={styles.clearBtn} onClick={clearHistory}>
                  مسح الكل
                </button>
              </div>
              <div className={styles.historyList}>
                {searchHistory.map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <button
                      className={styles.historyText}
                      onClick={() => handleSearch(item)}
                    >
                      <FaClock className={styles.historyIcon} />
                      <span>{item}</span>
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeHistoryItem(item)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Categories */}
          {suggestions.length === 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <FaTags className={styles.titleIcon} />
                تصفح حسب الفئة
              </h4>
              <div className={styles.categoriesList}>
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={styles.categoryItem}
                    onClick={() => handleSearch(category.name)}
                  >
                    <div className={styles.categoryIcon}>
                      {category.icon}
                    </div>
                    <div className={styles.categoryInfo}>
                      <span className={styles.categoryName}>{category.name}</span>
                      <span className={styles.categoryCount}>{category.count} منتج</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery.length > 0 && suggestions.length === 0 && (
            <div className={styles.section}>
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h4>لا توجد نتائج مطابقة</h4>
                <p>جرب البحث بكلمات مختلفة أو تصفح الفئات أدناه</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
