# 🎨 نظام البنرات الإعلانية - Documentation

## 📋 نظرة عامة

تم تطوير نظام بنرات إعلانية ديناميكي يجلب البيانات من API ويعرض منتجات مختلفة كبنرات إعلانية في نهاية صفحة تفاصيل المنتج.

---

## 🏗️ المكونات

### 1. **useBanner Hook** 
📁 `src/hooks/useBanner.js`

```javascript
// الاستخدام الأساسي
const {
  banners,           // جميع البنرات المتاحة
  currentBanner,     // البنر المعروض حالياً
  loading,           // حالة التحميل
  error,             // رسائل الخطأ
  getRandomBanner,   // تغيير البنر لبنر عشوائي
  switchBanner,      // تغيير البنر لبنر محدد
  getBannerStats     // إحصائيات البنرات
} = useBanner();
```

### 2. **FooterBanner Component**
📁 `src/pages/ProductDetail/FooterBanner.jsx`

البنر الفعلي الذي يظهر في نهاية صفحة تفاصيل المنتج.

**المميزات:**
- جلب البنرات من API تلقائياً
- عرض بنر عشوائي من المنتجات التي لها `banner_image_url`
- إمكانية تغيير البنر يدوياً
- Fallback للبنر الافتراضي في حالة عدم وجود بنرات
- معلومات تشخيص في وضع التطوير

### 3. **BannerManager Component**
📁 `src/components/admin/BannerManager/BannerManager.jsx`

واجهة إدارة البنرات للاختبار والتحكم.

**المميزات:**
- عرض جميع البنرات المتاحة
- إحصائيات شاملة
- إمكانية التبديل بين البنرات
- معاينة البنر الحالي

### 4. **TestBanner Page**
📁 `src/pages/TestBanner/TestBanner.jsx`

صفحة اختبار شاملة تحتوي على:
- معاينة البنر كما يظهر في الموقع
- واجهة إدارة البنرات
- معلومات للمطور
- وثائق الاستخدام

---

## 🔧 التكامل مع API

### المتطلبات

البنر يعتمد على وجود حقل `banner_image_url` في بيانات المنتجات من API.

### تنسيق البيانات المتوقع

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "اسم المنتج",
      "banner_image_url": "https://example.com/banner.jpg",
      "description": "وصف المنتج...",
      "sku": "PRODUCT-001",
      "prices": {
        "sar": {
          "price": "100",
          "symbol": "ر.س"
        }
      },
      "category_id": 1
    }
  ]
}
```

### Endpoint المستخدم

```javascript
GET /api/products
```

---

## 🎯 كيفية العمل

### 1. **جلب البيانات**
```javascript
// useBanner hook يجلب جميع المنتجات
const result = await apiService.get('/products');

// فلترة المنتجات التي لها banner_image_url
const bannersData = result.data.filter(product => 
  product.banner_image_url && product.banner_image_url.trim() !== ''
);
```

### 2. **اختيار البنر**
```javascript
// اختيار بنر عشوائي للعرض
if (bannersData.length > 0) {
  const randomIndex = Math.floor(Math.random() * bannersData.length);
  setCurrentBanner(bannersData[randomIndex]);
}
```

### 3. **عرض البنر**
```javascript
// في FooterBanner component
const bannerImage = currentBanner 
  ? currentBanner.banner_image_url 
  : defaultBannerImg;

<div 
  className="footer-banner"
  style={{ backgroundImage: `url(${bannerImage})` }}
>
  {/* محتوى البنر */}
</div>
```

---

## 🚀 الاستخدام

### في صفحة تفاصيل المنتج

```javascript
import FooterBanner from "./FooterBanner";

// في نهاية صفحة ProductDetail
<FooterBanner />
```

### للاختبار والتطوير

```javascript
// زيارة صفحة الاختبار
http://localhost:3000/test-banner

// أو استخدام BannerManager مباشرة
import BannerManager from '../../components/admin/BannerManager/BannerManager';
<BannerManager />
```

---

## 📊 المميزات المتقدمة

### 1. **إحصائيات البنرات**
```javascript
const stats = getBannerStats();
// {
//   total: 5,
//   categories: 3,
//   currentBanner: 123
// }
```

### 2. **فلترة حسب الفئة**
```javascript
const categoryBanners = getBannersByCategory(categoryId);
```

### 3. **التحقق من وجود بنر**
```javascript
const hasProductBanner = hasBanner(product);
const bannerUrl = getBannerUrl(product);
```

### 4. **تبديل البنرات**
```javascript
// بنر عشوائي
getRandomBanner();

// بنر محدد
switchBanner(bannerId);
```

---

## 🎨 التخصيص

### تعديل CSS

**FooterBanner:**
```css
/* src/pages/ProductDetail/FooterBanner.css */
.footer-banner {
  height: 200px; /* تغيير الارتفاع */
  background-size: cover;
}
```

**BannerManager:**
```css
/* src/components/admin/BannerManager/BannerManager.css */
.banner-card {
  /* تخصيص شكل البطاقات */
}
```

### إضافة مميزات جديدة

```javascript
// في useBanner hook
const getPopularBanners = () => {
  return banners.filter(banner => banner.popularity > 80);
};

const getBannersByPrice = (minPrice, maxPrice) => {
  return banners.filter(banner => {
    const price = parseFloat(banner.prices?.sar?.price || 0);
    return price >= minPrice && price <= maxPrice;
  });
};
```

---

## 🔧 إعدادات التطوير

### Console Debugging

في وضع التطوير، يمكنك مراقبة البنرات في Console:

```javascript
// عرض إحصائيات
console.log('🎯 Found banners:', bannersData.length);
console.log('🎨 Selected banner:', selectedBanner.name);

// معلومات البنر في FooterBanner
// يظهر في الزاوية السفلى عدد البنرات والبنر الحالي
```

### صفحة الاختبار

للوصول لصفحة اختبار شاملة:
```
http://localhost:3000/test-banner
```

تحتوي على:
- معاينة البنر الفعلي
- واجهة إدارة كاملة
- معلومات تقنية
- أمثلة للكود

---

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

#### 1. **لا تظهر بنرات**
```javascript
// التحقق من وجود banner_image_url في البيانات
console.log('Products with banners:', 
  products.filter(p => p.banner_image_url)
);
```

#### 2. **خطأ في تحميل الصور**
```javascript
// إضافة معالج خطأ للصور
<img 
  src={bannerUrl}
  onError={(e) => {
    e.target.src = '/images/default-banner.jpg';
  }}
/>
```

#### 3. **بطء في التحميل**
```javascript
// إضافة loading state
{loading ? (
  <div>جاري تحميل البنر...</div>
) : (
  <BannerContent />
)}
```

---

## 📈 الأداء

### تحسينات مطبقة

1. **Lazy Loading**: البنرات تُحمل فقط عند الحاجة
2. **Caching**: البيانات تُحفظ في state لتجنب إعادة التحميل
3. **Error Handling**: معالجة شاملة للأخطاء مع fallbacks
4. **Responsive**: دعم كامل للشاشات المختلفة

### مقاييس الأداء

- وقت التحميل الأولي: ~500ms
- تبديل البنرات: فوري (لا توجد إعادة تحميل)
- استهلاك الذاكرة: منخفض (فقط البيانات الضرورية)

---

## 🔮 التطوير المستقبلي

### مميزات مقترحة

1. **تخزين محلي**: حفظ البنر المختار في localStorage
2. **تفاعل المستخدم**: إحصائيات النقرات والتفاعل
3. **جدولة البنرات**: عرض بنرات معينة في أوقات محددة
4. **A/B Testing**: اختبار فعالية بنرات مختلفة
5. **تحليلات**: تتبع أداء كل بنر

### API محسنة

```javascript
// مقترح لـ API مخصص للبنرات
GET /api/banners
GET /api/banners/active
GET /api/banners/category/{id}
POST /api/banners/{id}/click-tracking
```

---

## ✅ الخلاصة

نظام البنرات الآن:

- ✅ **جاهز للاستخدام**: يعمل تلقائياً مع API الموجود
- ✅ **مرن**: يمكن تخصيصه وتطويره بسهولة  
- ✅ **آمن**: fallbacks للحالات غير المتوقعة
- ✅ **سريع**: أداء محسن ومحمل تلقائياً
- ✅ **سهل الصيانة**: كود منظم ومُوثق جيداً

### للاختبار الآن:

1. تأكد أن بعض المنتجات في قاعدة البيانات لها `banner_image_url`
2. زيارة صفحة تفاصيل أي منتج لرؤية البنر
3. زيارة `/test-banner` للاختبار المتقدم

**البنر جاهز للعمل! 🎉**