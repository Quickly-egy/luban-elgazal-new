# 🚀 دليل تحسين الأداء - لبان الغزال

## 📊 تحليل ملف stats.html

ملف `stats.html` هو **Rollup Visualizer** الذي يعرض:
- حجم كل ملف في الباندل
- المكتبات التي تأخذ أكبر مساحة
- العلاقات بين الملفات

### كيفية استخدام التحليل:

1. **تشغيل البناء مع التحليل:**
```bash
npm run build
```

2. **فتح ملف stats.html** في المتصفح لرؤية:
   - أكبر الملفات في الباندل
   - المكتبات غير المستخدمة
   - الفرص لتحسين الأداء

## 🎯 استراتيجيات التحسين

### 1. **تحسين Vite Config**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'state': ['zustand'],
          'http': ['axios'],
          'ui': ['react-icons', 'framer-motion'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'pdf': ['@react-pdf/renderer', 'jspdf', 'html2canvas'],
          'notifications': ['react-toastify'],
          'slider': ['swiper'],
          'utils': ['transliteration']
        }
      }
    },
    // إزالة الكود الميت
    esbuild: {
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.info', 'console.debug']
    }
  }
})
```

### 2. **إزالة المكتبات غير المستخدمة**

#### المكتبات المحتمل إزالتها:
- `prop-types` - إذا لم تستخدم في الإنتاج
- `react-country-flag` - إذا لم تستخدم

#### خطوات الإزالة:
```bash
# إزالة المكتبة
npm uninstall prop-types

# إزالة الاستيرادات غير المستخدمة
npm run lint -- --fix
```

### 3. **تحسين الاستيرادات**

#### استخدام Dynamic Imports:
```javascript
// بدلاً من
import { motion } from 'framer-motion';

// استخدم
const MotionComponent = React.lazy(() => import('framer-motion').then(m => ({ default: m.motion })));
```

#### Lazy Loading للمكونات:
```javascript
// في RoutesComponent.jsx
const Home = React.lazy(() => import("../pages/Home/Home"));
const Products = React.lazy(() => import("../pages/Products/Products"));
```

### 4. **تحسين React Query**

```javascript
// في main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000, // 10 دقائق
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### 5. **تحسين الصور**

```javascript
// استخدام WebP format
// تحسين أحجام الصور
// استخدام lazy loading للصور
```

## 🔧 أدوات التحليل

### 1. **سكريبت تحليل الكود غير المستخدم**

```bash
node analyze-unused.js
```

### 2. **تحليل حجم الباندل**

```bash
npm run build:analyze
```

### 3. **تنظيف الكاش**

```bash
npm run clean
```

## 📈 قياس التحسينات

### قبل التحسين:
- حجم الباندل الرئيسي: ~2MB
- وقت التحميل الأولي: ~3-5 ثواني

### بعد التحسين:
- حجم الباندل الرئيسي: ~800KB
- وقت التحميل الأولي: ~1-2 ثانية

## 🎯 خطوات التطبيق

### المرحلة 1: التحليل
1. تشغيل `npm run build:analyze`
2. فتح `stats.html` لتحليل الباندل
3. تشغيل `node analyze-unused.js`

### المرحلة 2: التنظيف
1. إزالة المكتبات غير المستخدمة
2. تنظيف الاستيرادات
3. تحسين Vite config

### المرحلة 3: التحسين
1. تفعيل Lazy Loading
2. تحسين React Query
3. تحسين الصور

### المرحلة 4: الاختبار
1. اختبار الأداء
2. قياس التحسينات
3. التأكد من عدم كسر الوظائف

## 🚨 ملاحظات مهمة

1. **اختبار شامل** بعد كل تغيير
2. **النسخ الاحتياطية** قبل التغييرات الكبيرة
3. **قياس الأداء** في بيئة الإنتاج
4. **مراقبة الأخطاء** بعد النشر

## 📚 موارد إضافية

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 