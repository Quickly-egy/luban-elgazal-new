# 🚚 نظام الشحن - ASYAD Express API

## نظرة عامة

نظام الشحن المتكامل مع ASYAD Express API يوفر إمكانيات شاملة لإدارة الشحن في موقع لبان الغزال، بما في ذلك:

- إنشاء طلبات الشحن تلقائياً بعد تأكيد الطلب
- تتبع حالة الشحن في الوقت الفعلي
- دعم أنواع الدفع المختلفة (COD/PREPAID)
- واجهة مستخدم جميلة لتتبع الشحن
- معالجة الأخطاء والتعامل مع الحالات الاستثنائية

## 📁 هيكل الملفات

```
src/services/
├── shipping.js              # الوظائف الأساسية لـ API الشحن
├── testShipping.js          # اختبارات شاملة للنظام
└── shipping/
    └── README.md           # هذا الملف

src/components/common/
└── ShippingTracker/        # مكون تتبع الشحن
    ├── ShippingTracker.jsx
    ├── ShippingTracker.module.css
    └── index.js
```

## 🔧 الإعداد

### 1. إعداد Proxy في Vite

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/shipping-api': {
        target: 'https://api.asyad.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shipping-api/, '')
      }
    }
  }
})
```

### 2. متغيرات البيئة

```javascript
// في shipping.js
const SHIPPING_API_TOKEN = 'FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1';
const SHIPPING_API_BASE = '/shipping-api';
```

## 🚀 الاستخدام

### إنشاء طلب شحن

```javascript
import { processShippingOrder } from '../services/shipping';

const orderData = {
  id: 123,
  order_number: 'ORD-2024-001',
  customer_name: 'أحمد محمد',
  customer_email: 'ahmed@example.com',
  customer_phone: '0501234567', // رقم الهاتف كما هو مخزن في قاعدة البيانات
  payment_method: 'cash', // أو 'card'
  final_amount: 150.00,
  shipping_cost: 15.00,
  shipping_address: {
    address_line1: 'شارع الملك فهد',
    city: 'الرياض',
    state: 'الرياض',
    country: 'Saudi Arabia',
    postal_code: '12345'
  },
  items: [
    {
      id: 1,
      name: 'منتج تجريبي',
      sku: 'PROD-001',
      quantity: 2
    }
  ],
  notes: 'يرجى التعامل بحذر'
};

const result = await processShippingOrder(orderData, authToken);

if (result.success) {
  console.log('تم إنشاء الشحن:', result.trackingNumber);
} else {
  console.error('خطأ في الشحن:', result.error);
}
```

### تتبع الشحن

```javascript
import { trackShippingOrder } from '../services/shipping';

const trackingResult = await trackShippingOrder('TRACK123456');

if (trackingResult.success) {
  console.log('حالة الشحن:', trackingResult.status);
  console.log('الموقع الحالي:', trackingResult.location);
  console.log('تاريخ التتبع:', trackingResult.history);
}
```

### استخدام مكون تتبع الشحن

```jsx
import ShippingTracker from '../components/common/ShippingTracker';

function OrderDetail() {
  const [showTracker, setShowTracker] = useState(false);
  const trackingNumber = 'TRACK123456';

  return (
    <div>
      <button onClick={() => setShowTracker(true)}>
        تتبع الشحن
      </button>
      
      {showTracker && (
        <div className="modal-overlay">
          <ShippingTracker
            trackingNumber={trackingNumber}
            onClose={() => setShowTracker(false)}
          />
        </div>
      )}
    </div>
  );
}
```

## 🧪 الاختبارات

### تشغيل الاختبارات في المتصفح

```javascript
// افتح Developer Console وشغل:

// اختبار أساسي
await window.testShippingAPI();

// اختبار أنواع الدفع المختلفة
await window.testDifferentPaymentTypes();

// اختبار التحقق من البيانات
await window.testDataValidation();

// تشغيل جميع الاختبارات
await window.runAllTests();

// اختبار تتبع الشحن
await window.testTrackingAPI('TRACK123456');
```

## 📊 أنواع الدفع

### الدفع عند الاستلام (COD)

```javascript
{
  PaymentType: "COD",
  CODAmount: 150.00,    // المبلغ المطلوب تحصيله
  ShippingCost: 15.00
}
```

### الدفع المسبق (PREPAID)

```javascript
{
  PaymentType: "PREPAID",
  CODAmount: 0,         // لا يوجد مبلغ للتحصيل
  ShippingCost: 15.00
}
```

## 🔍 حالات الشحن

| الحالة | الوصف | الأيقونة |
|--------|-------|---------|
| `created` | تم إنشاء الطلب | 📦 |
| `picked_up` | تم الاستلام | 🚚 |
| `in_transit` | في الطريق | 🚛 |
| `out_for_delivery` | خارج للتوصيل | 🚚 |
| `delivered` | تم التوصيل | ✅ |
| `failed` | فشل التوصيل | ❌ |

## 🛠️ الوظائف المتاحة

### في `shipping.js`

| الوظيفة | الوصف |
|---------|-------|
| `createShippingOrder(orderData)` | إنشاء طلب شحن جديد |
| `trackShippingOrder(trackingNumber)` | تتبع حالة الشحن |
| `updateOrderWithShippingInfo(orderId, shippingData, token)` | تحديث الطلب بمعلومات الشحن |
| `processShippingOrder(orderData, token)` | معالجة شاملة للشحن |
| `getOrderShippingInfo(orderId, token)` | الحصول على معلومات الشحن |
| `validateShippingData(orderData)` | التحقق من صحة البيانات |

### في `testShipping.js`

| الوظيفة | الوصف |
|---------|-------|
| `testShippingAPI()` | اختبار أساسي |
| `testDifferentPaymentTypes()` | اختبار أنواع الدفع |
| `testDataValidation()` | اختبار التحقق من البيانات |
| `runAllTests()` | تشغيل جميع الاختبارات |
| `testTrackingAPI(trackingNumber)` | اختبار تتبع الشحن |

## 🎨 تخصيص مكون التتبع

### الخصائص المتاحة

```jsx
<ShippingTracker
  trackingNumber="TRACK123456"    // رقم التتبع (مطلوب)
  onClose={() => {}}              // دالة الإغلاق (مطلوب)
  autoRefresh={true}              // تحديث تلقائي (اختياري)
  refreshInterval={30000}         // فترة التحديث بالميلي ثانية (اختياري)
/>
```

### تخصيص الأنماط

```css
/* تخصيص الألوان */
.shippingTracker {
  --primary-color: #007bff;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
}

/* تخصيص الخطوط */
.trackingNumber {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}
```

## 📋 معالجة البيانات

### رقم الهاتف
- يتم إرسال رقم الهاتف **كما هو مخزن** في قاعدة البيانات دون تغيير
- لا يتم إضافة أو حذف أي أرقام أو رموز
- مثال: إذا كان مخزن `0501234567` سيتم إرساله كما هو

### رقم الطلب المرجعي
- يتم استخدام `id` الطلب بدلاً من `order_number`
- التنسيق: `LUBAN_{ORDER_ID}_{TIMESTAMP}`
- مثال: `LUBAN_123_1703123456789`

## 🏙️ City Validation

The shipping service now includes comprehensive city validation to prevent errors before sending requests to ASYAD Express.

### Supported Cities

The service supports the following major Saudi cities:
- RIYADH (الرياض)
- JEDDAH (جدة)
- DAMMAM (الدمام)
- MECCA (مكة)
- MEDINA (المدينة)
- TAIF (الطائف)
- KHOBAR (الخبر)
- JUBAIL (الجبيل)
- YANBU (ينبع)
- ABHA (أبها)
- TABUK (تبوك)
- BURAIDAH (بريدة)
- KHAMIS MUSHAIT (خميس مشيط)
- HAIL (حائل)
- HAFR AL BATIN (حفر الباطن)
- NAJRAN (نجران)
- AL QATIF (القطيف)
- AL HAWIYAH (الحوية)
- UNAIZAH (عنيزة)
- SAKAKA (سكاكا)

### Validation Functions

```javascript
import { validateCity, getSupportedCities } from './services/shipping';

// Check if a city is supported
const isSupported = validateCity('RIYADH'); // true
const isUnsupported = validateCity('بثبثب'); // false

// Get all supported cities
const supportedCities = getSupportedCities();
```

### City Validation Component

Use the `CityValidator` component to provide real-time validation feedback:

```jsx
import CityValidator from './components/common/CityValidator';

function ShippingForm() {
  const [city, setCity] = useState('');
  const [isCityValid, setIsCityValid] = useState(true);

  const handleCityValidation = (isValid, errorMessage) => {
    setIsCityValid(isValid);
    if (!isValid) {
      // console.log('City validation error:', errorMessage);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <CityValidator
        city={city}
        onValidationChange={handleCityValidation}
        showSuggestions={true}
      />
      {!isCityValid && (
        <p style={{ color: 'red' }}>Please select a supported city</p>
      )}
    </div>
  );
}
```

### Error Handling

The service now provides detailed error messages for unsupported cities:

```javascript
try {
  const result = await createShippingOrder(orderData);
} catch (error) {
  if (error.message.includes('غير مدعومة')) {
    // Handle unsupported city error
    // console.log('Unsupported city:', error.message);
    // Show user-friendly message or city selector
  } else {
    // Handle other errors
    // console.error('Shipping error:', error.message);
  }
}
```

### Testing City Validation

```javascript
// Test in browser console
import('./services/testShipping.js').then(({ testCityValidation }) => {
  testCityValidation();
});

// Or run specific tests
window.testCityValidation(); // After loading the test script
window.testUnsupportedCity(); // Test unsupported city handling
```

## 🔧 Error Handling Improvements

### City Validation Errors

The service now catches and handles the specific error:
```
{
    "Consignee": {
        "City": [
            "This City [ بثبثب ] IS Not Supported For Integration"
        ]
    }
}
```

And converts it to a user-friendly message in Arabic:
```
المدينة "بثبثب" غير مدعومة من خدمة الشحن ASYAD Express. يرجى التواصل مع الدعم للحصول على قائمة المدن المتاحة.
```

### Validation Before API Call

The service validates cities before making API requests to prevent unnecessary calls:

```javascript
// This will throw an error before making the API call
const orderData = {
  shipping_address: {
    city: 'UNSUPPORTED_CITY'
  }
};

try {
  await createShippingOrder(orderData);
} catch (error) {
  // Error caught before API call
  console.log(error.message); // City validation error
}
```

## 📱 التجاوب مع الأجهزة

النظام متجاوب بالكامل مع جميع أحجام الشاشات:

- **Desktop**: عرض كامل مع جميع التفاصيل
- **Tablet**: تخطيط متكيف
- **Mobile**: واجهة محسنة للهواتف الذكية

## 🔐 الأمان

- جميع الطلبات محمية بـ TOKEN
- التحقق من صحة البيانات قبل الإرسال
- معالجة آمنة للأخطاء دون كشف معلومات حساسة
- تشفير البيانات في النقل

## 📈 الأداء

- إعادة المحاولة التلقائية عند الفشل
- تخزين مؤقت للبيانات
- تحديث تلقائي لحالة التتبع
- تحميل غير متزامن للبيانات

## 🎯 الميزات المستقبلية

- [ ] إشعارات الدفع عند تغيير حالة الشحن
- [ ] تتبع GPS في الوقت الفعلي
- [ ] دعم شركات شحن متعددة
- [ ] تقارير تفصيلية عن الشحن
- [ ] API للتكامل مع أنظمة خارجية

## 📞 الدعم

للمساعدة أو الاستفسارات:
- فحص الكونسول للأخطاء التفصيلية
- تشغيل الاختبارات للتحقق من النظام
- مراجعة هذا الدليل للاستخدام الصحيح

---

**تم إنشاء هذا النظام بواسطة فريق لبان الغزال** 🌟 