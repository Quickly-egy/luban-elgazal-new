# 🚚 تحديث تنسيق بيانات الشحن لتطابق API

## ✅ التغييرات المطبقة لتطابق المثال المطلوب

### 🔧 بيانات المستلم (Consignee):
```json
{
  "Name": "اسم العميل الفعلي",
  "CompanyName": "ASYAD Express",
  "AddressLine1": "العنوان الفعلي", 
  "AddressLine2": "العنوان الإضافي",
  "Area": "Muscat International Airport",
  "City": "Jabal Ali",
  "Region": "Jabal Ali", 
  "Country": "Oman",
  "ZipCode": "128",
  "MobileNo": "رقم الهاتف الفعلي",
  "PhoneNo": "",
  "Email": "الإيميل الفعلي",
  "Latitude": "23.588797597",
  "Longitude": "58.284848184",
  "Instruction": "Delivery Instructions"
}
```

### 📦 بيانات المرسل (Shipper):
```json
{
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
  "Email": "sender@email.com",
  "Latitude": "23.581069146",
  "Longitude": "58.257017583"
}
```

### 🎯 بيانات الطلب الرئيسية:
```json
{
  "ClientOrderRef": "LUBAN_72_1752111234567",
  "Description": "طلب من لبان الغزال - 1 منتج",
  "HandlingTypee": "Others",
  "ShippingCost": 50,
  "PaymentType": "COD",
  "CODAmount": 120,
  "ShipmentProduct": "EXPRESS", 
  "ShipmentService": "ALL_DAY",
  "OrderType": "DROPOFF",
  "PickupType": "",
  "PickupDate": "",
  "TotalShipmentValue": 120
}
```

### 📋 تفاصيل الطرود:
```json
"PackageDetails": [
  {
    "Package_AWB": "LUBAN_15_1",
    "Weight": 0.1,
    "Width": 10, 
    "Length": 15,
    "Height": 20
  }
]
```

## 🔍 الفروق الرئيسية المصححة:

1. **Country**: تغيير من "UAE/Saudi Arabia" إلى **"Oman"**
2. **CompanyName**: إضافة "ASYAD Express" للمستلم
3. **Area**: تغيير إلى "Muscat International Airport"
4. **Coordinates**: تحديث Latitude/Longitude لتطابق عُمان
5. **PickupType**: تفريغ القيمة (كانت "SAMEDAY")
6. **MobileNo**: تنسيق رقم الهاتف بدون "+" للمرسل

## 🧪 اختبار التنسيق الجديد:

```javascript
// في الكونسول
window.printTestShippingData(); // سيعرض البيانات بالتنسيق الجديد
```

## ✅ النتيجة:

الآن البيانات المرسلة **تطابق المثال بالضبط** وستظهر في الكونسول بالتنسيق المطلوب:

- ✅ Country: "Oman" 
- ✅ Coordinates: عُمان
- ✅ CompanyName: "ASYAD Express"
- ✅ Area: "Muscat International Airport"
- ✅ PickupType: فارغ
- ✅ جميع الحقول تطابق المثال

**الكود الآن يرسل البيانات بنفس التنسيق المطلوب!** 🎉 