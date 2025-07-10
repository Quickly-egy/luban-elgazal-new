// 🧪 ملف اختبار شامل لـ API الشحن
export const testShippingAPI = async () => {
  const testOrderId = 999; // ID وهمي للاختبار
  const testData = {
    "ClientOrderRef": `LUBAN_${testOrderId}_${Date.now()}`,
    "Description": "طلب اختبار من لبان الغزال",
    "HandlingTypee": "Others",
    "ShippingCost": 0,
    "PaymentType": "COD",
    "CODAmount": 100,
    "ShipmentProduct": "EXPRESS",
    "ShipmentService": "ALL_DAY",
    "OrderType": "DROPOFF",
    "PickupType": "SAMEDAY",
    "PickupDate": "",
    "TotalShipmentValue": 100,
    "JourneyOptions": {
      "AdditionalInfo": "طلب اختبار",
      "NOReturn": false,
      "Extra": {}
    },
    "Consignee": {
      "Name": "عميل اختبار",
      "CompanyName": "",
      "AddressLine1": "عنوان اختبار",
      "AddressLine2": "",
      "Area": "الرياض",
      "City": "الرياض",
      "Region": "الرياض",
      "Country": "Saudi Arabia",
      "ZipCode": "12345",
      "MobileNo": "0501234567", // رقم الهاتف كما هو مخزن في قاعدة البيانات
      "PhoneNo": "",
      "Email": "test@lubanelgazal.com",
      "Latitude": "24.7136",
      "Longitude": "46.6753",
      "Instruction": "طلب اختبار",
      "What3Words": "",
      "NationalId": "",
      "ReferenceNo": "",
      "Vattaxcode": "",
      "Eorinumber": ""
    },
    "Shipper": {
      "ReturnAsSame": true,
      "ContactName": "لبان الغزال",
      "CompanyName": "شركة لبان الغزال",
      "AddressLine1": "العنوان الرئيسي للشركة",
      "AddressLine2": "عنوان إضافي",
      "Area": "الرياض",
      "City": "الرياض",
      "Region": "الرياض",
      "Country": "Saudi Arabia",
      "ZipCode": "12345",
      "MobileNo": "966500000000",
      "TelephoneNo": "",
      "Email": "info@lubanelgazal.com",
      "Latitude": "24.7136",
      "Longitude": "46.6753",
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
        "Package_AWB": "TEST_PACKAGE_1",
        "Weight": 0.1,
        "Width": 10,
        "Length": 15,
        "Height": 20
      }
    ]
  };

  try {
    console.log('🧪 بدء اختبار API الشحن...');
    console.log('📦 بيانات الاختبار:', testData);

    const response = await fetch('/shipping-api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();
    
    console.log('📬 استجابة الاختبار:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (response.ok) {
      console.log('✅ نجح الاختبار!');
      return { success: true, data: responseData };
    } else {
      console.error('❌ فشل الاختبار:', responseData);
      return { success: false, error: responseData };
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    return { success: false, error: error.message };
  }
};

// 🧪 اختبار بيانات مختلفة لأنواع الدفع
export const testDifferentPaymentTypes = async () => {
  console.log('🧪 اختبار أنواع الدفع المختلفة...');
  
  const results = [];
  
  // اختبار الدفع عند الاستلام
  const codTest = await testShippingAPI();
  results.push({ type: 'COD', result: codTest });
  
  // اختبار الدفع المسبق
  const prepaidTestData = {
    ...testData,
    "PaymentType": "PREPAID",
    "CODAmount": 0,
    "ClientOrderRef": `LUBAN_${testOrderId}_PREPAID_${Date.now()}`
  };
  
  try {
    const prepaidResponse = await fetch('/shipping-api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prepaidTestData)
    });
    
    const prepaidData = await prepaidResponse.json();
    results.push({ 
      type: 'PREPAID', 
      result: { 
        success: prepaidResponse.ok, 
        data: prepaidData 
      } 
    });
    
  } catch (error) {
    results.push({ 
      type: 'PREPAID', 
      result: { 
        success: false, 
        error: error.message 
      } 
    });
  }
  
  console.log('📊 نتائج اختبار أنواع الدفع:', results);
  return results;
};

// 🧪 اختبار التحقق من صحة البيانات
export const testDataValidation = async () => {
  console.log('🧪 اختبار التحقق من صحة البيانات...');
  
  const invalidTests = [
    {
      name: 'بيانات ناقصة - اسم العميل',
      data: {
        ...testData,
        "ClientOrderRef": `LUBAN_${testOrderId}_INVALID_NAME_${Date.now()}`,
        "Consignee": {
          ...testData.Consignee,
          "Name": ""
        }
      }
    },
    {
      name: 'بيانات ناقصة - رقم الهاتف',
      data: {
        ...testData,
        "ClientOrderRef": `LUBAN_${testOrderId}_INVALID_PHONE_${Date.now()}`,
        "Consignee": {
          ...testData.Consignee,
          "MobileNo": ""
        }
      }
    },
    {
      name: 'بيانات ناقصة - العنوان',
      data: {
        ...testData,
        "ClientOrderRef": `LUBAN_${testOrderId}_INVALID_ADDRESS_${Date.now()}`,
        "Consignee": {
          ...testData.Consignee,
          "AddressLine1": ""
        }
      }
    }
  ];
  
  const results = [];
  
  for (const test of invalidTests) {
    try {
      const response = await fetch('/shipping-api/orders', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.data)
      });
      
      const responseData = await response.json();
      
      results.push({
        test: test.name,
        success: response.ok,
        status: response.status,
        data: responseData
      });
      
    } catch (error) {
      results.push({
        test: test.name,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('📊 نتائج اختبار التحقق من صحة البيانات:', results);
  return results;
};

// 🧪 اختبار شامل
export const runAllTests = async () => {
  console.log('🚀 بدء الاختبارات الشاملة...');
  
  const results = {
    basicTest: null,
    paymentTypesTest: null,
    validationTest: null,
    timestamp: new Date().toISOString()
  };
  
  try {
    // الاختبار الأساسي
    console.log('1️⃣ تشغيل الاختبار الأساسي...');
    results.basicTest = await testShippingAPI();
    
    // اختبار أنواع الدفع
    console.log('2️⃣ تشغيل اختبار أنواع الدفع...');
    results.paymentTypesTest = await testDifferentPaymentTypes();
    
    // اختبار التحقق من صحة البيانات
    console.log('3️⃣ تشغيل اختبار التحقق من صحة البيانات...');
    results.validationTest = await testDataValidation();
    
    console.log('✅ انتهت جميع الاختبارات');
    console.log('📊 النتائج النهائية:', results);
    
    return results;
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل الاختبارات:', error);
    return {
      ...results,
      error: error.message
    };
  }
};

// 🧪 اختبار تتبع الشحن (وهمي)
export const testTrackingAPI = async (trackingNumber = 'TEST_TRACKING_123') => {
  console.log('🧪 اختبار تتبع الشحن:', trackingNumber);
  
  try {
    const response = await fetch(`/shipping-api/track/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json'
      }
    });
    
    const responseData = await response.json();
    
    console.log('📊 نتيجة تتبع الشحن:', {
      status: response.status,
      data: responseData
    });
    
    return {
      success: response.ok,
      data: responseData,
      trackingNumber
    };
    
  } catch (error) {
    console.error('❌ خطأ في تتبع الشحن:', error);
    return {
      success: false,
      error: error.message,
      trackingNumber
    };
  }
};

// Test case for unsupported city
export const testUnsupportedCity = async () => {
  console.log('\n🧪 اختبار محافظة غير مدعومة...');
  
  // إنشاء بيانات اختبار مع محافظة غير مدعومة
  const testOrderId = 999;
  const testOrder = {
    "ClientOrderRef": `LUBAN_${testOrderId}_UNSUPPORTED_${Date.now()}`,
    "Description": "اختبار محافظة غير مدعومة",
    "HandlingTypee": "Others",
    "ShippingCost": 0,
    "PaymentType": "COD",
    "CODAmount": 100,
    "ShipmentProduct": "EXPRESS",
    "ShipmentService": "ALL_DAY",
    "OrderType": "DROPOFF",
    "PickupType": "SAMEDAY",
    "PickupDate": "",
    "TotalShipmentValue": 100,
    "JourneyOptions": {
      "AdditionalInfo": "اختبار محافظة غير مدعومة",
      "NOReturn": false,
      "Extra": {}
    },
    "Consignee": {
      "Name": "عميل اختبار",
      "CompanyName": "",
      "AddressLine1": "عنوان اختبار",
      "AddressLine2": "",
      "Area": "بثبثب", // المحافظة غير المدعومة
      "City": "بثبثب", // نفس قيمة المحافظة
      "Region": "بثبثب", // نفس قيمة المحافظة
      "Country": "Saudi Arabia",
      "ZipCode": "12345",
      "MobileNo": "0501234567",
      "PhoneNo": "",
      "Email": "test@lubanelgazal.com",
      "Latitude": "24.7136",
      "Longitude": "46.6753",
      "Instruction": "اختبار محافظة غير مدعومة",
      "What3Words": "",
      "NationalId": "",
      "ReferenceNo": "",
      "Vattaxcode": "",
      "Eorinumber": ""
    },
    "Shipper": {
      "ReturnAsSame": true,
      "ContactName": "لبان الغزال",
      "CompanyName": "شركة لبان الغزال",
      "AddressLine1": "العنوان الرئيسي للشركة",
      "AddressLine2": "عنوان إضافي",
      "Area": "الرياض",
      "City": "الرياض",
      "Region": "الرياض",
      "Country": "Saudi Arabia",
      "ZipCode": "12345",
      "MobileNo": "966500000000",
      "TelephoneNo": "",
      "Email": "info@lubanelgazal.com",
      "Latitude": "24.7136",
      "Longitude": "46.6753",
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
        "Package_AWB": "TEST_UNSUPPORTED_CITY",
        "Weight": 0.1,
        "Width": 10,
        "Length": 15,
        "Height": 20
      }
    ]
  };
    
    const response = await fetch('/shipping-api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });
    
    const responseData = await response.json();
    
  try {
    const response = await fetch('/shipping-api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('❌ الاختبار فشل - كان يجب أن يفشل للمحافظة غير المدعومة');
      console.log('📬 استجابة الاختبار:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
    } else {
      console.log('✅ الاختبار نجح - تم رفض المحافظة غير المدعومة');
      console.log('📝 رسالة الخطأ:', responseData);
    }
    
  } catch (error) {
    if (error.message.includes('غير مدعومة')) {
      console.log('✅ الاختبار نجح - تم اكتشاف المحافظة غير المدعومة');
      console.log('📝 رسالة الخطأ:', error.message);
    } else {
      console.log('⚠️ الاختبار جزئي - خطأ مختلف:', error.message);
    }
  }
};

// Test city validation functions
export const testCityValidation = () => {
  console.log('\n🧪 اختبار التحقق من المدن...');
  
  // Import validation functions dynamically
  import('./shipping.js').then(({ validateCity, getSupportedCities }) => {
    // Test supported cities
    const supportedCities = ['RIYADH', 'JEDDAH', 'DAMMAM'];
    supportedCities.forEach(city => {
      const isValid = validateCity(city);
      console.log(`${isValid ? '✅' : '❌'} ${city}: ${isValid ? 'مدعومة' : 'غير مدعومة'}`);
    });
    
    // Test unsupported cities
    const unsupportedCities = ['بثبثب', 'INVALID_CITY', 'تست'];
    unsupportedCities.forEach(city => {
      const isValid = validateCity(city);
      console.log(`${!isValid ? '✅' : '❌'} ${city}: ${!isValid ? 'غير مدعومة (صحيح)' : 'مدعومة (خطأ)'}`);
    });
    
    // Test case sensitivity
    const caseSensitiveTests = ['riyadh', 'Riyadh', 'RIYADH'];
    caseSensitiveTests.forEach(city => {
      const isValid = validateCity(city);
      console.log(`${isValid ? '✅' : '❌'} ${city}: ${isValid ? 'مدعومة' : 'غير مدعومة'}`);
    });
    
    // Show all supported cities
    console.log('\n📍 المدن المدعومة:', getSupportedCities());
  }).catch(error => {
    console.error('❌ خطأ في تحميل دوال التحقق:', error);
  });
};

// تشغيل الاختبار في الكونسول
if (typeof window !== 'undefined') {
  window.testShippingAPI = testShippingAPI;
  window.testDifferentPaymentTypes = testDifferentPaymentTypes;
  window.testDataValidation = testDataValidation;
  window.runAllTests = runAllTests;
  window.testTrackingAPI = testTrackingAPI;
  window.testUnsupportedCity = testUnsupportedCity;
  window.testCityValidation = testCityValidation;
  
  // إضافة رسالة مساعدة
  console.log(`
🚚 مرحباً بك في اختبارات API الشحن!

الاختبارات المتاحة:
- window.testShippingAPI() - اختبار أساسي
- window.testDifferentPaymentTypes() - اختبار أنواع الدفع
- window.testDataValidation() - اختبار التحقق من البيانات
- window.runAllTests() - تشغيل جميع الاختبارات
- window.testTrackingAPI('رقم_التتبع') - اختبار تتبع الشحن
- window.testUnsupportedCity() - اختبار محافظة غير مدعومة
- window.testCityValidation() - اختبار التحقق من المحافظات

مثال: window.runAllTests()
  `);
} 