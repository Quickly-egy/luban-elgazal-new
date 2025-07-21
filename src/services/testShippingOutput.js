// 🧪 ملف اختبار لطباعة بيانات الشحن للاختبار المباشر
import { printShippingTestData } from './shipping.js';

// 🧪 إنشاء بيانات اختبار مشابهة للبيانات الحقيقية
export const generateTestShippingData = () => {
  const testOrderData = {
    id: 72,
    order_number: 'ORD-20250710-031',
    status: 'confirmed',
    client: {
      id: 15,
      name: 'Abdelrahman Elsayed',
      phone: '+201288266400',
      email: 'abdelrahman@example.com'
    },
    address: {
      id: 11,
      address_line1: 'ثبثبثبث',
      address_line2: 'بثب',
      city: 'fefefefefe', // المدينة المرفوضة (لن تُستخدم)
      state: 'Jabal Ali', // المحافظة التي ستُستخدم
      country: 'UAE',
      postal_code: '12345'
    },
    items: [
      {
        id: 15,
        name: '١١١١١',
        sku: 'PROD_15',
        quantity: 1,
        price: 55
      }
    ],
    payment_method: 'cash',
    shipping_cost: 50,
    fees: 15,
    total_amount: 120,
    final_amount: 120
  };

  // محاكاة معالجة البيانات
  const regionValue = testOrderData.address.state || testOrderData.address.region || "المنطقة";
  const customerName = testOrderData.client?.name || testOrderData.customer_name || "عميل لبان الغزال";
  const customerPhone = testOrderData.client?.phone || testOrderData.customer_phone || '';
  const addressLine1 = testOrderData.address.address_line1 || testOrderData.address.address || "العنوان الرئيسي";
  const addressLine2 = testOrderData.address.address_line2 || "";
  const country = testOrderData.address.country || "Saudi Arabia";
  const zipCode = testOrderData.address.postal_code || "12345";
  const customerEmail = testOrderData.client?.email || testOrderData.customer_email || "customer@lubanelgazal.com";

  // تحديد نوع الدفع
  const paymentType = testOrderData.payment_method === 'cash' ? 'COD' : 'PREPAID';
  
  // تحويل المبالغ
  const finalAmount = parseFloat(testOrderData.final_amount) || 0;
  const shippingCost = parseFloat(testOrderData.shipping_cost) || 0;
  const codAmount = paymentType === 'COD' ? finalAmount : 0;

  // إنشاء رقم مرجعي
  const clientOrderRef = `LUBAN_${testOrderData.id}_${Date.now()}`;

  // إعداد بيانات المستلم
  const consignee = {
    Name: customerName,
    CompanyName: "",
    AddressLine1: addressLine1,
    AddressLine2: addressLine2,
    Area: regionValue,
    City: regionValue, // استخدام المحافظة بدلاً من المدينة
    Region: regionValue,
    Country: country,
    ZipCode: zipCode,
    MobileNo: customerPhone,
    PhoneNo: "",
    Email: customerEmail,
    Latitude: "24.7136",
    Longitude: "46.6753",
    Instruction: testOrderData.notes || "توصيل عادي",
    What3Words: "",
    NationalId: "",
    ReferenceNo: "",
    Vattaxcode: "",
    Eorinumber: ""
  };

  // إعداد بيانات المرسل
  const shipper = {
    ReturnAsSame: true,
    ContactName: "لبان الغزال",
    CompanyName: "شركة لبان الغزال",
    AddressLine1: "العنوان الرئيسي للشركة",
    AddressLine2: "عنوان إضافي",
    Area: "الرياض",
    City: "الرياض",
    Region: "الرياض",
    Country: "Saudi Arabia",
    ZipCode: "12345",
    MobileNo: "966500000000",
    TelephoneNo: "",
    Email: "info@lubanelgazal.com",
    Latitude: "24.7136",
    Longitude: "46.6753",
    NationalId: "",
    What3Words: "",
    ReferenceOrderNo: "",
    Vattaxcode: "",
    Eorinumber: ""
  };

  // إعداد تفاصيل الطرود
  const packageDetails = testOrderData.items.map((item, index) => ({
    Package_AWB: item.sku || `LUBAN_${item.id}_${index + 1}`,
    Weight: 0.1,
    Width: 10,
    Length: 15,
    Height: 20
  }));

  // البيانات النهائية
  const shippingOrderData = {
    ClientOrderRef: clientOrderRef,
    Description: `طلب من لبان الغزال - ${testOrderData.items?.length || 1} منتج`,
    HandlingTypee: "Others",
    ShippingCost: shippingCost,
    PaymentType: paymentType,
    CODAmount: codAmount,
    ShipmentProduct: "EXPRESS",
    ShipmentService: "ALL_DAY",
    OrderType: "DROPOFF",
    PickupType: "SAMEDAY",
    PickupDate: "",
    TotalShipmentValue: finalAmount,
    JourneyOptions: {
      AdditionalInfo: testOrderData.notes || "طلب من موقع لبان الغزال",
      NOReturn: false,
      Extra: {}
    },
    Consignee: consignee,
    Shipper: shipper,
    Return: {
      ContactName: "",
      CompanyName: "",
      AddressLine1: "",
      AddressLine2: "",
      Area: "",
      City: "",
      Region: "",
      Country: "",
      ZipCode: "",
      MobileNo: "",
      TelephoneNo: "",
      Email: "",
      Latitude: "0.0",
      Longitude: "0.0",
      NationalId: "",
      What3Words: "",
      ReferenceOrderNo: "",
      Vattaxcode: "",
      Eorinumber: ""
    },
    PackageDetails: packageDetails
  };

  return shippingOrderData;
};

// 🧪 طباعة بيانات الاختبار
export const printTestShippingData = () => {

  
  const testData = generateTestShippingData();
  
  // طباعة البيانات بتنسيق جاهز للاختبار
 
  
  return testData;
};

// إضافة الدوال للكونسول
if (typeof window !== 'undefined') {
  window.generateTestShippingData = generateTestShippingData;
  window.printTestShippingData = printTestShippingData;
  
 
} 