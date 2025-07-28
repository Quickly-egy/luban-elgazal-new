# 🌍 وثيقة APIs الجغرافيا - الدول والمناطق

## 🎯 مقدمة
هذه وثيقة مخصصة لـ APIs جلب الدول والمناطق/المحافظات المطلوبة للتطبيق.

---

## 📍 Base URL
```
https://apix.asyadexpress.com/v2
```

## 🔐 Authentication
```
Authorization: Bearer {API_TOKEN}
Content-Type: application/json
```

---

## 🌍 Geography APIs

### 1. جلب جميع الدول المدعومة
```http
GET /countries
```

**Headers:**
```
Authorization: Bearer {API_TOKEN}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "تم جلب الدول بنجاح",
  "data": {
    "countryList": [
      {
        "countryName": "Saudi Arabia",
        "countryCode": "SA",
        "countryCallCode": "966",
        "countryCurrency": "SAR"
      },
      {
        "countryName": "United Arab Emirates",
        "countryCode": "AE",
        "countryCallCode": "971",
        "countryCurrency": "AED"
      },
      {
        "countryName": "Qatar",
        "countryCode": "QA",
        "countryCallCode": "974",
        "countryCurrency": "QAR"
      },
      {
        "countryName": "Bahrain",
        "countryCode": "BH",
        "countryCallCode": "973",
        "countryCurrency": "BHD"
      },
      {
        "countryName": "Oman",
        "countryCode": "OM",
        "countryCallCode": "968",
        "countryCurrency": "OMR"
      }
    ]
  }
}
```

**ملاحظات:**
- يجب فلترة النتائج لإرجاع الدول المطلوبة فقط (دول الخليج)
- في حالة فشل الـ API، يجب إرجاع fallback data

---

### 2. جلب مدن/مناطق دولة معينة
```http
GET /countries/{countryName}/cities
```

**Parameters:**
- `countryName`: اسم الدولة (مثل: "Saudi Arabia")

**Examples:**
```
GET /countries/Saudi%20Arabia/cities
GET /countries/United%20Arab%20Emirates/cities
GET /countries/Qatar/cities
```

**Response:**
```json
{
  "success": true,
  "message": "تم جلب المدن بنجاح",
  "data": {
    "city_001": {
      "name": "Riyadh",
      "name_ar": "الرياض",
      "name_en": "Riyadh",
      "latitude": "24.7136",
      "longitude": "46.6753",
      "cca2": "SA",
      "adm0name": "Saudi Arabia",
      "pop_max": 6506700
    },
    "city_002": {
      "name": "Jeddah", 
      "name_ar": "جدة",
      "name_en": "Jeddah",
      "latitude": "21.4858",
      "longitude": "39.1925",
      "cca2": "SA",
      "adm0name": "Saudi Arabia",
      "pop_max": 3430697
    },
    "city_003": {
      "name": "Mecca",
      "name_ar": "مكة المكرمة", 
      "name_en": "Mecca",
      "latitude": "21.3891",
      "longitude": "39.8579",
      "cca2": "SA",
      "adm0name": "Saudi Arabia",
      "pop_max": 1675368
    },
    "city_004": {
      "name": "Medina",
      "name_ar": "المدينة المنورة",
      "name_en": "Medina", 
      "latitude": "24.5247",
      "longitude": "39.5692",
      "cca2": "SA",
      "adm0name": "Saudi Arabia",
      "pop_max": 1180770
    },
    "city_005": {
      "name": "Dammam",
      "name_ar": "الدمام",
      "name_en": "Dammam",
      "latitude": "26.4207",
      "longitude": "50.0888",
      "cca2": "SA", 
      "adm0name": "Saudi Arabia",
      "pop_max": 903312
    }
  }
}
```

**للإمارات العربية المتحدة:**
```json
{
  "success": true,
  "message": "تم جلب المدن بنجاح",
  "data": {
    "city_001": {
      "name": "Dubai",
      "name_ar": "دبي",
      "name_en": "Dubai",
      "latitude": "25.2048",
      "longitude": "55.2708",
      "cca2": "AE",
      "adm0name": "United Arab Emirates",
      "pop_max": 2833000
    },
    "city_002": {
      "name": "Abu Dhabi",
      "name_ar": "أبوظبي", 
      "name_en": "Abu Dhabi",
      "latitude": "24.4539",
      "longitude": "54.3773",
      "cca2": "AE",
      "adm0name": "United Arab Emirates",
      "pop_max": 1420000
    },
    "city_003": {
      "name": "Sharjah",
      "name_ar": "الشارقة",
      "name_en": "Sharjah",
      "latitude": "25.3463",
      "longitude": "55.4209", 
      "cca2": "AE",
      "adm0name": "United Arab Emirates",
      "pop_max": 1274749
    },
    "city_004": {
      "name": "Ajman",
      "name_ar": "عجمان",
      "name_en": "Ajman",
      "latitude": "25.4052",
      "longitude": "55.4815",
      "cca2": "AE",
      "adm0name": "United Arab Emirates", 
      "pop_max": 490035
    }
  }
}
```

---

## 🔧 Frontend Integration

### كيفية معالجة البيانات:

```javascript
// معالجة استجابة الدول
const processCountriesResponse = (response) => {
  if (response.success && response.data?.countryList) {
    // فلترة الدول المطلوبة فقط
    const allowedCountries = [
      "Bahrain", "Saudi Arabia", "Qatar", 
      "United Arab Emirates", "Oman"
    ];
    
    return response.data.countryList.filter(country =>
      allowedCountries.includes(country.countryName)
    );
  }
  
  // Fallback data في حالة الفشل
  return [
    { countryName: "Saudi Arabia", countryCode: "SA", countryCallCode: "966", countryCurrency: "SAR" },
    { countryName: "United Arab Emirates", countryCode: "AE", countryCallCode: "971", countryCurrency: "AED" },
    { countryName: "Qatar", countryCode: "QA", countryCallCode: "974", countryCurrency: "QAR" },
    { countryName: "Bahrain", countryCode: "BH", countryCallCode: "973", countryCurrency: "BHD" },
    { countryName: "Oman", countryCode: "OM", countryCallCode: "968", countryCurrency: "OMR" }
  ];
};

// معالجة استجابة المدن/المناطق
const processCitiesResponse = (response) => {
  if (response.success && response.data) {
    // تحويل البيانات من Object إلى Array
    return Object.keys(response.data).map(key => ({
      id: key,
      name: response.data[key].name,
      nameAr: response.data[key].name_ar,
      nameEn: response.data[key].name_en,
      latitude: response.data[key].latitude,
      longitude: response.data[key].longitude,
      countryCode: response.data[key].cca2,
      countryName: response.data[key].adm0name,
      population: response.data[key].pop_max,
      ...response.data[key]
    }));
  }
  
  return [];
};
```

---

## 📋 متطلبات Implementation

### Backend Requirements:

#### 1. **Environment Variables:**
```env
VITE_API_BASE=https://apix.asyadexpress.com
VITE_API_TOKEN=your_api_token_here
```

#### 2. **Headers Configuration:**
```javascript
const createHeaders = () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${API_TOKEN}`);
  return headers;
};
```

#### 3. **Error Handling:**
```javascript
const handleAPIError = (error) => {
  console.error('Geography API Error:', error);
  
  // إرجاع البيانات الاحتياطية
  return {
    success: true,
    data: FALLBACK_DATA,
    message: 'تم جلب البيانات من المصدر الاحتياطي',
    fallback: true
  };
};
```

#### 4. **Caching Strategy:**
- Cache البيانات محلياً لمدة 24 ساعة
- تحديث البيانات في الخلفية
- استخدام localStorage للتخزين المؤقت

---

## 🚨 Error Responses

### فشل في الاتصال:
```json
{
  "success": false,
  "message": "فشل في الاتصال بخدمة الجغرافيا",
  "error": "Network Error"
}
```

### دولة غير موجودة:
```json
{
  "success": false,
  "message": "الدولة المطلوبة غير موجودة",
  "error": "Country not found"
}
```

### خطأ في المصادقة:
```json
{
  "success": false,
  "message": "خطأ في المصادقة",
  "error": "Unauthorized"
}
```

---

## 🎯 Use Cases

### 1. **اختيار الدولة:**
```
User -> يختار دولة من القائمة
Frontend -> يرسل طلب جلب المناطق
Backend -> يجلب مناطق الدولة المختارة
Frontend -> يعرض المناطق للمستخدم
```

### 2. **البحث في المناطق:**
```
User -> يكتب في صندوق البحث  
Frontend -> يفلتر المناطق محلياً
Frontend -> يعرض النتائج المطابقة
```

### 3. **Fallback Handling:**
```
Frontend -> يرسل طلب للـ API
API -> يفشل في الاستجابة  
Frontend -> يستخدم البيانات الاحتياطية
Frontend -> يعرض رسالة للمستخدم
```

---

## 📞 للدعم والاستفسارات

إذا كنت بحاجة لتوضيحات إضافية حول APIs الجغرافيا، يرجى التواصل مع فريق التطوير.

**تاريخ آخر تحديث:** يناير 2025  
**إصدار الوثيقة:** 1.0 