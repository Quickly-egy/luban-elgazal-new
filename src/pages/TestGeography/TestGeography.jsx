import React, { useState } from 'react';
import GeographySelector from '../../components/common/GeographySelector';
import EnhancedCountrySelector from '../../components/common/CountrySelector/EnhancedCountrySelector';
import './TestGeography.module.css';

const TestGeography = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [enhancedCountry, setEnhancedCountry] = useState(null);
  const [enhancedCity, setEnhancedCity] = useState(null);

  const handleCountryChange = (country) => {
    console.log('Selected country:', country);
    setSelectedCountry(country);
    setSelectedCity(null); // Reset city when country changes
  };

  const handleCityChange = (city) => {
    console.log('Selected city:', city);
    setSelectedCity(city);
  };

  const handleEnhancedCountryChange = (country) => {
    console.log('Enhanced country:', country);
    setEnhancedCountry(country);
  };

  const handleEnhancedCityChange = (city) => {
    console.log('Enhanced city:', city);
    setEnhancedCity(city);
  };

  return (
    <div className="test-geography">
      <div className="container">
        <h1>اختبار مكونات الجغرافيا</h1>
        
        <div className="section">
          <h2>1. مكون GeographySelector الأساسي</h2>
          <p>يستخدم API خارجي لجلب جميع الدول والمدن</p>
          
          <GeographySelector
            onCountryChange={handleCountryChange}
            onCityChange={handleCityChange}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            showCities={true}
            placeholder={{
              country: 'اختر الدولة...',
              city: 'اختر المدينة...'
            }}
          />
          
          <div className="selection-info">
            <h3>الاختيار الحالي:</h3>
            <p><strong>الدولة:</strong> {selectedCountry ? selectedCountry.countryName : 'لم يتم الاختيار'}</p>
            <p><strong>كود الدولة:</strong> {selectedCountry ? selectedCountry.countryCode : 'لم يتم الاختيار'}</p>
            <p><strong>المدينة:</strong> {selectedCity ? selectedCity.name : 'لم يتم الاختيار'}</p>
            {selectedCity && selectedCity.nameAr && (
              <p><strong>المدينة بالعربية:</strong> {selectedCity.nameAr}</p>
            )}
          </div>
        </div>

        <div className="section">
          <h2>2. EnhancedCountrySelector - وضع دول الخليج فقط</h2>
          <p>يعرض دول الخليج فقط مع إمكانية اختيار المدن</p>
          
          <EnhancedCountrySelector
            showCities={false}
            useGCCOnly={true}
            onCountryChange={handleEnhancedCountryChange}
            onCityChange={handleEnhancedCityChange}
          />
          
          <div className="selection-info">
            <h3>الاختيار الحالي:</h3>
            <p><strong>الدولة:</strong> {enhancedCountry ? enhancedCountry.name : 'لم يتم الاختيار'}</p>
            <p><strong>كود الدولة:</strong> {enhancedCountry ? enhancedCountry.code : 'لم يتم الاختيار'}</p>
          </div>
        </div>

        <div className="section">
          <h2>3. EnhancedCountrySelector - وضع جميع الدول مع المدن</h2>
          <p>يعرض جميع الدول مع البحث والمدن</p>
          
          <EnhancedCountrySelector
            showCities={true}
            useGCCOnly={false}
            onCountryChange={handleEnhancedCountryChange}
            onCityChange={handleEnhancedCityChange}
          />
          
          <div className="selection-info">
            <h3>الاختيار الحالي:</h3>
            <p><strong>الدولة:</strong> {enhancedCountry ? enhancedCountry.name || enhancedCountry.countryName : 'لم يتم الاختيار'}</p>
            <p><strong>كود الدولة:</strong> {enhancedCountry ? enhancedCountry.code || enhancedCountry.countryCode : 'لم يتم الاختيار'}</p>
            <p><strong>المدينة:</strong> {enhancedCity ? enhancedCity.name : 'لم يتم الاختيار'}</p>
          </div>
        </div>

        <div className="section">
          <h2>4. مكون الدولة فقط</h2>
          <p>لاختيار الدولة فقط بدون المدن</p>
          
          <GeographySelector
            onCountryChange={handleCountryChange}
            selectedCountry={selectedCountry}
            showCities={false}
            placeholder={{
              country: 'اختر الدولة فقط...'
            }}
          />
        </div>

        <div className="api-info">
          <h2>معلومات API</h2>
          <div className="api-details">
            <h3>جلب الدول:</h3>
            <code>GET https://apix.asyadexpress.com/v2/countries</code>
            
            <h3>جلب مدن دولة معينة:</h3>
            <code>GET https://apix.asyadexpress.com/v2/countries/[COUNTRY_NAME]/cities</code>
            
            <h3>مثال:</h3>
            <code>GET https://apix.asyadexpress.com/v2/countries/Kuwait/cities</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestGeography; 