# 🚚 نظام تكامل الشحن - ASYAD Express API

## 🎯 نظرة عامة

تم تطوير نظام متكامل للشحن يتصل مع ASYAD Express API لإنشاء طلبات الشحن تلقائياً بعد تأكيد الطلب في صفحة الـ Checkout.

## 🔧 الملفات المضافة/المحدثة:

### 1. خدمة الشحن الجديدة
📁 `src/services/shipping.js`
- خدمة شاملة للتعامل مع API الشحن
- دوال لإنشاء طلبات الشحن وتحديث قاعدة البيانات
- معالجة الأخطاء والاستجابات

### 2. تحديث إعدادات Vite
📁 `vite.config.js`
- إضافة proxy جديد `/shipping-api` لتجنب مشاكل CORS
- تمرير headers المطلوبة تلقائياً

### 3. تحديث صفحة Checkout
📁 `src/pages/Checkout/Checkout.jsx`
- دمج خدمة الشحن في عملية إنشاء الطلب
- إضافة معلومات الشحن للطلب بعد النجاح

## 🚀 كيفية عمل النظام:

### 1. إنشاء الطلب (Order Creation)
```javascript
// 1. إنشاء الطلب في قاعدة البيانات
const orderData = {
  client_id: user.id,
  client_address_id: formData.selectedAddressId,
  payment_method: 'cash' || 'credit_card' || 'tabby',
  shipping_cost: getShippingCost(),
  fees: cashOnDeliveryFee,
  items: cartItems.map(item => ({
    type: 'product',
    id: item.id,
    quantity: item.quantity,
    unit_price: item.selling_price,
    sku: item.sku || `PRODUCT_${item.id}`
  }))
};
```

### 2. إنشاء طلب الشحن (Shipping Order)
```javascript
// 2. إنشاء طلب الشحن مع ASYAD Express
const shippingOrderData = {
  ClientOrderRef: `LUBAN_${orderNumber}_${timestamp}`,
  Description: `طلب من لبان الغزال - ${items.length} منتج`,
  PaymentType: payment_method === 'cash' ? 'COD' : 'PREPAID',
  CODAmount: payment_method === 'cash' ? final_amount : 0,
  ShippingCost: shipping_cost,
  TotalShipmentValue: final_amount,
  Consignee: {
    Name: customer_name,
    AddressLine1: address.address_line1,
    City: address.city,
    Region: address.state,
    Country: address.country,
    MobileNo: customer_phone,
    Email: customer_email
  },
  PackageDetails: items.map(item => ({
    Package_AWB: item.sku,
    Weight: 0.1,
    Width: 10,
    Length: 15,
    Height: 20
  }))
};
```

### 3. حفظ معلومات الشحن
```javascript
// 3. تحديث الطلب بمعلومات الشحن
const shippingInfo = {
  shipping_reference: response.ClientOrderRef,
  tracking_number: response.order_awb_number,
  consignment_number: response.consignment_number,
  shipping_request_id: response.request_id,
  shipping_status: 'created'
};
```

## 📋 تفاصيل API الشحن:

### Endpoint
```
POST /shipping-api/orders
```

### Headers
```javascript
{
  'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
  'Content-Type': 'application/json'
}
```

### Request Body Structure
```javascript
{
  "ClientOrderRef": "LUBAN_ORDER123_1234567890",
  "Description": "طلب من لبان الغزال - 2 منتج",
  "HandlingTypee": "Others",
  "ShippingCost": 50,
  "PaymentType": "COD", // أو "PREPAID"
  "CODAmount": 150, // المبلغ المطلوب تحصيله (0 إذا كان PREPAID)
  "ShipmentProduct": "EXPRESS",
  "ShipmentService": "ALL_DAY",
  "OrderType": "DROPOFF",
  "PickupType": "SAMEDAY",
  "TotalShipmentValue": 200,
  "Consignee": {
    "Name": "اسم العميل",
    "AddressLine1": "عنوان العميل",
    "City": "المدينة",
    "Region": "المنطقة",
    "Country": "الدولة",
    "MobileNo": "رقم الهاتف",
    "Email": "البريد الإلكتروني"
  },
  "Shipper": {
    "ContactName": "لبان الغزال",
    "CompanyName": "شركة لبان الغزال",
    "Country": "Saudi Arabia"
  },
  "PackageDetails": [
    {
      "Package_AWB": "PRODUCT_123",
      "Weight": 0.1,
      "Width": 10,
      "Length": 15,
      "Height": 20
    }
  ]
}
```

### Response Structure
```javascript
{
  "status": 201,
  "success": true,
  "data": {
    "ClientOrderRef": "LUBAN_ORDER123_1234567890",
    "order_awb_number": "ASD346059", // رقم التتبع
    "details": {
      "consignment_number": "I000838336",
      "reference_id": "LUBAN_ORDER123_1234567890"
    }
  },
  "message": "Order created",
  "request_id": "prod_mw_2025070923562076789f5da284749d6f1ab420230e7d1f083edb3c"
}
```

## 🎛️ إعدادات النظام:

### معلومات الشركة المرسلة (Shipper)
```javascript
const DEFAULT_SHIPPER_INFO = {
  ContactName: "لبان الغزال",
  CompanyName: "شركة لبان الغزال",
  AddressLine1: "العنوان الرئيسي للشركة",
  City: "المدينة",
  Region: "المنطقة",
  Country: "Saudi Arabia",
  MobileNo: "966500000000",
  Email: "info@lubanelgazal.com"
};
```

### أبعاد الطرود الافتراضية
```javascript
const DEFAULT_PACKAGE_DIMENSIONS = {
  Weight: 0.1,  // كيلوجرام
  Width: 10,    // سم
  Length: 15,   // سم
  Height: 20    // سم
};
```

## 🔄 تدفق العمل (Workflow):

### 1. المستخدم يضع طلب
- اختيار المنتجات
- اختيار عنوان الشحن
- اختيار طريقة الدفع
- تأكيد الطلب

### 2. النظام ينشئ الطلب
- حفظ الطلب في قاعدة البيانات
- الحصول على رقم الطلب

### 3. النظام ينشئ طلب الشحن
- تحضير بيانات الشحن
- إرسال طلب لـ ASYAD Express API
- الحصول على رقم التتبع

### 4. النظام يحفظ معلومات الشحن
- تحديث الطلب برقم التتبع
- حفظ معلومات الشحن

### 5. العميل يحصل على التأكيد
- رقم الطلب
- رقم التتبع
- معلومات الشحن

## 🎯 الفوائد:

### 1. أتمتة كاملة
- لا حاجة لإدخال يدوي
- تقليل الأخطاء البشرية
- توفير الوقت

### 2. تتبع فوري
- رقم تتبع فوري للعميل
- ربط مباشر مع نظام الشحن
- تحديثات تلقائية

### 3. دقة البيانات
- نقل مباشر للبيانات
- تجنب الأخطاء في النسخ
- تطابق المعلومات

### 4. تجربة مستخدم محسنة
- عملية سلسة
- تأكيد فوري
- شفافية كاملة

## 🔧 معالجة الأخطاء:

### 1. أخطاء الشبكة
```javascript
try {
  const shippingResult = await processShippingOrder(orderData, token);
} catch (error) {
  console.error('خطأ في الشحن:', error);
  // الطلب يستمر حتى لو فشل الشحن
}
```

### 2. أخطاء API
```javascript
if (!response.ok) {
  throw new Error(`فشل في إنشاء طلب الشحن: ${responseData.message}`);
}
```

### 3. أخطاء البيانات
```javascript
// التحقق من البيانات المطلوبة
if (!orderData.customer_name || !orderData.shipping_address) {
  throw new Error('بيانات العميل غير مكتملة');
}
```

## 📊 البيانات المحفوظة:

### في قاعدة البيانات
- `shipping_reference`: المرجع الفريد للطلب
- `tracking_number`: رقم التتبع
- `consignment_number`: رقم الشحنة
- `shipping_request_id`: معرف طلب الشحن
- `shipping_status`: حالة الشحن

### في النظام
- معلومات الطلب الكاملة
- تفاصيل العميل
- عنوان الشحن
- تفاصيل المنتجات

## 🎉 النتيجة النهائية:

نظام شحن متكامل يوفر:
- ✅ إنشاء طلبات شحن تلقائية
- ✅ أرقام تتبع فورية
- ✅ ربط مباشر مع شركة الشحن
- ✅ معالجة أخطاء ذكية
- ✅ تجربة مستخدم سلسة
- ✅ بيانات دقيقة ومتطابقة

---

**تم التطوير**: يناير 2025  
**الحالة**: ✅ جاهز للاستخدام والاختبار 