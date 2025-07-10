// 🚚 خدمة شركة الشحن - ASYAD Express API
const SHIPPING_API_BASE = '/shipping-api'; // استخدام الـ proxy
const SHIPPING_API_TOKEN = 'FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1';

// 📦 إعدادات افتراضية للشحن
const DEFAULT_PACKAGE_DIMENSIONS = {
  Weight: 0.1,
  Width: 10,
  Length: 15,
  Height: 20
};

const DEFAULT_SHIPPER_INFO = {
  ReturnAsSame: true,
  ContactName: "Sender of Parcel", // تطابق المثال
  CompanyName: "Senders Company", // تطابق المثال
  AddressLine1: "House & Building number", // تطابق المثال
  AddressLine2: "Additional Sender Address Line", // تطابق المثال
  Area: "Al Souq", // تطابق المثال
  City: "Jabal Ali", // تطابق المثال
  Region: "Jabal Ali", // تطابق المثال
  Country: "Oman", // تطابق المثال
  ZipCode: "121", // تطابق المثال
  MobileNo: "962796246855", // تطابق المثال (بدون +)
  TelephoneNo: "",
  Email: "sender@email.com", // تطابق المثال
  Latitude: "23.581069146", // تطابق المثال
  Longitude: "58.257017583", // تطابق المثال
  NationalId: "",
  What3Words: "",
  ReferenceOrderNo: "",
  Vattaxcode: "",
  Eorinumber: ""
};

// 🛡️ التحقق من صحة بيانات الشحن
const validateShippingData = (orderData) => {
  const errors = [];

  // التحقق من البيانات الأساسية
  const customerName = orderData.client?.name || orderData.customer_name;
  if (!customerName || customerName.trim() === '') {
    errors.push('اسم العميل مطلوب');
  }

  const customerPhone = orderData.client?.phone || orderData.customer_phone;
  if (!customerPhone || customerPhone.trim() === '') {
    errors.push('رقم هاتف العميل مطلوب');
  }

  // التحقق من عنوان الشحن - دعم بنية البيانات المختلفة
  const addressData = orderData.address || orderData.shipping_address;
  if (!addressData) {
    errors.push('عنوان الشحن مطلوب');
  } else {
    const addressLine1 = addressData.address_line1 || addressData.address;
    if (!addressLine1) {
      errors.push('العنوان الأساسي مطلوب');
    }
    
    const state = addressData.state || addressData.region;
    if (!state) {
      errors.push('المحافظة مطلوبة');
    }
  }

  if (!orderData.items || orderData.items.length === 0) {
    errors.push('المنتجات مطلوبة');
  }

  const finalAmount = orderData.final_amount || orderData.total_amount;
  if (!finalAmount || finalAmount <= 0) {
    errors.push('المبلغ الإجمالي مطلوب');
  }

  return errors;
};

// 🔄 إعادة المحاولة مع التأخير
const retryWithDelay = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`❌ المحاولة ${i + 1} فشلت:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error; // آخر محاولة، ارمي الخطأ
      }
      
      // انتظار قبل المحاولة التالية
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

/**
 * 🎯 إنشاء طلب شحن جديد
 * @param {Object} orderData - بيانات الطلب
 * @returns {Promise<Object>} - استجابة API الشحن
 */
export const createShippingOrder = async (orderData) => {
  try {
    console.log('🚚 بدء إنشاء طلب الشحن:', orderData);

    // التحقق من صحة البيانات
    const validationErrors = validateShippingData(orderData);
    if (validationErrors.length > 0) {
      throw new Error(`بيانات غير صحيحة: ${validationErrors.join(', ')}`);
    }

    // التحقق من دعم المحافظة (التي ستُستخدم كمدينة)
    let regionName;
    if (orderData.address) {
      // البيانات من قاعدة البيانات
      regionName = orderData.address.state || orderData.address.region || '';
    } else if (orderData.shipping_address) {
      // البيانات من الإنشاء المباشر
      regionName = orderData.shipping_address.state || orderData.shipping_address.region || '';
    } else {
      regionName = '';
    }
    
    console.log('🔍 التحقق من المحافظة:', regionName);
    
    if (!validateCity(regionName)) {
      throw new Error(`المحافظة "${regionName}" غير مدعومة من خدمة الشحن ASYAD Express. المحافظات المدعومة: ${getSupportedCities().join(', ')}`);
    }

    // تحديد نوع الدفع
    const paymentType = orderData.payment_method === 'cash' ? 'COD' : 'PREPAID';
    
    // تحويل المبالغ إلى أرقام - دعم بنية البيانات المختلفة
    const finalAmountRaw = orderData.final_amount || orderData.total_amount || 0;
    const finalAmount = typeof finalAmountRaw === 'string' 
      ? parseFloat(finalAmountRaw.replace(/[^\d.]/g, '')) 
      : parseFloat(finalAmountRaw) || 0;
    
    const shippingCostRaw = orderData.shipping_cost || orderData.shipping_fees || 0;
    const shippingCost = typeof shippingCostRaw === 'string'
      ? parseFloat(shippingCostRaw.replace(/[^\d.]/g, ''))
      : parseFloat(shippingCostRaw) || 0;
    
    const codAmount = paymentType === 'COD' ? finalAmount : 0;

    // إنشاء رقم مرجعي فريد للطلب باستخدام ID
    const clientOrderRef = `LUBAN_${orderData.id}_${Date.now()}`;

    // استخدام رقم الهاتف كما هو مخزن في بيانات العميل دون تغيير
    const customerPhone = orderData.client?.phone || orderData.customer_phone || '';
    
    console.log('📱 رقم الهاتف المرسل:', customerPhone);

    // تحضير البيانات - معالجة بنية البيانات المختلفة
    let regionValue;
    let addressLine1;
    let addressLine2;
    let zipCode;
    let customerName;
    let customerEmail;
    
    // التحقق من بنية البيانات - من قاعدة البيانات أم من الإنشاء المباشر
    if (orderData.address) {
      // البيانات من قاعدة البيانات
      regionValue = orderData.address.state || orderData.address.region || "Jabal Ali";
      addressLine1 = orderData.address.address_line1 || orderData.address.address || "AE HQ";
      addressLine2 = orderData.address.address_line2 || "Old Airport";
      zipCode = orderData.address.postal_code || "128";
      customerName = orderData.client?.name || orderData.customer_name || "Test Receiver";
      customerEmail = orderData.client?.email || orderData.customer_email || "receiver@email.com";
    } else if (orderData.shipping_address) {
      // البيانات من الإنشاء المباشر
      regionValue = orderData.shipping_address.state || orderData.shipping_address.region || "Jabal Ali";
      addressLine1 = orderData.shipping_address.address_line1 || "AE HQ";
      addressLine2 = orderData.shipping_address.address_line2 || "Old Airport";
      zipCode = orderData.shipping_address.postal_code || "128";
      customerName = orderData.customer_name || "Test Receiver";
      customerEmail = orderData.customer_email || "receiver@email.com";
    } else {
      // بيانات افتراضية تطابق المثال
      regionValue = "Jabal Ali";
      addressLine1 = "AE HQ";
      addressLine2 = "Old Airport";
      zipCode = "128";
      customerName = orderData.customer_name || "Test Receiver";
      customerEmail = orderData.customer_email || "receiver@email.com";
    }
    
    console.log('🏠 بيانات العنوان المستخدمة:', {
      regionValue,
      addressLine1,
      addressLine2,
      zipCode,
      customerName,
      customerEmail
    });

    // تحضير بيانات العميل (المستلم) - تطابق المثال المطلوب
    const consignee = {
      Name: customerName,
      CompanyName: "ASYAD Express", // تطابق المثال
      AddressLine1: addressLine1,
      AddressLine2: addressLine2,
      Area: "Muscat International Airport", // تطابق المثال
      City: regionValue,
      Region: regionValue,
      Country: "Oman", // تطابق المثال
      ZipCode: zipCode,
      MobileNo: customerPhone || "+962796246855", // تطابق المثال
      PhoneNo: "",
      Email: customerEmail,
      Latitude: "23.588797597", // تطابق المثال
      Longitude: "58.284848184", // تطابق المثال
      Instruction: orderData.notes || "Delivery Instructions",
      What3Words: "",
      NationalId: "",
      ReferenceNo: "",
      Vattaxcode: "",
      Eorinumber: ""
    };

    // تحضير تفاصيل الطرود
    const packageDetails = orderData.items.map((item, index) => ({
      Package_AWB: item.sku || `LUBAN_${item.id}_${index + 1}`,
      Weight: DEFAULT_PACKAGE_DIMENSIONS.Weight,
      Width: DEFAULT_PACKAGE_DIMENSIONS.Width,
      Length: DEFAULT_PACKAGE_DIMENSIONS.Length,
      Height: DEFAULT_PACKAGE_DIMENSIONS.Height
    }));

    // تحضير بيانات طلب الشحن - تطابق المثال بالضبط
    const shippingOrderData = {
      ClientOrderRef: `LUBAN_${orderData.id}_${Date.now()}`, // أو يمكن استخدام تنسيق مشابه للمثال
      Description: `طلب من لبان الغزال - ${orderData.items?.length || 1} منتج`,
      HandlingTypee: "Others", // تطابق المثال
      ShippingCost: shippingCost,
      PaymentType: paymentType,
      CODAmount: codAmount,
      ShipmentProduct: "EXPRESS", // تطابق المثال
      ShipmentService: "ALL_DAY", // تطابق المثال
      OrderType: "DROPOFF", // تطابق المثال
      PickupType: "", // فارغ كما في المثال
      PickupDate: "", // فارغ كما في المثال
      TotalShipmentValue: finalAmount,
      JourneyOptions: {
        AdditionalInfo: orderData.notes || "",
        NOReturn: false,
        Extra: {}
      },
      Consignee: consignee,
      Shipper: DEFAULT_SHIPPER_INFO,
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

    console.log('📦 بيانات طلب الشحن المحضرة:', shippingOrderData);
    console.log('🔍 تفاصيل المستلم:', {
      Name: consignee.Name,
      Area: consignee.Area,
      City: consignee.City,
      Region: consignee.Region,
      MobileNo: consignee.MobileNo
    });

    // 🧪 طباعة البيانات بتنسيق جاهز للاختبار
    printShippingDataForTesting(shippingOrderData);

    // إرسال الطلب مع إعادة المحاولة
    const response = await retryWithDelay(async () => {
      return await fetch(`${SHIPPING_API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SHIPPING_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Cookie': 'TS0112bcbc=012c413b7e4d187d6f2e1f8bc1287d3e655e6cdec84913383d2cba6cb4d1c11ed48232825a682ef3ba3c990934c4c86387a55a66c7'
        },
        body: JSON.stringify(shippingOrderData)
      });
    }, 3, 2000);

    // معالجة أفضل للاستجابة
    console.log('📡 تفاصيل الاستجابة:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const responseText = await response.text();
    console.log('📄 نص الاستجابة الخام:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ خطأ في تحليل JSON:', parseError);
      console.error('📄 النص الخام:', responseText);
      throw new Error(`استجابة غير صالحة من الخادم: ${responseText}`);
    }
    console.log('📬 استجابة API الشحن:', responseData);
    
    // إضافة تفاصيل إضافية للخطأ
    if (!response.ok) {
      console.error('❌ تفاصيل الخطأ:', {
        status: response.status,
        statusText: response.statusText,
        responseData,
        sentData: shippingOrderData
      });
      
      // Handle specific ASYAD Express city validation errors
      if (responseData.Consignee?.City) {
        const cityError = responseData.Consignee.City[0];
        if (cityError.includes('IS Not Supported For Integration')) {
          const regionName = consignee.City; // نستخدم المحافظة كمدينة
          throw new Error(`المحافظة "${regionName}" غير مدعومة من خدمة الشحن ASYAD Express. يرجى التواصل مع الدعم للحصول على قائمة المحافظات المتاحة.`);
        }
      }
      
      // Extract detailed error message
      const errorMessage = extractErrorMessage(responseData);
      throw new Error(`فشل في إنشاء طلب الشحن: ${errorMessage}`);
    }

    if (responseData.success && responseData.status === 201) {
      console.log('✅ تم إنشاء طلب الشحن بنجاح');
      
      // استخراج البيانات المهمة
      const shippingResult = {
        success: true,
        clientOrderRef: responseData.data.ClientOrderRef,
        orderAwbNumber: responseData.data.order_awb_number,
        consignmentNumber: responseData.data.details?.consignment_number,
        requestId: responseData.request_id,
        status: 'created',
        createdAt: new Date().toISOString(),
        fullResponse: responseData
      };

      return shippingResult;
    } else {
      throw new Error(`فشل في إنشاء طلب الشحن: ${responseData.message || 'استجابة غير متوقعة'}`);
    }

  } catch (error) {
    console.error('❌ خطأ في إنشاء طلب الشحن:', error);
    throw error;
  }
};

/**
 * 🔍 تتبع حالة الشحن
 * @param {string} trackingNumber - رقم التتبع
 * @returns {Promise<Object>} - حالة الشحن
 */
export const trackShippingOrder = async (trackingNumber) => {
  try {
    console.log('🔍 تتبع طلب الشحن:', trackingNumber);

    const response = await fetch(`${SHIPPING_API_BASE}/track/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SHIPPING_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();
    console.log('📊 حالة الشحن:', responseData);

    if (!response.ok) {
      throw new Error(`فشل في تتبع الشحن: ${responseData.message || 'خطأ غير معروف'}`);
    }

    return {
      success: true,
      trackingNumber,
      status: responseData.status,
      location: responseData.location,
      estimatedDelivery: responseData.estimated_delivery,
      history: responseData.history || [],
      lastUpdate: new Date().toISOString()
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

/**
 * 🔄 تحديث طلب في قاعدة البيانات بمعلومات الشحن
 * @param {number} orderId - رقم الطلب
 * @param {Object} shippingData - بيانات الشحن
 * @param {string} token - رمز المصادقة
 * @returns {Promise<Object>} - استجابة التحديث
 */
export const updateOrderWithShippingInfo = async (orderId, shippingData, token) => {
  try {
    console.log('🔄 تحديث الطلب بمعلومات الشحن:', { orderId, shippingData });

    const response = await fetch(`https://app.quickly.codes/luban-elgazal/public/api/orders/${orderId}/shipping`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipping_reference: shippingData.clientOrderRef,
        tracking_number: shippingData.orderAwbNumber,
        consignment_number: shippingData.consignmentNumber,
        shipping_request_id: shippingData.requestId,
        shipping_status: shippingData.status || 'created',
        shipping_created_at: shippingData.createdAt
      })
    });

    const responseData = await response.json();
    console.log('📝 استجابة تحديث الطلب:', responseData);

    if (!response.ok) {
      throw new Error(`فشل في تحديث الطلب: ${responseData.message || 'خطأ غير معروف'}`);
    }

    return responseData;

  } catch (error) {
    console.error('❌ خطأ في تحديث الطلب:', error);
    throw error;
  }
};

/**
 * 🎯 دالة شاملة لإنشاء طلب الشحن وتحديث قاعدة البيانات
 * @param {Object} orderData - بيانات الطلب
 * @param {string} token - رمز المصادقة
 * @returns {Promise<Object>} - النتيجة النهائية
 */
export const processShippingOrder = async (orderData, token) => {
  try {
    console.log('🚀 بدء معالجة طلب الشحن الكامل:', orderData);

    // 1. إنشاء طلب الشحن
    const shippingResult = await createShippingOrder(orderData);

    // 2. تحديث الطلب في قاعدة البيانات
    const updateResult = await updateOrderWithShippingInfo(
      orderData.id,
      shippingResult,
      token
    );

    console.log('✅ تم إنجاز معالجة الشحن بنجاح');

    return {
      success: true,
      shipping: shippingResult,
      orderUpdate: updateResult,
      trackingNumber: shippingResult.orderAwbNumber,
      shippingReference: shippingResult.clientOrderRef,
      message: 'تم إنشاء طلب الشحن بنجاح'
    };

  } catch (error) {
    console.error('❌ خطأ في معالجة طلب الشحن:', error);
    
    return {
      success: false,
      error: error.message,
      details: error,
      message: 'فشل في إنشاء طلب الشحن'
    };
  }
};

/**
 * 📋 الحصول على معلومات الشحن من قاعدة البيانات
 * @param {number} orderId - رقم الطلب
 * @param {string} token - رمز المصادقة
 * @returns {Promise<Object>} - معلومات الشحن
 */
export const getOrderShippingInfo = async (orderId, token) => {
  try {
    console.log('📋 الحصول على معلومات الشحن للطلب:', orderId);

    const response = await fetch(`https://app.quickly.codes/luban-elgazal/public/api/orders/${orderId}/shipping`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`فشل في الحصول على معلومات الشحن: ${responseData.message || 'خطأ غير معروف'}`);
    }

    return {
      success: true,
      data: responseData.data
    };

  } catch (error) {
    console.error('❌ خطأ في الحصول على معلومات الشحن:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 📋 تصدير الدوال
export default {
  createShippingOrder,
  trackShippingOrder,
  updateOrderWithShippingInfo,
  processShippingOrder,
  getOrderShippingInfo
}; 

// Add function to get supported cities (you can expand this based on ASYAD documentation)
export const getSupportedCities = () => {
  // This includes major cities from Saudi Arabia and UAE that are commonly supported
  return [
    // Saudi Arabia - المملكة العربية السعودية
    'RIYADH',
    'JEDDAH', 
    'DAMMAM',
    'MECCA',
    'MEDINA',
    'TAIF',
    'KHOBAR',
    'JUBAIL',
    'YANBU',
    'ABHA',
    'TABUK',
    'BURAIDAH',
    'KHAMIS MUSHAIT',
    'HAIL',
    'HAFR AL BATIN',
    'NAJRAN',
    'AL QATIF',
    'AL HAWIYAH',
    'UNAIZAH',
    'SAKAKA',
    
    // UAE - دولة الإمارات العربية المتحدة
    'DUBAI',
    'ABU DHABI',
    'SHARJAH',
    'AJMAN',
    'FUJAIRAH',
    'RAS AL KHAIMAH',
    'UMM AL QUWAIN',
    'JABAL ALI',
    'JEBEL ALI', 
    'JABAL_ALI',
    'JEBEL_ALI',
    'AL AIN',
    
    // Alternative spellings and common variations
    'RIYADH REGION',
    'EASTERN PROVINCE',
    'MAKKAH',
    'MADINAH',
    'DUBAI EMIRATE',
    'ABU DHABI EMIRATE'
  ];
};

// Add function to validate city before creating shipping order
export const validateCity = (city) => {
  if (!city) return false;
  
  const supportedCities = getSupportedCities();
  const normalizedCity = city.toUpperCase().trim();
  
  // Direct match
  if (supportedCities.includes(normalizedCity)) {
    return true;
  }
  
  // Check for partial matches or common variations
  const cityVariations = {
    'JABAL AL I': ['JEBEL AL I', 'JABAL AL I', 'JABEL AL I'],
    'ABU DHABI': ['ABUDHABI', 'ABU DHABI EMIRATE'],
    'DUBAI': ['DUBAI EMIRATE', 'DUBAYY'],
    'RIYADH': ['RIYADH REGION', 'AR RIYADH'],
    'JEDDAH': ['JIDDAH', 'JEDDA'],
    'MECCA': ['MAKKAH', 'MAKKAH AL MUKARRAMAH'],
    'MEDINA': ['MADINAH', 'AL MADINAH']
  };
  
  // Check variations
  for (const [standard, variations] of Object.entries(cityVariations)) {
    if (variations.includes(normalizedCity) || normalizedCity.includes(standard)) {
      return true;
    }
  }
  
  // Check if the city contains any of the supported cities
  for (const supportedCity of supportedCities) {
    if (normalizedCity.includes(supportedCity) || supportedCity.includes(normalizedCity)) {
      return true;
    }
  }
  
  return false;
}; 

// Helper function to extract error messages from API response
const extractErrorMessage = (result) => {
  if (typeof result === 'string') {
    return result;
  }
  
  if (result.ErrorMessage) {
    return result.ErrorMessage;
  }
  
  if (result.Consignee) {
    const consigneeErrors = [];
    Object.keys(result.Consignee).forEach(key => {
      if (Array.isArray(result.Consignee[key])) {
        consigneeErrors.push(`${key}: ${result.Consignee[key].join(', ')}`);
      }
    });
    if (consigneeErrors.length > 0) {
      return consigneeErrors.join('; ');
    }
  }
  
  return 'Unknown error occurred';
}; 

// 🧪 دالة مساعدة لطباعة البيانات للاختبار
const printShippingDataForTesting = (shippingOrderData) => {
  console.log('\n🧪 ═══════════════════════════════════════════════════════════════════════════════');
  console.log('🚚 البيانات المرسلة لـ API الشحن - جاهزة للاختبار');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  
  // JSON منسق للنسخ
  console.log('📋 JSON للنسخ واللصق:');
  console.log(JSON.stringify(shippingOrderData, null, 2));
  
  console.log('\n🔗 تفاصيل الطلب:');
  console.log(`URL: ${SHIPPING_API_BASE}/orders`);
  console.log(`Method: POST`);
  console.log(`Authorization: Bearer ${SHIPPING_API_TOKEN}`);
  console.log(`Content-Type: application/json`);
  
  console.log('\n📱 أمر cURL للاختبار:');
  console.log(`curl -X POST "${SHIPPING_API_BASE}/orders" \\
  -H "Authorization: Bearer ${SHIPPING_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: TS0112bcbc=012c413b7e4d187d6f2e1f8bc1287d3e655e6cdec84913383d2cba6cb4d1c11ed48232825a682ef3ba3c990934c4c86387a55a66c7" \\
  -d '${JSON.stringify(shippingOrderData)}'`);
  
  console.log('\n🎯 النقاط المهمة:');
  console.log(`- اسم العميل: ${shippingOrderData.Consignee.Name}`);
  console.log(`- رقم الهاتف: ${shippingOrderData.Consignee.MobileNo}`);
  console.log(`- المحافظة (Area): ${shippingOrderData.Consignee.Area}`);
  console.log(`- المدينة (City): ${shippingOrderData.Consignee.City}`);
  console.log(`- المنطقة (Region): ${shippingOrderData.Consignee.Region}`);
  console.log(`- نوع الدفع: ${shippingOrderData.PaymentType}`);
  console.log(`- مبلغ الدفع عند الاستلام: ${shippingOrderData.CODAmount}`);
  console.log(`- المبلغ الإجمالي: ${shippingOrderData.TotalShipmentValue}`);
  console.log(`- رقم الطلب المرجعي: ${shippingOrderData.ClientOrderRef}`);
  
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
}; 

// تصدير دالة الاختبار للاستخدام الخارجي
export const printShippingTestData = printShippingDataForTesting; 

// 🧪 دالة لاستخراج وطباعة JSON الفعلي المرسل
export const getShippingRequestJSON = (orderData) => {
  try {
    // نفس المعالجة المستخدمة في createShippingOrder
    const customerPhone = orderData.client?.phone || orderData.customer_phone || '';
    
    let regionValue, addressLine1, addressLine2, zipCode, customerName, customerEmail;
    
    if (orderData.address) {
      regionValue = orderData.address.state || orderData.address.region || "Jabal Ali";
      addressLine1 = orderData.address.address_line1 || orderData.address.address || "AE HQ";
      addressLine2 = orderData.address.address_line2 || "Old Airport";
      zipCode = orderData.address.postal_code || "128";
      customerName = orderData.client?.name || orderData.customer_name || "Test Receiver";
      customerEmail = orderData.client?.email || orderData.customer_email || "receiver@email.com";
    } else if (orderData.shipping_address) {
      regionValue = orderData.shipping_address.state || orderData.shipping_address.region || "Jabal Ali";
      addressLine1 = orderData.shipping_address.address_line1 || "AE HQ";
      addressLine2 = orderData.shipping_address.address_line2 || "Old Airport";
      zipCode = orderData.shipping_address.postal_code || "128";
      customerName = orderData.customer_name || "Test Receiver";
      customerEmail = orderData.customer_email || "receiver@email.com";
    } else {
      regionValue = "Jabal Ali";
      addressLine1 = "AE HQ";
      addressLine2 = "Old Airport";
      zipCode = "128";
      customerName = orderData.customer_name || "Test Receiver";
      customerEmail = orderData.customer_email || "receiver@email.com";
    }

    const paymentType = orderData.payment_method === 'cash' ? 'COD' : 'PREPAID';
    const finalAmountRaw = orderData.final_amount || orderData.total_amount || 0;
    const finalAmount = typeof finalAmountRaw === 'string' 
      ? parseFloat(finalAmountRaw.replace(/[^\d.]/g, '')) 
      : parseFloat(finalAmountRaw) || 0;
    
    const shippingCostRaw = orderData.shipping_cost || orderData.shipping_fees || 0;
    const shippingCost = typeof shippingCostRaw === 'string'
      ? parseFloat(shippingCostRaw.replace(/[^\d.]/g, ''))
      : parseFloat(shippingCostRaw) || 0;
    
    const codAmount = paymentType === 'COD' ? finalAmount : 0;

    const consignee = {
      Name: customerName,
      CompanyName: "ASYAD Express",
      AddressLine1: addressLine1,
      AddressLine2: addressLine2,
      Area: "Muscat International Airport",
      City: regionValue,
      Region: regionValue,
      Country: "Oman",
      ZipCode: zipCode,
      MobileNo: customerPhone || "+962796246855",
      PhoneNo: "",
      Email: customerEmail,
      Latitude: "23.588797597",
      Longitude: "58.284848184",
      Instruction: orderData.notes || "Delivery Instructions",
      What3Words: "",
      NationalId: "",
      ReferenceNo: "",
      Vattaxcode: "",
      Eorinumber: ""
    };

    const packageDetails = orderData.items?.map((item, index) => ({
      Package_AWB: item.sku || `LUBAN_${item.id}_${index + 1}`,
      Weight: 0.1,
      Width: 10,
      Length: 15,
      Height: 20
    })) || [{
      Package_AWB: "LUBAN_TEST_1",
      Weight: 0.1,
      Width: 10,
      Length: 15,
      Height: 20
    }];

    const shippingOrderData = {
      ClientOrderRef: `LUBAN_${orderData.id || 'TEST'}_${Date.now()}`,
      Description: `طلب من لبان الغزال - ${orderData.items?.length || 1} منتج`,
      HandlingTypee: "Others",
      ShippingCost: shippingCost,
      PaymentType: paymentType,
      CODAmount: codAmount,
      ShipmentProduct: "EXPRESS",
      ShipmentService: "ALL_DAY",
      OrderType: "DROPOFF",
      PickupType: "",
      PickupDate: "",
      TotalShipmentValue: finalAmount,
      JourneyOptions: {
        AdditionalInfo: orderData.notes || "",
        NOReturn: false,
        Extra: {}
      },
      Consignee: consignee,
      Shipper: DEFAULT_SHIPPER_INFO,
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
  } catch (error) {
    console.error('خطأ في إنشاء JSON:', error);
    return null;
  }
};

// دالة لطباعة JSON للاختبار الخارجي
export const printExactShippingJSON = () => {
  // بيانات تجريبية مشابهة للطلب الحقيقي
  const testOrderData = {
    id: 72,
    client: {
      name: 'Abdelrahman Elsayed',
      phone: '+201288266400',
      email: 'abdelrahman@example.com'
    },
    address: {
      address_line1: 'ثبثبثبث',
      address_line2: 'بثب',
      city: 'fefefefefe',
      state: 'Jabal Ali',
      country: 'UAE',
      postal_code: '12345'
    },
    items: [
      {
        id: 15,
        name: '١١١١١',
        sku: 'PROD_15'
      }
    ],
    payment_method: 'cash',
    shipping_cost: 50,
    total_amount: 120,
    final_amount: 120,
    notes: 'طلب من موقع لبان الغزال'
  };

  const jsonData = getShippingRequestJSON(testOrderData);
  
  console.log('\n🚚 ═══════════════════════════════════════════════════════════════════════════════');
  console.log('📋 JSON الفعلي المرسل للاختبار الخارجي');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(JSON.stringify(jsonData, null, 2));
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  
  console.log('\n📱 أمر cURL للاختبار:');
  console.log(`curl -X POST "/shipping-api/orders" \\
  -H "Authorization: Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: TS0112bcbc=012c413b7e4d187d6f2e1f8bc1287d3e655e6cdec84913383d2cba6cb4d1c11ed48232825a682ef3ba3c990934c4c86387a55a66c7" \\
  -d '${JSON.stringify(jsonData)}'`);
  
  return jsonData;
}; 