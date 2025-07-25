# شريط التنقل السفلي - Bottom Navigation

## 📋 الوصف
مكون شريط التنقل السفلي للموبايل يوفر تنقل سريع وسهل للمستخدمين على الهواتف المحمولة.

## 🎯 الميزات
- **تصميم متجاوب**: يظهر فقط على الشاشات أقل من 1000px
- **تنقل ذكي**: يربط بين الصفحات الرئيسية والـ modals
- **تفاعل بصري**: تأثيرات حركية وألوان تفاعلية  
- **إشعارات**: رقم في السلة وحالة تسجيل الدخول
- **Haptic Feedback**: اهتزاز خفيف عند الضغط على الأزرار
- **Safe Area Support**: دعم iPhone X وأحدث

## 🔧 المكونات المضمنة

### الأقسام الخمسة:
1. **الرئيسية** (`/`) - رابط مباشر للصفحة الرئيسية
2. **جميع الأقسام** (`/products`) - رابط لصفحة المنتجات
3. **المفضلة** - فتح modal المفضلة مع عرض عدد المنتجات المفضلة
4. **السلة** - فتح modal السلة مع عرض عدد المنتجات
5. **حسابي** - فتح profile modal أو تسجيل دخول

### الـ Modals المدمجة:
- `CartModal` - عرض محتويات السلة
- `Profile` - إدارة الحساب الشخصي
- `LoginModal` - تسجيل دخول
- `RegisterModal` - إنشاء حساب جديد
- `OTPModal` - تأكيد رمز OTP
- `ForgotPasswordModal` - استرداد كلمة المرور
- `WishlistModal` - قائمة المفضلة
- `SuccessNotification` - إشعارات النجاح

## 🎨 التصميم

### الألوان:
- **اللون الأساسي**: `#64748b` (رمادي)
- **اللون النشط**: `#667eea` (أزرق)
- **لون السلة مع محتويات**: `#667eea` (أزرق)
- **لون الخلفية**: تدرج أبيض إلى رمادي فاتح

### التأثيرات:
- `slideUp` animation عند التحميل
- `hover` effects مع تكبير الأيقونات
- `active` state مع خط علوي ملون
- Badge animation للسلة
- Drop shadow للأيقونات النشطة

## 📱 Responsive Design

### نقاط الكسر:
- **`> 1000px`**: مخفي (يظهر header عادي)
- **`≤ 1000px`**: يظهر الشريط السفلي
- **`≤ 480px`**: تصغير الأيقونات والنصوص
- **`≤ 360px`**: تحسينات إضافية للشاشات الصغيرة

## 🚫 الصفحات المستبعدة
الشريط لا يظهر في:
- `/checkout` - صفحة الدفع
- `/payment-failed` - صفحة فشل الدفع

## 🔧 التقنيات المستخدمة
- **React Hooks**: `useState` للـ state management
- **React Router**: `useLocation` و `Link` للتنقل
- **Zustand Stores**: `useCartStore` و `useAuthStore`
- **React Icons**: `FaHome`, `FaThLarge`, `FaShoppingCart`, `FaUser`
- **CSS Modules**: تصميم معزول ومتجاوب

## 📦 الاستخدام
المكون يتم تضمينه تلقائياً في `RoutesComponent.jsx` ولا يحتاج إعداد إضافي.

```jsx
// تلقائي في RoutesComponent.jsx
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

// يظهر في نهاية كل صفحة
<BottomNavigation />
```

## 🎯 UX Features
- **Visual Feedback**: تغيير اللون عند التفاعل
- **Badge System**: عرض عدد منتجات السلة
- **Smart Authentication**: عرض تسجيل دخول أو الملف حسب الحالة
- **Smooth Animations**: انتقالات سلسة بين الحالات
- **Touch Optimized**: مُحسن للمس في الهواتف

## 🔄 State Management
- **Cart Count**: متصل مع `cartStore` لعرض عدد المنتجات
- **Authentication**: متصل مع `authStore` لحالة تسجيل الدخول
- **Modals**: إدارة محلية لحالة فتح/إغلاق الـ modals

## 🚀 المزايا
- **أداء محسن**: تحميل lazy للـ modals
- **ذاكرة محفوظة**: استخدام localStorage للسلة والمصادقة
- **تجربة مستخدم متميزة**: تنقل سريع وسهل
- **متوافق مع PWA**: دعم Safe Area للهواتف الحديثة 