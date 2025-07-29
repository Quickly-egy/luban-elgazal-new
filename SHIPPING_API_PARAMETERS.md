# 📋 معاملات API الشحن المُستخرجة

## 🎯 المعاملات المُستخرجة من استجابة الشحن

عند نجاح طلب الشحن، سيتم استخراج جميع المعاملات التالية:

### 📦 معاملات أساسية

| المعامل | المثال | الوصف |
|---------|--------|-------|
| `ClientOrderRef` | `"20250728-041"` | رقم الطلب المرجعي |
| `order_awb_number` | `"LUBNGZ0000055"` | رقم بوليصة الشحن |
| `consignment_number` | `"P001906351"` | رقم الشحنة |
| `reference_id` | `"20250728-041"` | الرقم المرجعي |

### 📊 تفاصيل الطلب

| المعامل | المثال | الوصف |
|---------|--------|-------|
| `type_of_order` | `"Forward"` | نوع الطلب |
| `order_number` | `"20250728-041"` | رقم الطلب |
| `Total_Number_of_Packages_in_Shipment` | `"1"` | إجمالي عدد الطرود |
| `item_awb_number` | `"[LUBNGZ0000055,]"` | أرقام البوالص للعناصر |

### 🔗 معاملات النظام

| المعامل | المثال | الوصف |
|---------|--------|-------|
| `request_id` | `"prod_mw_202507282058..."` | معرف الطلب في النظام |
| `external_api_status` | `201` | حالة API الخارجي |

## 📤 مثال كامل للمعاملات

```json
{
  "ClientOrderRef": "20250728-041",
  "order_awb_number": "LUBNGZ0000055",
  "type_of_order": "Forward",
  "order_number": "20250728-041",
  "Total_Number_of_Packages_in_Shipment": "1",
  "consignment_number": "P001906351",
  "item_awb_number": "[LUBNGZ0000055,]",
  "reference_id": "20250728-041",
  "request_id": "prod_mw_202507282058097a7c76697407e368a71c72e74409efceb6506497",
  "external_api_status": 201
}
```

## 🚀 كيفية استخدام المعاملات

### في الكونسول
عند نجاح طلب الشحن، ستجد:

```
🎯 =================================================
✅ SHIPPING SUCCESS - ALL PARAMETERS EXTRACTED
🎯 =================================================
📋 Client Order Ref: 20250728-041
📦 Order AWB Number: LUBNGZ0000055
🚛 Consignment Number: P001906351
📋 Reference ID: 20250728-041
...
📝 FOR API USE - Copy these parameters:
{
  "ClientOrderRef": "20250728-041",
  "order_awb_number": "LUBNGZ0000055",
  ...
}
🎯 =================================================
```

### استخراج البرمجي

```javascript
import { extractShippingParameters, prepareForNextAPI } from './shipping.js';

// بعد نجاح طلب الشحن
const shippingResult = await createShippingOrder(orderData);

// استخراج المعاملات
const parameters = extractShippingParameters(shippingResult);

// تحضير للـ API التالي
const readyForAPI = prepareForNextAPI(shippingResult);
```

## 📋 نصائح للمطور

1. **جميع المعاملات متاحة تلقائياً** في `shippingResult.apiParameters`
2. **النسخ من الكونسول** جاهز للاستخدام المباشر
3. **التحقق من النجاح** ضروري قبل استخراج المعاملات
4. **حفظ `request_id`** مفيد للتتبع والدعم الفني

## 🔄 التحديث المستقبلي

عند إضافة API جديد:
1. استخدم `prepareForNextAPI()` للحصول على المعاملات
2. أضف المعاملات الجديدة إلى `extractShippingParameters()`
3. حدث هذا الملف مع المعاملات الجديدة 