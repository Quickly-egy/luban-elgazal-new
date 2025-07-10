import React, { useState, useEffect } from 'react';
import { useGeography } from '../../../hooks/useGeography';
import './GeographySelector.module.css';

const GeographySelector = ({ 
  onCountryChange, 
  onCityChange, 
  selectedCountry, 
  selectedCity,
  showCities = true,
  placeholder = {
    country: 'اختر الدولة',
    city: 'اختر المدينة'
  },
  className = ''
}) => {
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const {
    countries,
    cities,
    countriesLoading,
    citiesLoading,
    countriesError,
    citiesError,
    searchCountries,
    searchCities,
    handleCountryChange,
    handleCityChange
  } = useGeography();

  // تحديث البحث عند تغيير النص
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (countrySearch.trim()) {
        searchCountries(countrySearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [countrySearch, searchCountries]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (citySearch.trim() && selectedCountry) {
        searchCities(selectedCountry.countryName, citySearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearch, selectedCountry, searchCities]);

  const handleCountrySelect = (country) => {
    handleCountryChange(country);
    setCountrySearch(country.countryName);
    setShowCountryDropdown(false);
    setCitySearch('');
    
    if (onCountryChange) {
      onCountryChange(country);
    }
  };

  const handleCitySelect = (city) => {
    handleCityChange(city);
    setCitySearch(city.name);
    setShowCityDropdown(false);
    
    if (onCityChange) {
      onCityChange(city);
    }
  };

  return (
    <div className={`geography-selector ${className}`}>
      {/* اختيار الدولة */}
      <div className="geography-field">
        <label className="geography-label">الدولة</label>
        <div className="geography-dropdown">
          <input
            type="text"
            className="geography-input"
            placeholder={placeholder.country}
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            onFocus={() => setShowCountryDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowCountryDropdown(false), 200);
            }}
          />
          
          {showCountryDropdown && (
            <div className="geography-dropdown-menu">
              {countriesLoading ? (
                <div className="geography-loading">جاري البحث...</div>
              ) : countriesError ? (
                <div className="geography-error">{countriesError}</div>
              ) : countries.length > 0 ? (
                countries.map((country) => (
                  <div
                    key={country.countryCode}
                    className="geography-dropdown-item"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <div className="country-info">
                      <span className="country-name">{country.countryName}</span>
                      <span className="country-code">({country.countryCode})</span>
                    </div>
                    <div className="country-details">
                      <span className="country-currency">{country.countryCurrency}</span>
                      <span className="country-call-code">+{country.countryCallCode}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="geography-no-results">لا توجد دول متطابقة</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* اختيار المدينة */}
      {showCities && selectedCountry && (
        <div className="geography-field">
          <label className="geography-label">المدينة</label>
          <div className="geography-dropdown">
            <input
              type="text"
              className="geography-input"
              placeholder={placeholder.city}
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowCityDropdown(false), 200);
              }}
            />
            
            {showCityDropdown && (
              <div className="geography-dropdown-menu">
                {citiesLoading ? (
                  <div className="geography-loading">جاري البحث...</div>
                ) : citiesError ? (
                  <div className="geography-error">{citiesError}</div>
                ) : cities.length > 0 ? (
                  cities.map((city) => (
                    <div
                      key={city.id}
                      className="geography-dropdown-item"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="city-info">
                        <span className="city-name">{city.name}</span>
                        {city.nameAr && city.nameAr !== city.name && (
                          <span className="city-name-ar">({city.nameAr})</span>
                        )}
                      </div>
                      {city.population && (
                        <div className="city-details">
                          <span className="city-population">
                            السكان: {parseInt(city.population).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="geography-no-results">لا توجد مدن متطابقة</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographySelector; 