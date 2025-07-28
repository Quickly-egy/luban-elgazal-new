import React, { useState, useEffect } from "react";
import { FaGlobe, FaChevronDown, FaCheck, FaMapMarkerAlt, FaSync, FaInfoCircle } from "react-icons/fa";
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
  const { 
    country, 
    countryCode, 
    originalCountryCode, // استخدام الكود الأصلي للعلم
    setLocation, 
    changeCountry, 
    autoDetectLocation,
    forceDetectLocation,
    getDetectionInfo,
    loading
  } = useLocationStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

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

  // الحصول على معلومات الموقع المكتشف
  const detectionInfo = getDetectionInfo();

  // List of supported GCC countries only
  const countries = [
    { name: "السعودية", code: "SA", flag: "🇸🇦" },
    { name: "الإمارات ", code: "AE", flag: "🇦🇪" },
    { name: "قطر", code: "QA", flag: "🇶🇦" },
    { name: "الكويت", code: "KW", flag: "🇰🇼" },
    { name: "البحرين", code: "BH", flag: "🇧🇭" },
    { name: "سلطنة عمان", code: "OM", flag: "🇴🇲" },
  ];

  const handleCountrySelect = (selectedCountry) => {
    changeCountry(selectedCountry.name, selectedCountry.code);
    setIsOpen(false);
  };

  // استخدام الكود الأصلي لعرض العلم الصحيح
  const displayCountryCode = originalCountryCode || countryCode || "SA";

  const currentCountry = countries.find((c) => c.code === countryCode) || {
    name: country || "السعودية",
    code: displayCountryCode, // استخدام الكود الأصلي للعلم
    flag: "🇸🇦", // fallback emoji (not used when ReactCountryFlag works)
  };

  // إعادة تحديد الموقع
  const handleRedetectLocation = async () => {
    try {
      setIsDetecting(true);
      console.log('🔄 Re-detecting user location...');
      await forceDetectLocation();
      console.log('✅ Location re-detection completed');
    } catch (error) {
      console.error('❌ Error re-detecting location:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className={styles.countrySelector}>
      {/* Desktop/Tablet View */}
      {!isMobile && (
        <div className={styles.dropdown}>
          <button
            className={styles.selectorButton}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="اختيار الدولة"
          >
            <div className={styles.currentCountry}>
              <FlagIcon countryCode={currentCountry.code} />
              <div className={styles.countryInfo}>
                <span className={styles.countryName}>{currentCountry.name}</span>
                <span className={styles.countryCode}>({currentCountry.code})</span>
              </div>
              {/* إضافة مؤشر الموقع التلقائي */}
              {detectionInfo.isAutoDetected && (
                <FaMapMarkerAlt 
                  className={styles.autoDetectedIcon} 
                  title="تم تحديد موقعك تلقائياً"
                />
              )}
            </div>
            <FaChevronDown className={styles.dropdownIcon} />
          </button>

          {isOpen && (
            <div className={styles.dropdownMenu}>
              {/* معلومات الموقع التلقائي */}
              {detectionInfo.isAutoDetected && (
                <div className={styles.locationInfoSection}>
                  <div className={styles.locationInfoHeader}>
                    <FaInfoCircle className={styles.infoIcon} />
                    <span>تم تحديد موقعك تلقائياً</span>
                    <button
                      className={styles.redetectButton}
                      onClick={handleRedetectLocation}
                      disabled={isDetecting}
                      title="إعادة تحديد الموقع"
                    >
                      <FaSync className={`${styles.syncIcon} ${isDetecting ? styles.spinning : ''}`} />
                    </button>
                  </div>
                  {detectionInfo.city && (
                    <div className={styles.locationDetails}>
                      <span>المدينة: {detectionInfo.city}</span>
                    </div>
                  )}
                  <div className={styles.divider}></div>
                </div>
              )}

              {/* قائمة الدول */}
              <div className={styles.countriesDropdown}>
                {countries.map((countryItem) => (
                  <button
                    key={countryItem.code}
                    className={`${styles.countryOption} ${
                      countryItem.code === countryCode ? styles.selected : ""
                    }`}
                    onClick={() => handleCountrySelect(countryItem)}
                  >
                    <FlagIcon countryCode={countryItem.code} />
                    <div className={styles.countryInfo}>
                      <span className={styles.countryName}>
                        {countryItem.name}
                      </span>
                      <span className={styles.countryCode}>
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
          )}
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        isOpen={isMobile && isOpen}
        onClose={() => setIsOpen(false)}
        title="اختيار الدولة"
      >
        <div className={styles.countriesBottomSheet}>
          {/* معلومات الموقع التلقائي للموبايل */}
          {detectionInfo.isAutoDetected && (
            <div className={styles.locationInfoSectionMobile}>
              <div className={styles.locationInfoHeaderMobile}>
                <FaMapMarkerAlt className={styles.autoDetectedIconMobile} />
                <span>تم تحديد موقعك تلقائياً</span>
                <button
                  className={styles.redetectButtonMobile}
                  onClick={handleRedetectLocation}
                  disabled={isDetecting}
                >
                  <FaSync className={`${styles.syncIconMobile} ${isDetecting ? styles.spinning : ''}`} />
                </button>
              </div>
              {detectionInfo.city && (
                <div className={styles.locationDetailsMobile}>
                  <span>📍 {detectionInfo.city}</span>
                </div>
              )}
              <div className={styles.dividerMobile}></div>
            </div>
          )}

          {countries.map((countryItem) => (
            <button
              key={countryItem.code}
              className={`${styles.countryOptionBottomSheet} ${
                countryItem.code === countryCode ? styles.selectedBottomSheet : ""
              }`}
              onClick={() => handleCountrySelect(countryItem)}
            >
              <FlagIcon countryCode={countryItem.code} />
              <div className={styles.countryInfoBottomSheet}>
                <div className={styles.countryTextBottomSheet}>
                  <span className={styles.countryNameBottomSheet}>
                    {countryItem.name}
                  </span>
                  <span className={styles.countryCodeBottomSheet}>
                    ({countryItem.code})
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

      {/* زر للموبايل */}
      {isMobile && (
        <button
          className={styles.selectorButton}
          onClick={() => setIsOpen(true)}
          aria-label="اختيار الدولة"
        >
          <div className={styles.currentCountry}>
            <FlagIcon countryCode={currentCountry.code} />
            <div className={styles.countryInfo}>
              <span className={styles.countryName}>{currentCountry.name}</span>
              <span className={styles.countryCode}>({currentCountry.code})</span>
            </div>
            {/* مؤشر الموقع التلقائي للموبايل */}
            {detectionInfo.isAutoDetected && (
              <FaMapMarkerAlt 
                className={styles.autoDetectedIconMobile} 
                title="تم تحديد موقعك تلقائياً"
              />
            )}
          </div>
          <FaChevronDown className={styles.dropdownIcon} />
        </button>
      )}
    </div>
  );
};

export default CountrySelector;
