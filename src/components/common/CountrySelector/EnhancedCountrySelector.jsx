import React, { useState, useEffect } from "react";
import { FaGlobe, FaChevronDown, FaCheck, FaSearch } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import useLocationStore from "../../../stores/locationStore";
import { useGeography } from "../../../hooks/useGeography";
import styles from "./CountrySelector.module.css";

// Flag component using react-country-flag library
const FlagIcon = ({ countryCode }) => {
  return (
    <div className={styles.flagContainer}>
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: "20px",
          height: "15px",
        }}
        title={countryCode}
      />
    </div>
  );
};

const EnhancedCountrySelector = ({ 
  showCities = false, 
  onCountryChange, 
  onCityChange,
  useGCCOnly = true 
}) => {
  const { country, countryCode, setLocation, changeCountry } = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const {
    countries,
    cities,
    loading,
    error,
    searchCountries,
    handleCountryChange,
    handleCityChange
  } = useGeography();

  // GCC countries for fallback
  const gccCountries = [
    { name: "السعودية", code: "SA", countryName: "Saudi Arabia" },
    { name: "الإمارات", code: "AE", countryName: "United Arab Emirates" },
    { name: "قطر", code: "QA", countryName: "Qatar" },
    { name: "الكويت", code: "KW", countryName: "Kuwait" },
    { name: "البحرين", code: "BH", countryName: "Bahrain" },
    { name: "سلطنة عمان", code: "OM", countryName: "Oman" },
  ];

  // If no country is set, set a default to Saudi Arabia
  useEffect(() => {
    if (!countryCode && !country) {
      setLocation("السعودية", "SA");
    }
  }, [countryCode, country, setLocation]);

  // Use GCC countries or API countries based on useGCCOnly prop
  const availableCountries = useGCCOnly ? gccCountries : countries;

  // Filter countries based on search query
  const filteredCountries = availableCountries.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.countryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find current country display info
  const currentCountry = availableCountries.find((c) => c.code === countryCode) || {
    name: country || "اختر البلد",
    code: countryCode || "",
  };

  const handleCountrySelect = (selectedCountry) => {
    
    // Update location store
    changeCountry(selectedCountry.name, selectedCountry.code);
    
    // Update geography hook if using API
    if (!useGCCOnly) {
      handleCountryChange(selectedCountry);
    }
    
    // Reset city selection
    setSelectedCity(null);
    
    // Call parent callback
    if (onCountryChange) {
      onCountryChange(selectedCountry);
    }
    
    setIsOpen(false);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    
    // Update geography hook
    handleCityChange(city);
    
    // Call parent callback
    if (onCityChange) {
      onCityChange(city);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Search countries when query changes
  useEffect(() => {
    if (!useGCCOnly && searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchCountries(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, useGCCOnly, searchCountries]);

  return (
    <div className={styles.countrySelector}>
      <button
        className={styles.selectorButton}
        onClick={toggleDropdown}
        aria-label="اختيار البلد"
      >
        <div className={styles.currentCountry}>
          <FlagIcon countryCode={currentCountry.code} />
          <span className={styles.countryCode}>{currentCountry.code}</span>
          {selectedCity && (
            <span className={styles.cityName}>- {selectedCity.name}</span>
          )}
        </div>
        <FaChevronDown
          className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <div className={styles.dropdownHeader}>
              <h4>اختر بلدك</h4>
              {!useGCCOnly && (
                <div className={styles.searchContainer}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="ابحث عن دولة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
            </div>
            
            <div className={styles.countriesList}>
              {loading ? (
                <div className={styles.loading}>جاري التحميل...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((countryItem) => (
                  <button
                    key={countryItem.code}
                    className={`${styles.countryOption} ${
                      countryItem.code === countryCode ? styles.selected : ""
                    }`}
                    onClick={() => handleCountrySelect(countryItem)}
                  >
                    <div className={styles.countryInfo}>
                      <FlagIcon countryCode={countryItem.code} />
                      <span className={styles.countryName}>
                        {countryItem.name}
                      </span>
                      <span className={styles.countryCodeOption}>
                        ({countryItem.code})
                      </span>
                    </div>
                    {countryItem.code === countryCode && (
                      <FaCheck className={styles.checkIcon} />
                    )}
                  </button>
                ))
              ) : (
                <div className={styles.noResults}>لا توجد دول متطابقة</div>
              )}
            </div>

            {/* Cities section */}
            {showCities && currentCountry && cities.length > 0 && (
              <div className={styles.citiesSection}>
                <div className={styles.sectionHeader}>
                  <h5>اختر المدينة</h5>
                </div>
                <div className={styles.citiesList}>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      className={`${styles.cityOption} ${
                        selectedCity?.id === city.id ? styles.selected : ""
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className={styles.cityInfo}>
                        <span className={styles.cityName}>{city.name}</span>
                        {city.nameAr && city.nameAr !== city.name && (
                          <span className={styles.cityNameAr}>({city.nameAr})</span>
                        )}
                      </div>
                      {selectedCity?.id === city.id && (
                        <FaCheck className={styles.checkIcon} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default EnhancedCountrySelector; 