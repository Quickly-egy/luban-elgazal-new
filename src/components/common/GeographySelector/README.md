# مكونات الجغرافيا (Geography Components)

هذه المكونات تتيح لك اختيار الدول والمدن من خلال API خارجي يحتوي على جميع دول العالم ومدنها.

## المكونات المتاحة

### 1. GeographySelector
مكون أساسي لاختيار الدولة والمدينة مع البحث.

### 2. EnhancedCountrySelector
مكون محسن يدمج مع نظام الموقع الحالي ويدعم وضعين:
- دول الخليج فقط (افتراضي)
- جميع الدول مع البحث

## API المستخدم

```
Base URL: [تم إزالة الدومين]
Authorization: Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1
```

### Endpoints:
- `GET /countries` - جلب جميع الدول
- `GET /countries/{countryName}/cities` - جلب مدن دولة معينة

## الاستخدام

### GeographySelector

```jsx
import GeographySelector from './components/common/GeographySelector';

function MyComponent() {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);

  return (
    <GeographySelector
      onCountryChange={setCountry}
      onCityChange={setCity}
      showCities={true}
      placeholder={{
        country: 'اختر الدولة',
        city: 'اختر المدينة'
      }}
    />
  );
}
```

### EnhancedCountrySelector

```jsx
import EnhancedCountrySelector from './components/common/CountrySelector/EnhancedCountrySelector';

function MyComponent() {
  return (
    <EnhancedCountrySelector
      useGCCOnly={false}
      showCities={true}
    />
  );
}
```

## الخصائص (Props)

### GeographySelector
- `onCountryChange`: دالة تستدعى عند تغيير الدولة
- `onCityChange`: دالة تستدعى عند تغيير المدينة
- `selectedCountry`: الدولة المختارة حالياً
- `selectedCity`: المدينة المختارة حالياً
- `showCities`: إظهار اختيار المدن (افتراضي: true)
- `placeholder`: نصوص placeholder للحقول
- `className`: CSS class إضافية

### EnhancedCountrySelector
- `showCities`: إظهار اختيار المدن (افتراضي: false)
- `onCountryChange`: دالة تستدعى عند تغيير الدولة
- `onCityChange`: دالة تستدعى عند تغيير المدينة
- `useGCCOnly`: استخدام دول الخليج فقط (افتراضي: true)

## استخدام الـ Hook مباشرة

```jsx
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

  // استخدام البيانات والوظائف
}
```

## الوظائف المتاحة في الـ Hook

- `countries`: قائمة الدول
- `cities`: قائمة المدن للدولة المختارة
- `selectedCountry`: الدولة المختارة
- `selectedCity`: المدينة المختارة
- `loading`: حالة التحميل
- `error`: رسالة الخطأ
- `handleCountryChange`: تغيير الدولة
- `handleCityChange`: تغيير المدينة
- `searchCountries`: البحث في الدول
- `searchCities`: البحث في المدن

## مثال متقدم

```jsx
import React, { useState } from 'react';
import GeographySelector from './components/common/GeographySelector';

function ShippingForm() {
  const [shippingCountry, setShippingCountry] = useState(null);
  const [shippingCity, setShippingCity] = useState(null);

  const handleSubmit = () => {
    const shippingData = {
      country: shippingCountry?.countryName,
      countryCode: shippingCountry?.countryCode,
      city: shippingCity?.name,
      cityAr: shippingCity?.nameAr
    };
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>عنوان الشحن</h3>
      <GeographySelector
        onCountryChange={setShippingCountry}
        onCityChange={setShippingCity}
        showCities={true}
        placeholder={{
          country: 'اختر دولة الشحن',
          city: 'اختر مدينة الشحن'
        }}
      />
      <button type="submit">إرسال</button>
    </form>
  );
}
```

## اختبار المكونات

يمكنك اختبار المكونات عبر الرابط: `/test-geography`

## الميزات

- ✅ دعم جميع دول العالم
- ✅ البحث في الدول والمدن
- ✅ دعم اللغة العربية والإنجليزية
- ✅ تصميم متجاوب
- ✅ إدارة حالة التحميل والأخطاء
- ✅ تكامل مع نظام الموقع الحالي
- ✅ دعم دول الخليج فقط كخيار
- ✅ واجهة سهلة الاستخدام 