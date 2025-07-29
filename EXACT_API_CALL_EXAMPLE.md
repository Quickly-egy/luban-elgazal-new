# 🎯 مثال دقيق للـ API Call بعد نجاح الشحن

## 📋 ما يحدث بعد نجاح طلب الشحن

### 1️⃣ **استخراج البيانات من Response الطلب الخارجي**

```javascript
// من استجابة Laravel Backend Proxy
const externalData = responseData.data.data; // البيانات من ASYAD API
const orderDetails = externalData.details || {}; // تفاصيل الطلب

const shippingParameters = {
  ClientOrderRef: externalData.ClientOrderRef,           // "20250728-043"
  order_awb_number: externalData.order_awb_number,       // "LUBNGZ0005555"
  consignment_number: orderDetails.consignment_number,   // "P005000000"
  reference_id: orderDetails.reference_id                // "REF-MEDIUM-2025"
};
```

### 2️⃣ **تكوين Payload للتحديث**

```javascript
const updateData = {
  order_number: orderNumber,                              // "ORD-20250728-043"
  external_awb_number: shippingParameters.order_awb_number,      // "LUBNGZ0005555"
  consignment_number: shippingParameters.consignment_number,     // "P005000000"
  external_reference_id: shippingParameters.reference_id         // "REF-MEDIUM-2025"
};
```

### 3️⃣ **الـ API Call الدقيق اللي بيحصل**

```bash
curl --location --request PUT 'https://app.quickly.codes/luban-elgazal/public/api/external-order/update-shipping' \
--header 'Authorization: Bearer 318|8ZrKrDJ5rTan8O8WjzQMaZDlVU3VtrP36PbHvLZV696023bc' \
--header 'Content-Type: application/json' \
--data '{
  "order_number": "ORD-20250728-043",
  "external_awb_number": "LUBNGZ0005555",
  "consignment_number": "P005000000",
  "external_reference_id": "REF-MEDIUM-2025"
}'
```

## 🔍 **Console Output المتوقع**

```
🎯 STARTING SHIPPING ORDER CREATION
═══════════════════════════════════════════════════════════

📦 Order AWB Number: LUBNGZ0005555
🚛 Consignment Number: P005000000
🔗 Reference ID: REF-MEDIUM-2025
📋 Client Order Ref: 20250728-043

✅ SHIPPING SUCCESS - ALL PARAMETERS EXTRACTED
═══════════════════════════════════════════════════════════

🔄 AUTO-UPDATE FROM SHIPPING SUCCESS
═══════════════════════════════════════════════════════════
📋 Order Number: ORD-20250728-043
📦 Source: Shipping API Success Response
📝 Timing: After basic order update
🎯 Purpose: Add detailed shipping info to database

🎯 Mapping for Update API:
  📋 order_number: ORD-20250728-043
  📦 external_awb_number: LUBNGZ0005555
  🚛 consignment_number: P005000000
  🔗 external_reference_id: REF-MEDIUM-2025

📝 Final Update Payload (matching curl):
{
  "order_number": "ORD-20250728-043",
  "external_awb_number": "LUBNGZ0005555",
  "consignment_number": "P005000000",
  "external_reference_id": "REF-MEDIUM-2025"
}

🧪 TESTING UPDATE PAYLOAD STRUCTURE
═══════════════════════════════════════════════════════════
🎯 Expected curl command format:
curl --location --request PUT 'https://app.quickly.codes/luban-elgazal/public/api/external-order/update-shipping' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "order_number": "ORD-20250728-043",
  "external_awb_number": "LUBNGZ0005555",
  "consignment_number": "P005000000",
  "external_reference_id": "REF-MEDIUM-2025"
}'

🔍 Payload Verification:
✅ order_number: ✓
✅ external_awb_number: ✓
✅ consignment_number: ✓
✅ external_reference_id: ✓
═══════════════════════════════════════════════════════════

🔄 STARTING SHIPPING DATA UPDATE
═══════════════════════════════════════════════════════════
📋 Order Number: ORD-20250728-043
🎯 Target Endpoint: https://app.quickly.codes/luban-elgazal/public/api/external-order/update-shipping
📤 Final Payload (matching curl command):
{
  "order_number": "ORD-20250728-043",
  "external_awb_number": "LUBNGZ0005555",
  "consignment_number": "P005000000",
  "external_reference_id": "REF-MEDIUM-2025"
}

🚀 Sending update request to: https://app.quickly.codes/luban-elgazal/public/api/external-order/update-shipping
🔐 Using token: Token found ✅

📡 Update Response Status: 200
📡 Raw Update Response: {"success":true,"message":"تم تحديث بيانات الشحن بنجاح"}

🎉 SHIPPING DATA UPDATED SUCCESSFULLY
═══════════════════════════════════════════════════════════
📋 Updated Order ID: 123
📦 Updated Fields: ["external_awb_number", "consignment_number", "external_reference_id"]
✅ Database updated successfully with detailed shipping data
```

## ✅ **التحقق من النجاح**

### في `Checkout.jsx`:
```javascript
if (shippingResult.databaseUpdate.success) {
  console.log('✅ Order database updated with detailed shipping info:', {
    updated_fields: shippingResult.databaseUpdate.updated_fields,
    awb_number: shippingResult.trackingNumber,
    consignment_number: shippingResult.consignmentNumber
  });
}
```

## 🔧 **Token Management**

النظام يبحث عن Token بالترتيب التالي:
1. `localStorage.getItem('token')`
2. `sessionStorage.getItem('token')`  
3. **Fallback:** `318|8ZrKrDJ5rTan8O8WjzQMaZDlVU3VtrP36PbHvLZV696023bc`

## 🎯 **Data Flow Summary**

```
🚛 External Shipping API Success
    ↓
📦 Extract: AWB, Consignment, Reference, Order Ref
    ↓
🔄 Auto-trigger Update API
    ↓
📤 Send exact curl-format payload
    ↓
✅ Database updated with shipping details
```

---

**النتيجة:** الـ API Call يطابق تماماً الـ curl command المطلوب! 🎯✅ 