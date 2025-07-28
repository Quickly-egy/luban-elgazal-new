import React, { useState, useEffect } from "react";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import useLocationStore from "../../../stores/locationStore";
import BottomSheet from "../BottomSheet";
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

const CountrySelector = () => {
  const { country, countryCode, setLocation, changeCountry } =
    useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If no country is set, set a default to Saudi Arabia
  useEffect(() => {
    if (!countryCode && !country) {
      setLocation("السعودية", "SA");
    }
  }, [countryCode, country, setLocation]);

  // List of supported GCC countries only
  const countries = [
    { name: "السعودية", code: "SA", flag: "🇸🇦" },
    { name: "الإمارات ", code: "AE", flag: "🇦🇪" },
    { name: "قطر", code: "QA", flag: "🇶🇦" },
    { name: "الكويت", code: "KW", flag: "🇰🇼" },
    { name: "البحرين", code: "BH", flag: "🇧🇭" },
    { name: "سلطنة عمان", code: "OM", flag: "🇴🇲" },
  ];

  // Find current country display info
  const currentCountry = countries.find((c) => c.code === countryCode) || {
    name: country || "اختر البلد",
    code: countryCode || "",
    flag: countryCode === "USD" ? "💵" : "🌍",
  };

  const handleCountrySelect = (selectedCountry) => {
    changeCountry(selectedCountry.name, selectedCountry.code);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Debug: Log current country on change
  // useEffect(() => {
  // }, [country, countryCode]);

  return (
    <div className={styles.countrySelector}>
      <button
        className={styles.selectorButton}
        onClick={toggleDropdown}
        aria-label="اختيار البلد"
      >
        <div className={styles.currentCountry}>
          <FlagIcon countryCode={currentCountry.code} />
          
        </div>
        <FaChevronDown
          className={`${styles.dropdownIcon} ${isOpen ? styles.open : ""}`}
        />
      </button>

      {/* Desktop Dropdown */}
      {isOpen && !isMobile && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <div className={styles.dropdownHeader}>
              <h4>اختر بلدك</h4>
            </div>
            <div className={styles.countriesList}>
              {countries.map((countryItem) => (
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
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        isOpen={isOpen && isMobile}
        onClose={() => setIsOpen(false)}
        title="اختر بلدك"
        showSearch={false}
      >
        <div className={styles.countriesBottomSheet}>
          {countries.map((countryItem) => (
            <button
              key={countryItem.code}
              className={`${styles.countryOptionBottomSheet} ${
                countryItem.code === countryCode ? styles.selectedBottomSheet : ""
              }`}
              onClick={() => handleCountrySelect(countryItem)}
            >
              <div className={styles.countryInfoBottomSheet}>
                <FlagIcon countryCode={countryItem.code} />
                <div className={styles.countryTextBottomSheet}>
                  <span className={styles.countryNameBottomSheet}>
                    {countryItem.name}
                  </span>
                  <span className={styles.countryCodeBottomSheet}>
                    {countryItem.code}
                  </span>
                </div>
              </div>
              {countryItem.code === countryCode && (
                <FaCheck className={styles.checkIconBottomSheet} />
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Overlay to close dropdown when clicking outside - Desktop only */}
      {isOpen && !isMobile && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default CountrySelector;
