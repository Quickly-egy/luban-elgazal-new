# 📋 وثيقة تقنية: Backend Proxy لشركة الشحن ASYAD Express

## 🎯 الهدف من الوثيقة
هذه الوثيقة تشرح للمطور Backend كيفية إنشاء نظام Proxy لاستقبال طلبات الشحن من Frontend وإرسالها لشركة الشحن ASYAD Express.

## 🚨 المشكلة الحالية

### السبب
- شركة الشحن ASYAD Express ترفض الطلبات المباشرة من Frontend (CORS Issues)
- API Token يجب أن يبقى آمن في Backend فقط
- الحاجة لمعالجة إضافية وتسجيل العمليات في البك إند

### الحل المطلوب
إنشاء Backend Proxy يستقبل JSON كامل من Frontend ويقوم بإرساله لشركة الشحن.

---

## 🛠️ المطلوب من Backend

### 1. إنشاء API Endpoint جديد

```http
POST /api/shipping/create-order
Content-Type: application/json
Authorization: Bearer {user_token}
```

### 2. استقبال البيانات من Frontend

Backend سيستقبل JSON بالبنية التالية:

```json
{
  "order_id": 72,
  "shipping_data": {
    "ClientOrderRef": "LUBAN_72_1704123456789",
    "Description": "طلب من لبان الغزال - 2 منتج",
    "HandlingTypee": "Others",
    "ShippingCost": 50,
    "PaymentType": "COD",
    "CODAmount": 120,
    "ShipmentProduct": "EXPRESS",
    "ShipmentService": "ALL_DAY",
    "OrderType": "DROPOFF",
    "PickupType": "",
    "PickupDate": "",
    "TotalShipmentValue": 120,
    "JourneyOptions": {
      "AdditionalInfo": "ملاحظات خاصة بالطلب",
      "NOReturn": false,
      "Extra": {}
    },
    "Consignee": {
      "Name": "أحمد محمد علي",
      "CompanyName": "ASYAD Express",
      "AddressLine1": "شارع الرئيسي، بناية رقم 123",
      "AddressLine2": "الطابق الثاني، شقة 456",
      "Area": "Muscat International Airport",
      "City": "مسقط",
      "Region": "مسقط",
      "Country": "Oman",
      "ZipCode": "100",
      "MobileNo": "+968123456789",
      "PhoneNo": "",
      "Email": "customer@example.com",
      "Latitude": "23.588797597",
      "Longitude": "58.284848184",
      "Instruction": "الرجاء الاتصال قبل التسليم",
      "What3Words": "",
      "NationalId": "",
      "ReferenceNo": "",
      "Vattaxcode": "",
      "Eorinumber": ""
    },
    "Shipper": {
      "ReturnAsSame": true,
      "ContactName": "Sender of Parcel",
      "CompanyName": "Senders Company",
      "AddressLine1": "House & Building number",
      "AddressLine2": "Additional Sender Address Line",
      "Area": "Al Souq",
      "City": "Jabal Ali",
      "Region": "Jabal Ali",
      "Country": "Oman",
      "ZipCode": "121",
      "MobileNo": "962796246855",
      "TelephoneNo": "",
      "Email": "sender@email.com",
      "Latitude": "23.581069146",
      "Longitude": "58.257017583",
      "NationalId": "",
      "What3Words": "",
      "ReferenceOrderNo": "",
      "Vattaxcode": "",
      "Eorinumber": ""
    },
    "Return": {
      "ContactName": "",
      "CompanyName": "",
      "AddressLine1": "",
      "AddressLine2": "",
      "Area": "",
      "City": "",
      "Region": "",
      "Country": "",
      "ZipCode": "",
      "MobileNo": "",
      "TelephoneNo": "",
      "Email": "",
      "Latitude": "0.0",
      "Longitude": "0.0",
      "NationalId": "",
      "What3Words": "",
      "ReferenceOrderNo": "",
      "Vattaxcode": "",
      "Eorinumber": ""
    },
    "PackageDetails": [
      {
        "Package_AWB": "LUBAN_15_1",
        "Weight": 0.1,
        "Width": 10,
        "Length": 15,
        "Height": 20
      },
      {
        "Package_AWB": "LUBAN_28_2",
        "Weight": 0.1,
        "Width": 10,
        "Length": 15,
        "Height": 20
      }
    ]
  }
}
```

### 3. إرسال البيانات لشركة الشحن

```javascript
// مثال بـ Node.js/Express
app.post('/api/shipping/create-order', async (req, res) => {
  try {
    const { order_id, shipping_data } = req.body;
    
    // إرسال الطلب لشركة الشحن
    const response = await fetch('https://api.asyad.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json',
        'Cookie': 'TS0112bcbc=012c413b7e4d187d6f2e1f8bc1287d3e655e6cdec84913383d2cba6cb4d1c11ed48232825a682ef3ba3c990934c4c86387a55a66c7'
      },
      body: JSON.stringify(shipping_data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Shipping API Error: ${JSON.stringify(result)}`);
    }

    // تحديث الطلب في قاعدة البيانات
    await updateOrderShippingInfo(order_id, result);

    // إرجاع النتيجة للفرونت إند
    res.json({
      success: true,
      tracking_number: result.orderAwbNumber,
      shipping_reference: result.clientOrderRef,
      shipping_details: result
    });

  } catch (error) {
    console.error('Shipping Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error
    });
  }
});
```

---

## 📊 API Response المتوقع من شركة الشحن

### نجاح العملية (200 OK)
```json
{
  "orderAwbNumber": "AS240123001",
  "clientOrderRef": "LUBAN_72_1704123456789",
  "trackingUrl": "https://track.asyad.com/AS240123001",
  "estimatedDelivery": "2024-01-25",
  "status": "CONFIRMED"
}
```

### فشل العملية (400/500)
```json
{
  "error": "City validation failed",
  "details": {
    "Consignee": {
      "City": ["IS Not Supported For Integration"]
    }
  }
}
```

---

## 🔧 معالجة الأخطاء المطلوبة

### 1. أخطاء المدن غير المدعومة
```javascript
if (result.Consignee?.City) {
  const cityError = result.Consignee.City[0];
  if (cityError.includes('IS Not Supported For Integration')) {
    return res.status(400).json({
      success: false,
      error: `المحافظة "${shipping_data.Consignee.City}" غير مدعومة من خدمة الشحن`,
      error_type: 'UNSUPPORTED_CITY'
    });
  }
}
```

### 2. أخطاء الشبكة
```javascript
// إعادة المحاولة 3 مرات مع تأخير
const retryWithDelay = async (fn, retries = 3, delay = 2000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay);
    }
    throw error;
  }
};
```

---

## 🗄️ تحديث قاعدة البيانات

بعد نجاح إنشاء طلب الشحن، يجب تحديث جدول الطلبات:

```sql
UPDATE orders 
SET 
  tracking_number = ?,
  shipping_reference = ?,
  shipping_status = 'CONFIRMED',
  shipping_response = ?,
  updated_at = NOW()
WHERE id = ?
```

---

## 🔒 اعتبارات الأمان

### 1. التحقق من المصادقة
```javascript
// التحقق من صحة المستخدم
const user = await verifyToken(req.headers.authorization);
if (!user) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### 2. التحقق من ملكية الطلب
```javascript
// التحقق من أن المستخدم يملك الطلب
const order = await getOrderById(order_id);
if (order.user_id !== user.id) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

### 3. إخفاء API Token
```javascript
// استخدام متغيرات البيئة
const ASYAD_API_TOKEN = process.env.ASYAD_API_TOKEN;
const ASYAD_API_URL = process.env.ASYAD_API_URL;
```

---

## 📝 تسجيل العمليات (Logging)

### 1. طلبات الشحن
```javascript
// تسجيل تفاصيل الطلب
console.log(`📦 Creating shipping order for Order ID: ${order_id}`);
console.log(`📍 Customer: ${shipping_data.Consignee.Name}`);
console.log(`💰 COD Amount: ${shipping_data.CODAmount}`);
```

### 2. الاستجابات والأخطاء
```javascript
// تسجيل النتائج
if (response.ok) {
  console.log(`✅ Shipping order created: ${result.orderAwbNumber}`);
} else {
  console.error(`❌ Shipping failed: ${error.message}`);
}
```

---

## 🧪 اختبار الـ API

### cURL Command للاختبار
```bash
curl -X POST http://localhost:3000/api/shipping/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "order_id": 72,
    "shipping_data": {
      "ClientOrderRef": "LUBAN_72_TEST",
      "Description": "طلب تجريبي",
      "PaymentType": "COD",
      "CODAmount": 100,
      "Consignee": {
        "Name": "اختبار",
        "City": "مسقط",
        "MobileNo": "+968123456789"
      }
    }
  }'
```

---

## ✅ التحديثات المطلوبة في Frontend

بعد تنفيذ Backend Proxy، سيتم تحديث Frontend ليرسل الطلبات للبك إند بدلاً من شركة الشحن مباشرة:

```javascript
// تغيير من:
fetch('https://api.asyad.com/orders', {...})

// إلى:
fetch('/api/shipping/create-order', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    order_id: orderData.id,
    shipping_data: shippingJSON
  })
})
```

---

## 📞 معلومات إضافية

### بيانات اتصال شركة الشحن
- **API Base URL**: `https://api.asyad.com`
- **Documentation**: متوفرة عند الطلب
- **Support**: يمكن التواصل معهم للاستفسارات التقنية

### ملاحظات مهمة
1. الـ Token المرفق صالح للاختبار والإنتاج
2. جميع المبالغ بالريال العماني (OMR)
3. أرقام الهواتف يجب أن تكون بالتنسيق الدولي
4. المحافظات المدعومة محدودة ويجب التحقق منها مسبقاً

---

**تاريخ الإنشاء**: 2024-01-15  
**الإصدار**: 1.0  
**المطور**: فريق تطوير لبان الغزال 