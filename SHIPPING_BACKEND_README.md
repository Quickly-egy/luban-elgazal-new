# 📦 ملفات Backend Proxy للشحن

## الملفات المُنشأة

### 1. `SHIPPING_BACKEND_PROXY_DOCUMENTATION.md`
**الوثيقة التقنية الرئيسية** 📋
- شرح شامل للمشكلة والحل المطلوب
- تفاصيل API Endpoints المطلوبة  
- أمثلة كود Backend (Node.js/Express)
- معالجة الأخطاء والأمان
- إرشادات قاعدة البيانات
- أوامر الاختبار

### 2. `SHIPPING_JSON_EXAMPLE.json`
**مثال JSON للاختبار** 🧪
- نموذج البيانات التي سيستقبلها Backend من Frontend
- بيانات تجريبية صحيحة للاختبار
- يمكن استخدامه مباشرة مع cURL أو Postman

## كيفية الاستخدام

1. **للمطور Backend**: 
   - اقرأ الوثيقة التقنية كاملة
   - استخدم JSON Example للاختبار
   - طبق الكود المقترح حسب إطار العمل المستخدم

2. **للاختبار**:
   ```bash
   curl -X POST http://localhost:3000/api/shipping/create-order \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer USER_TOKEN" \
     -d @SHIPPING_JSON_EXAMPLE.json
   ```

## معلومات مهمة

- **API Token**: `FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1`
- **شركة الشحن**: ASYAD Express  
- **API URL**: `https://api.asyad.com`
- **التشفير**: UTF-8 (يدعم العربية)

## الخطوات التالية

1. ✅ Backend ينشئ الـ API Endpoint
2. ✅ Backend يختبر مع JSON Example  
3. ✅ Frontend يتم تحديثه لاستخدام Backend بدلاً من الاتصال المباشر
4. ✅ اختبار شامل للنظام

---
**آخر تحديث**: 2024-01-15 