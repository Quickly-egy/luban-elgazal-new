import React, { useState } from 'react';
import GeographySelector from '../components/common/GeographySelector';
import EnhancedCountrySelector from '../components/common/CountrySelector/EnhancedCountrySelector';

// مثال بسيط لاستخدام مكونات الجغرافيا
const GeographyUsageExample = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>مثال على استخدام مكونات الجغرافيا</h1>
      
      {/* مثال 1: مكون اختيار الدولة والمدينة الكامل */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>1. اختيار الدولة والمدينة</h2>
        <GeographySelector
          onCountryChange={(country) => {
            console.log('تم اختيار الدولة:', country);
            setSelectedCountry(country);
          }}
          onCityChange={(city) => {
            console.log('تم اختيار المدينة:', city);
            setSelectedCity(city);
          }}
          showCities={true}
          placeholder={{
            country: 'اختر دولتك',
            city: 'اختر مدينتك'
          }}
        />
        
        {selectedCountry && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
            <p><strong>الدولة المختارة:</strong> {selectedCountry.countryName}</p>
            <p><strong>كود الدولة:</strong> {selectedCountry.countryCode}</p>
            {selectedCity && (
              <>
                <p><strong>المدينة المختارة:</strong> {selectedCity.name}</p>
                {selectedCity.nameAr && <p><strong>المدينة بالعربية:</strong> {selectedCity.nameAr}</p>}
              </>
            )}
          </div>
        )}
      </div>

      {/* مثال 2: مكون اختيار الدولة فقط */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>2. اختيار الدولة فقط</h2>
        <GeographySelector
          onCountryChange={(country) => console.log('دولة فقط:', country)}
          showCities={false}
          placeholder={{
            country: 'اختر الدولة'
          }}
        />
      </div>

      {/* مثال 3: مكون محسن - دول الخليج فقط */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>3. اختيار من دول الخليج فقط</h2>
        <EnhancedCountrySelector
          useGCCOnly={true}
          showCities={false}
          onCountryChange={(country) => console.log('دولة خليجية:', country)}
        />
      </div>

      {/* مثال 4: مكون محسن - جميع الدول مع البحث */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>4. جميع الدول مع البحث والمدن</h2>
        <EnhancedCountrySelector
          useGCCOnly={false}
          showCities={true}
          onCountryChange={(country) => console.log('دولة عالمية:', country)}
          onCityChange={(city) => console.log('مدينة عالمية:', city)}
        />
      </div>

      {/* معلومات API */}
      <div style={{ marginTop: '3rem', padding: '1rem', background: '#e8f4f8', borderRadius: '8px' }}>
        <h3>معلومات API المستخدم:</h3>
        <ul>
          <li><strong>جلب الدول:</strong> GET https://apix.asyadexpress.com/v2/countries</li>
          <li><strong>جلب المدن:</strong> GET https://apix.asyadexpress.com/v2/countries/[COUNTRY_NAME]/cities</li>
          <li><strong>مثال:</strong> GET https://apix.asyadexpress.com/v2/countries/Kuwait/cities</li>
        </ul>
      </div>
    </div>
  );
};

export default GeographyUsageExample;

// ===== كيفية الاستخدام في المكونات الأخرى =====

// في أي مكون آخر، يمكنك استخدام المكونات كالتالي:

/*
import GeographySelector from '../components/common/GeographySelector';
import EnhancedCountrySelector from '../components/common/CountrySelector/EnhancedCountrySelector';

function MyComponent() {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);

  return (
    <div>
      {/* للاستخدام البسيط */}
      <GeographySelector
        onCountryChange={setCountry}
        onCityChange={setCity}
        showCities={true}
      />

      {/* للاستخدام المحسن */}
      <EnhancedCountrySelector
        useGCCOnly={false}
        showCities={true}
        onCountryChange={setCountry}
        onCityChange={setCity}
      />
    </div>
  );
}
*/

// ===== استخدام الـ Hook مباشرة =====

/*
import { useGeography } from '../hooks/useGeography';

function MyComponent() {
  const {
    countries,
    cities,
    selectedCountry,
    selectedCity,
    loading,
    error,
    handleCountryChange,
    handleCityChange,
    searchCountries,
    searchCities
  } = useGeography();

  return (
    <div>
      {loading && <p>جاري التحميل...</p>}
      {error && <p>خطأ: {error}</p>}
      
      <select onChange={(e) => {
        const country = countries.find(c => c.countryCode === e.target.value);
        handleCountryChange(country);
      }}>
        <option value="">اختر الدولة</option>
        {countries.map(country => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.countryName}
          </option>
        ))}
      </select>

      {cities.length > 0 && (
        <select onChange={(e) => {
          const city = cities.find(c => c.id === e.target.value);
          handleCityChange(city);
        }}>
          <option value="">اختر المدينة</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
*/ 