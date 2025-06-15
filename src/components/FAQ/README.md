# مكونات صفحة الأسئلة الشائعة (FAQ Components)

## نظرة عامة
مجموعة من المكونات المتخصصة لعرض الأسئلة الشائعة بطريقة تفاعلية ومنظمة.

## المكونات المتاحة

### 1. FAQ (الصفحة الرئيسية)
**المسار:** `src/pages/FAQ/FAQ.jsx`
- الصفحة الرئيسية للأسئلة الشائعة
- تتضمن جميع المكونات الفرعية
- دعم البحث والتصفية

### 2. FAQSection (القسم)
**المسار:** `src/components/FAQ/FAQSection.jsx`
- عرض مجموعة من الأسئلة تحت عنوان واحد
- رسوم متحركة للعرض
- أيقونة مخصصة لكل قسم

### 3. FAQItem (العنصر)
**المسار:** `src/components/FAQ/FAQItem.jsx`
- عرض سؤال وجواب واحد
- إمكانية الطي والفتح
- تقييم الإجابة
- روابط إضافية

### 4. FAQSearch (البحث)
**المسار:** `src/components/FAQ/FAQSearch.jsx`
- بحث في الأسئلة والأجوبة
- علامات سريعة للتصفية
- عداد النتائج

### 5. FAQStats (الإحصائيات)
**المسار:** `src/components/FAQ/FAQStats.jsx`
- عرض إحصائيات مفيدة
- أرقام ديناميكية
- رسوم متحركة

## هيكل البيانات

### faqData Structure
```javascript
{
  id: 'unique-id',
  title: 'عنوان القسم',
  description: 'وصف القسم',
  icon: 'fas fa-icon-name',
  items: [
    {
      id: 'item-id',
      question: 'السؤال؟',
      answer: 'الجواب النصي...',
      tags: ['علامة1', 'علامة2'],
      links: [
        {
          title: 'رابط مفيد',
          url: '/path'
        }
      ]
    }
  ]
}
```

## الاستخدام

### إضافة قسم جديد
```javascript
// في src/constants/faqData.js
const newSection = {
  id: 'new-section',
  title: 'القسم الجديد',
  description: 'وصف القسم',
  icon: 'fas fa-new-icon',
  items: [
    // الأسئلة هنا
  ]
};
```

### إضافة سؤال جديد
```javascript
const newQuestion = {
  id: 'new-question',
  question: 'السؤال الجديد؟',
  answer: 'الجواب هنا...',
  tags: ['علامة'],
  links: [
    {
      title: 'رابط مفيد',
      url: '/helpful-link'
    }
  ]
};
```

## الميزات

### ✅ المميزات المتاحة
- بحث فوري في جميع الأسئلة والأجوبة
- تصفية بالعلامات
- رسوم متحركة سلسة
- تصميم متجاوب
- دعم الطباعة
- إمكانية الوصول (Accessibility)
- تقييم الإجابات
- روابط إضافية
- إحصائيات تفاعلية

### 🎨 التصميم
- دعم كامل للغة العربية (RTL)
- ألوان متناسقة
- خطوط Cairo
- تأثيرات Hover
- تنسيق للطباعة

### 📱 الاستجابة
- تصميم متجاوب بالكامل
- تحسين للهواتف المحمولة
- منع التكبير في iOS
- قوائم منسدلة مناسبة

## التخصيص

### تغيير الألوان
```css
/* في src/components/FAQ/FAQ.css */
:root {
  --faq-primary-color: #3b82f6;
  --faq-secondary-color: #f8fafc;
  --faq-text-color: #374151;
}
```

### إضافة أيقونات جديدة
```javascript
// استخدم Font Awesome classes
icon: 'fas fa-your-icon'
```

## الأداء
- تحميل مبطأ للمكونات
- تحسين الرسوم المتحركة
- بحث محسن
- ذاكرة تخزين للنتائج

## المتطلبات
- React 18+
- Framer Motion
- Tailwind CSS
- Font Awesome

## التطوير المستقبلي
- [ ] دعم التصنيفات المتقدمة
- [ ] تصدير PDF
- [ ] وضع ليلي
- [ ] دعم متعدد اللغات
- [ ] API للأسئلة الديناميكية 