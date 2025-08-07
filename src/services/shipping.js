// 🚚 خدمة شركة الشحن - Laravel Backend Proxy API
const SHIPPING_API_BASE = 'https://app.quickly.codes/luban-elgazal/public/api';
const SHIPPING_ENDPOINT = '/external-order';

// إزالة الـ token لأن الباك إند يتولاه
// const SHIPPING_API_TOKEN = 'FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1'; // لم تعد مطلوبة

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

  // ⚠️ TEMPORARY: تجاهل التحقق من الهاتف لأننا نستخدم رقم ثابت
  const TEMP_TEST_PHONE = "+968 91234567";
  // console.log('🔧 Validation: Using fixed phone for testing:', TEMP_TEST_PHONE);
  
  // تم تعطيل التحقق من رقم الهاتف مؤقتاً
  // const customerPhone = orderData.customer_phone || orderData.client?.phone;
  // if (!customerPhone || customerPhone.trim() === '') {
  //   errors.push('رقم هاتف العميل مطلوب');
  // }

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
    // console.log('\n🎯 =================================================');
    // console.log('⚠️  TESTING MODE: FIXED PHONE +968 91234567 ⚠️ ');
    // console.log('🚀 STARTING SHIPPING ORDER CREATION');
    // console.log('🎯 =================================================');
    // console.log('📥 Input Order Data:', JSON.stringify(orderData, null, 2));
    // console.log('🎯 =================================================\n');

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

    // إنشاء رقم مرجعي للطلب باستخدام رقم الطلب الحقيقي
    const getOrderReference = () => {
      if (orderData.order_number) {
        // إزالة "ORD-" من رقم الطلب: ORD-20250728-348 => 20250728-348
        return orderData.order_number.replace(/^ORD-/, '');
      }
      // fallback للطريقة القديمة
      return `LUBAN_${orderData.id}_${Date.now()}`;
    };
    const clientOrderRef = getOrderReference();

    // ⚠️ TEMPORARY: رقم هاتف ثابت للاختبار
    const TEMP_TEST_PHONE = "+968 91234567";
    
    // استخدام رقم الهاتف من checkout أولاً، ثم البيانات المحفوظة  
    const checkoutPhone = orderData.customer_phone;
    const savedPhone = orderData.client?.phone;
    const dynamicPhone = checkoutPhone || savedPhone || '';
    
    // استخدام الرقم الثابت مؤقتاً
    const customerPhone = TEMP_TEST_PHONE;
    
    // console.log('📱 Phone Number Source Analysis (TESTING MODE):');
    // console.log('  🔧 TEMP FIXED PHONE:', TEMP_TEST_PHONE);
    // console.log('  Checkout Phone:', checkoutPhone);
    // console.log('  Saved User Phone:', savedPhone);
    // console.log('  Dynamic Phone (ignored):', dynamicPhone);
    // console.log('  🚀 USING FIXED PHONE FOR TESTING');
    


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

    // تحضير التاريخ (غداً) بالتنسيق المطلوب YYYY/MM/DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '/'); // YYYY/MM/DD format

    // تحضير بيانات طلب الشحن - تطابق المثال بالضبط
    const shippingOrderData = {
      ClientOrderRef: clientOrderRef, // استخدام رقم الطلب الحقيقي بدون ORD-
      Description: `طلب من لبان الغزال - ${orderData.items?.length || 1} منتج`,
      HandlingTypee: "Others", // تطابق المثال
      ShippingCost: shippingCost,
      PaymentType: paymentType,
      CODAmount: codAmount,
      ShipmentProduct: "EXPRESS", // تطابق المثال
      ShipmentService: "ALL_DAY", // تطابق المثال
      OrderType: "DROPOFF", // تطابق المثال
      PickupType: "SAMEDAY", // تغيير نوع الاستلام
      PickupDate: pickupDate, // تاريخ الغد بتنسيق YYYY/MM/DD
      TotalShipmentValue: finalAmount,
      JourneyOptions: {
        AdditionalInfo: "", // تفريغ الحقل لتجنب خطأ شركة الشحن
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

    // 🧪 طباعة البيانات بتنسيق جاهز للاختبار
    // console.log('📦 Shipping Order Data to be sent:', JSON.stringify(shippingOrderData, null, 2));
    // console.log('📱 Formatted Phone Number:', shippingOrderData.Consignee.MobileNo);
    // console.log('📅 Pickup Date:', shippingOrderData.PickupDate, '(Tomorrow - YYYY/MM/DD)');
    // console.log('🚛 Pickup Type:', shippingOrderData.PickupType, '(SAMEDAY)');
    // console.log('📝 Additional Info:', shippingOrderData.JourneyOptions.AdditionalInfo || '(Empty - Fixed)');
    // console.log('📋 Client Order Ref:', shippingOrderData.ClientOrderRef, '(Real Order Number)');
    // console.log('📋 Original Order Number:', orderData.order_number || 'N/A');
    printShippingDataForTesting(shippingOrderData);

    // إرسال الطلب مع إعادة المحاولة إلى Laravel Backend
    // console.log('🚀 Sending request to:', `${SHIPPING_API_BASE}${SHIPPING_ENDPOINT}`);
    // console.log('📤 Request payload size:', JSON.stringify(shippingOrderData).length, 'characters');
    
    const response = await retryWithDelay(async () => {
      return await fetch(`${SHIPPING_API_BASE}${SHIPPING_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // لا حاجة للـ Authorization لأن الباك إند يتولى المصادقة مع ASYAD
        },
        body: JSON.stringify(shippingOrderData)
      });
    }, 3, 2000);

    // معالجة استجابة Laravel Backend API
    // console.log('📡 Response Status:', response.status);
    // console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    // console.log('📡 Raw Response Text:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      // console.log('📡 Parsed Response Data:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      // console.error('❌ JSON Parse Error:', parseError);
      // console.error('❌ Raw Response Text:', responseText);
      throw new Error(`استجابة غير صالحة من الخادم: ${responseText}`);
    }
  
    
    // معالجة الأخطاء من Laravel Backend
    if (!response.ok || !responseData.success) {
      console.error('❌ Shipping request failed!');
      console.error('❌ HTTP Status:', response.status);
      console.error('❌ Response Success:', responseData.success);
      console.error('❌ External API Status:', responseData.external_api_status);
      console.error('❌ Full Error Response:', JSON.stringify(responseData, null, 2));
      
      // Handle specific city validation errors from external API
      if (responseData.external_api_status === 400) {
        const externalResponse = responseData.external_api_response;
        console.error('❌ 400 Error - External Response:', JSON.stringify(externalResponse, null, 2));
        
        if (externalResponse?.data?.errors?.general?.City) {
          const cityError = externalResponse.data.errors.general.City[0];
          if (cityError.includes('IS Not Supported For Integration')) {
            throw new Error(`المحافظة "${regionName}" غير مدعومة من خدمة الشحن ASYAD Express. المحافظات المدعومة: ${getSupportedCities().join(', ')}`);
          }
        }
        
        // Handle other validation errors
        if (externalResponse?.data?.errors) {
          console.error('❌ Validation errors:', externalResponse.data.errors);
        }
      }
      
      // Handle duplicate order error
      if (responseData.external_api_status === 302) {
        const existingAWB = responseData.external_api_response?.data?.order_awb_number;
        throw new Error(`هذا الطلب موجود مسبقاً برقم تتبع: ${existingAWB}`);
      }
      
      // General error handling
      const errorMessage = responseData.error || responseData.message || 'فشل في إنشاء طلب الشحن';
      throw new Error(`فشل في إنشاء طلب الشحن: ${errorMessage}`);
    }

    // معالجة الاستجابة الناجحة من Laravel Backend
    if (responseData.success && responseData.data) {
    
      
      // استخراج البيانات المهمة من Laravel Backend response
      const externalData = responseData.data.data; // البيانات من ASYAD API
      const orderDetails = externalData.details || {}; // تفاصيل الطلب
      
      // جميع المعاملات المهمة من الاستجابة
      const shippingParameters = {
        // إضافة id الطلب الأصلي
        order_id: orderData.id,
        
        // من المستوى الأول
        ClientOrderRef: externalData.ClientOrderRef,
        order_awb_number: externalData.order_awb_number,
        
        // من تفاصيل الطلب
        type_of_order: orderDetails.type_of_order,
        order_number: orderDetails.order_number,
        Total_Number_of_Packages_in_Shipment: orderDetails.Total_Number_of_Packages_in_Shipment,
        consignment_number: orderDetails.consignment_number,
        item_awb_number: orderDetails.item_awb_number,
        reference_id: orderDetails.reference_id,
        
        // من Laravel Backend
        request_id: responseData.data.request_id,
        external_api_status: responseData.external_api_status
      };
      
      // طباعة جميع المعاملات للمطور
      // console.log('\n🎯 =================================================');
      // console.log('✅ SHIPPING SUCCESS - ALL PARAMETERS EXTRACTED');
      // console.log('🎯 =================================================');
      // console.log('📋 Client Order Ref:', shippingParameters.ClientOrderRef);
      // console.log('📦 Order AWB Number:', shippingParameters.order_awb_number);
      // console.log('🚛 Consignment Number:', shippingParameters.consignment_number);
      // console.log('📋 Reference ID:', shippingParameters.reference_id);
      // console.log('📦 Item AWB Number:', shippingParameters.item_awb_number);
      // console.log('🔄 Type of Order:', shippingParameters.type_of_order);
      // console.log('📊 Total Packages:', shippingParameters.Total_Number_of_Packages_in_Shipment);
      // console.log('🆔 Request ID:', shippingParameters.request_id);
      // console.log('📈 External API Status:', shippingParameters.external_api_status);
      // console.log('🎯 =================================================');
      // console.log('📝 FOR API USE - Copy these parameters:');
      // console.log(JSON.stringify(shippingParameters, null, 2));
      // console.log('🎯 =================================================\n');
      
      const shippingResult = {
        success: true,
        // جميع المعاملات مُضمنة
        ...shippingParameters,
        
        // معلومات إضافية
        originalOrderId: orderData.id, // إضافة id الطلب الأصلي
        pickupDate: externalData.pickup_date,
        estimatedDelivery: externalData.estimated_delivery,
        status: 'created',
        createdAt: new Date().toISOString(),
        message: responseData.message,
        fullResponse: responseData,
        
        // نسخة منفصلة للمعاملات المهمة للـ API
        apiParameters: shippingParameters
      };

      // تحضير المعاملات للـ API التالي وإرسالها لتحديث قاعدة البيانات
      await prepareForNextAPI(shippingResult);
      
      return shippingResult;
    } else {
      throw new Error(`فشل في إنشاء طلب الشحن: ${responseData.message || 'استجابة غير متوقعة'}`);
    }

  } catch (error) {

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
  

    // استخدام Laravel Backend للتتبع (إذا كان متوفر)
    // يمكن إضافة endpoint للتتبع لاحقاً في Laravel backend
    // console.log(`🔍 تتبع الطلب: ${trackingNumber}`);
    // console.log('ملاحظة: دالة التتبع تحتاج تحديث لاستخدام Laravel Backend');
    
    // مؤقتاً، إرجاع بيانات وهمية للتتبع
    return {
      success: true,
      trackingNumber: trackingNumber,
      status: 'قيد المعالجة',
      message: 'دالة التتبع تحتاج تطوير في Laravel Backend',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // TODO: تنفيذ Laravel Backend endpoint للتتبع
    /*
    const response = await fetch(`${SHIPPING_API_BASE}/track/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();
    
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
    */

  } catch (error) {
   
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


    const updatePayload = {
      shipping_reference: shippingData.clientOrderRef || shippingData.ClientOrderRef,
      tracking_number: shippingData.orderAwbNumber || shippingData.order_awb_number,
      consignment_number: shippingData.consignmentNumber || shippingData.consignment_number,
      shipping_request_id: shippingData.requestId || shippingData.request_id,
      shipping_status: shippingData.status || 'created',
      shipping_created_at: shippingData.createdAt
    };

    // console.log('📝 Updating order with basic shipping info...');
    // console.log('📋 Order ID:', orderId);
    // console.log('📦 Update Payload:', updatePayload);

    const response = await fetch(`https://app.quickly.codes/luban-elgazal/public/api/orders/${orderId}/shipping`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    });

    const responseData = await response.json();
    // console.log('📡 Order Update Response:', responseData);
   

    if (!response.ok) {
      throw new Error(`فشل في تحديث الطلب: ${responseData.message || 'خطأ غير معروف'}`);
    }

    return responseData;

  } catch (error) {
   
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


    // 1. إنشاء طلب الشحن
    const shippingResult = await createShippingOrder(orderData);

    // 2. تحديث الطلب في قاعدة البيانات (API قديم)
    const updateResult = await updateOrderWithShippingInfo(
      orderData.id,
      shippingResult,
      token
    );

    // 3. 🔄 تحديث بيانات الشحن في قاعدة البيانات تلقائياً (API جديد)
    let databaseUpdateResult = null;
    try {
      const { updateFromShippingSuccess } = await import('./shippingUpdate.js');
      
      // البحث عن order_number من updateResult أو من الطلب الأصلي
      const orderNumber = updateResult?.order_number || orderData.order_number;
      
      if (orderNumber && shippingResult.apiParameters) {
        // console.log('\n🔄 Attempting auto-update of shipping data after order update...');
        // console.log('📋 Using order number:', orderNumber);
        
        databaseUpdateResult = await updateFromShippingSuccess(orderNumber, shippingResult.apiParameters);
        
        // console.log('✅ Database updated successfully with detailed shipping data');
      } else {
        // console.log('⚠️ Skipping auto-update: missing order_number or parameters');
        // console.log('  Order Number:', orderNumber);
        // console.log('  Has Parameters:', !!shippingResult.apiParameters);
      }
    } catch (updateError) {
      // console.error('❌ Failed to auto-update detailed shipping data:', updateError.message);
      // لا نتوقف هنا، فالشحن نجح والتحديث فقط فشل
      databaseUpdateResult = {
        success: false,
        error: updateError.message
      };
    }

    return {
      success: true,
      shipping: shippingResult,
      orderUpdate: updateResult,
      databaseUpdate: databaseUpdateResult,
      trackingNumber: shippingResult.orderAwbNumber || shippingResult.order_awb_number,
      shippingReference: shippingResult.clientOrderRef || shippingResult.ClientOrderRef,
      consignmentNumber: shippingResult.consignmentNumber || shippingResult.consignment_number,
      message: 'تم إنشاء طلب الشحن بنجاح'
    };

  } catch (error) {
 
    
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
    'JABAL AL I',
    'JEBEL AL I', 
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
  console.log('\n📋 =================================================');
  console.log('🔧 TESTING MODE: USING FIXED PHONE NUMBER');
  console.log('🌟 SHIPPING API JSON REQUEST DATA');
  console.log('📋 =================================================');
  console.log('\n📦 Full JSON Object:');
  console.log(JSON.stringify(shippingOrderData, null, 2));
  console.log('\n📋 =================================================');
  console.log('🔍 DETAILED BREAKDOWN:');
  console.log('📋 =================================================');
  console.log('\n👤 Customer Info:');
  console.log('  Name:', shippingOrderData.Consignee?.PersonName);
  console.log('  Phone:', shippingOrderData.Consignee?.MobileNo, '🔧 (FIXED FOR TESTING)');
  console.log('  Email:', shippingOrderData.Consignee?.EmailId);
  console.log('\n📍 Address Info:');
  console.log('  Address Line 1:', shippingOrderData.Consignee?.Address1);
  console.log('  Address Line 2:', shippingOrderData.Consignee?.Address2);
  console.log('  City:', shippingOrderData.Consignee?.City);
  console.log('  Country:', shippingOrderData.Consignee?.CountryCode);
  console.log('\n💰 Payment Info:');
  console.log('  Payment Type:', shippingOrderData.PaymentType);
  console.log('  COD Amount:', shippingOrderData.CodAmount);
  console.log('\n📦 Package Info:');
  console.log('  Total Weight:', shippingOrderData.TotalWeight);
  console.log('  Number of Pieces:', shippingOrderData.NoofPieces);
  console.log('  Package Details:', shippingOrderData.PackageDetails?.length, 'items');
  console.log('\n🚛 Pickup Info:');
  console.log('  Pickup Type:', shippingOrderData.PickupType, '(SAMEDAY)');
  console.log('  Pickup Date:', shippingOrderData.PickupDate, '(Tomorrow - YYYY/MM/DD)');
  console.log('\n📝 Journey Options:');
  console.log('  Additional Info:', shippingOrderData.JourneyOptions?.AdditionalInfo || '(Empty - Fixed for API)');
  console.log('  No Return:', shippingOrderData.JourneyOptions?.NOReturn);
  console.log('\n📋 Order Reference:');
  console.log('  Client Order Ref:', shippingOrderData.ClientOrderRef, '(Without ORD- prefix)');
  console.log('\n📋 =================================================\n');
}; 

// تصدير دالة الاختبار للاستخدام الخارجي
export const printShippingTestData = printShippingDataForTesting;

// 📋 دالة لاستخراج وحفظ معاملات الشحن للـ API التالي
export const extractShippingParameters = (shippingResponse) => {
  if (!shippingResponse || !shippingResponse.success) {
    return null;
  }
  
  return shippingResponse.apiParameters || {
    order_id: shippingResponse.originalOrderId || 'غير محدد',
    ClientOrderRef: shippingResponse.ClientOrderRef,
    order_awb_number: shippingResponse.order_awb_number,
    type_of_order: shippingResponse.type_of_order,
    order_number: shippingResponse.order_number,
    Total_Number_of_Packages_in_Shipment: shippingResponse.Total_Number_of_Packages_in_Shipment,
    consignment_number: shippingResponse.consignment_number,
    item_awb_number: shippingResponse.item_awb_number,
    reference_id: shippingResponse.reference_id,
    request_id: shippingResponse.request_id,
    external_api_status: shippingResponse.external_api_status
  };
};

// 📤 دالة مساعدة لتحضير البيانات للـ API التالي
// 📤 دالة لإرسال بيانات الطلب لتحديث قاعدة البيانات
const updateOrderData = async (parameters) => {
  try {
    const BASE_URL = "https://app.quickly.codes/luban-elgazal/public/api";
    
    // console.log('\n🔄 =================================================');
    // console.log('📤 إرسال البيانات لتحديث قاعدة البيانات...');
    // console.log('🔄 =================================================');
    
    const response = await fetch(`${BASE_URL}/external-order/update-order-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(parameters)
    });

    const result = await response.json();
    
    if (result.success) {
      // console.log('✅ تم تحديث بيانات الطلب بنجاح');
      // console.log('📋 البيانات المحدثة:', JSON.stringify(result.data, null, 2));
      // console.log('🔧 الحقول المحدثة:', result.updated_fields);
      return result;
    } else {
      // console.error('❌ فشل في تحديث بيانات الطلب:', result.message);
      if (result.errors) {
        // console.error('📋 أخطاء التحقق:', result.errors);
      }
      return { success: false, error: result.message };
    }
  } catch (error) {
    // console.error('❌ خطأ في الشبكة أثناء تحديث بيانات الطلب:', error.message);
    return { success: false, error: error.message };
  }
};

export const prepareForNextAPI = async (shippingResponse) => {
  const parameters = extractShippingParameters(shippingResponse);
  
  if (!parameters) {
    // console.error('❌ No shipping parameters found');
    return null;
  }
  
  // console.log('\n📤 =================================================');
  // console.log('🚀 READY FOR NEXT API CALL');
  // console.log('📤 =================================================');
  // console.log('📋 Parameters ready to send:');
  // console.log(JSON.stringify(parameters, null, 2));
  
  // إرسال البيانات لتحديث قاعدة البيانات
  const updateResult = await updateOrderData(parameters);
  
  // عرض حالة التحديث إذا كانت متوفرة (من processShippingOrder)
  if (shippingResponse.databaseUpdate) {
    // console.log('\n🔄 Database Update Status:');
    if (shippingResponse.databaseUpdate.success) {
      // console.log('✅ Database updated successfully');
      // console.log('📦 Updated fields:', shippingResponse.databaseUpdate.updated_fields);
    } else {
      // console.log('❌ Database update failed:', shippingResponse.databaseUpdate.error);
    }
  } else {
    // console.log('\n📋 Previous Database Update: Will be handled by processShippingOrder');
  }
  
  // console.log('📤 =================================================\n');
  
  return {
    parameters,
    updateResult
  };
}; 

// 🧪 دالة لاستخراج وطباعة JSON الفعلي المرسل
export const getShippingRequestJSON = (orderData) => {
  try {
    // نفس المعالجة المستخدمة في createShippingOrder
    // ⚠️ TEMPORARY: رقم هاتف ثابت للاختبار
    const TEMP_TEST_PHONE = "+968 91234567";
    const customerPhone = TEMP_TEST_PHONE;
    
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

    // تحضير التاريخ (غداً كحد أدنى) بالتنسيق المطلوب YYYY/MM/DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '/'); // YYYY/MM/DD format

    // تنسيق رقم الهاتف للتنسيق الدولي المطلوب
    const formatPhoneNumber = (phone) => {
      if (!phone) return "+968123456789"; // رقم افتراضي
      
      // إزالة جميع الرموز والمسافات
      let cleanPhone = phone.replace(/[^\d+]/g, '');
      
      // إذا بدأ بـ +968 أو 00968، استخدمه كما هو
      if (cleanPhone.startsWith('+968') || cleanPhone.startsWith('00968')) {
        return cleanPhone;
      }
      
      // إذا بدأ بـ 968، أضف +
      if (cleanPhone.startsWith('968')) {
        return '+' + cleanPhone;
      }
      
      // إذا كان رقم محلي، أضف كود عمان
      if (cleanPhone.length === 8) {
        return '+968' + cleanPhone;
      }
      
      // افتراضي للحالات الأخرى
      return '+968' + cleanPhone.substring(cleanPhone.length - 8);
    };

    // نفس منطق إنشاء رقم الطلب المرجعي
    const getOrderReference = () => {
      if (orderData.order_number) {
        // إزالة "ORD-" من رقم الطلب: ORD-20250728-348 => 20250728-348
        return orderData.order_number.replace(/^ORD-/, '');
      }
      // fallback للطريقة القديمة
      return `LUBAN_${orderData.id || 'TEST'}_${Date.now()}`;
    };

    const shippingOrderData = {
      ClientOrderRef: getOrderReference(),
      Description: `طلب من لبان الغزال - ${orderData.items?.length || 1} منتج`,
      HandlingTypee: "Others",
      ShippingCost: shippingCost,
      PaymentType: paymentType,
      CODAmount: codAmount,
      ShipmentProduct: "EXPRESS",
      ShipmentService: "ALL_DAY",
      OrderType: "DROPOFF",
      PickupType: "SAMEDAY", // تغيير نوع الاستلام
      PickupDate: pickupDate, // تاريخ الغد
      TotalShipmentValue: finalAmount,
      JourneyOptions: {
        AdditionalInfo: "", // تفريغ الحقل لتجنب خطأ شركة الشحن
        NOReturn: false,
        Extra: {}
      },
      Consignee: {
        ...consignee,
        MobileNo: formatPhoneNumber(consignee.MobileNo) // تنسيق رقم الهاتف
      },
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

  
  return jsonData;
}; 