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
            // console.log('تم اختيار الدولة:', country);
            setSelectedCountry(country);
          }}
          onCityChange={(city) => {
            // console.log('تم اختيار المدينة:', city);
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
          // onCountryChange={(country) => console.log('دولة فقط:', country)}
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
          // onCountryChange={(country) => console.log('دولة خليجية:', country)}
        />
      </div>

      {/* مثال 4: مكون محسن - جميع الدول مع البحث */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>4. جميع الدول مع البحث والمدن</h2>
        <EnhancedCountrySelector
          useGCCOnly={false}
          showCities={true}
          // onCountryChange={(country) => console.log('دولة عالمية:', country)}
          // onCityChange={(city) => console.log('مدينة عالمية:', city)}
        />
      </div>

      {/* معلومات API */}
      <div style={{ marginTop: '3rem', padding: '1rem', background: '#e8f4f8', borderRadius: '8px' }}>
        <h3>معلومات API المستخدم:</h3>
        <ul>
                      <li><strong>جلب الدول:</strong> API للحصول على قائمة الدول</li>
            <li><strong>جلب المدن:</strong> API للحصول على مدن دولة معينة</li>
            <li><strong>مثال:</strong> جلب مدن الكويت</li>
        </ul>
      </div>
    </div>
  );
};

export default GeographyUsageExample;



