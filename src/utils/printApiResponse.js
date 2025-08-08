// 🖨️ دالة لطباعة استجابة API الخاص بـ external-order
// يمكن استخدامها لطباعة الـ response بشكل منظم ومفصل

/**
 * طباعة استجابة API بشكل منظم
 * @param {Object} response - استجابة API
 * @param {string} apiName - اسم API (اختياري)
 */
export const printApiResponse = (response, apiName = 'External Order API') => {
  console.log('\n🎯 ================================================');
  console.log(`📡 ${apiName} RESPONSE`);
  console.log('🎯 ================================================');
  
  // طباعة الاستجابة الكاملة
  console.log('📋 Full Response:');
  console.log(JSON.stringify(response, null, 2));
  
  console.log('\n📊 Response Analysis:');
  console.log('✅ Success:', response.success || false);
  console.log('📝 Message:', response.message || 'No message');
  console.log('🔢 Status Code:', response.status || response.external_api_status || 'Unknown');
  
  // إذا كان هناك data
  if (response.data) {
    console.log('\n📦 Data Section:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // إذا كان هناك بيانات شحن
    if (response.data.data) {
      const shippingData = response.data.data;
      console.log('\n🚛 Shipping Details:');
      console.log('📋 Client Order Ref:', shippingData.ClientOrderRef || 'N/A');
      console.log('📦 Order AWB Number:', shippingData.order_awb_number || 'N/A');
      console.log('📅 Pickup Date:', shippingData.pickup_date || 'N/A');
      console.log('📅 Estimated Delivery:', shippingData.estimated_delivery || 'N/A');
      
      // تفاصيل الطلب
      if (shippingData.details) {
        console.log('\n📋 Order Details:');
        console.log('🚛 Consignment Number:', shippingData.details.consignment_number || 'N/A');
        console.log('📦 Item AWB Number:', shippingData.details.item_awb_number || 'N/A');
        console.log('🆔 Reference ID:', shippingData.details.reference_id || 'N/A');
        console.log('📊 Total Packages:', shippingData.details.Total_Number_of_Packages_in_Shipment || 'N/A');
        console.log('🔄 Order Type:', shippingData.details.type_of_order || 'N/A');
      }
    }
  }
  
  // إذا كان هناك أخطاء
  if (response.error || response.errors) {
    console.log('\n❌ Errors:');
    console.log(JSON.stringify(response.error || response.errors, null, 2));
  }
  
  // إذا كان هناك استجابة من API الخارجي
  if (response.external_api_response) {
    console.log('\n🌐 External API Response:');
    console.log(JSON.stringify(response.external_api_response, null, 2));
  }
  
  console.log('\n🎯 ================================================');
  console.log(`📡 END OF ${apiName.toUpperCase()} RESPONSE`);
  console.log('🎯 ================================================\n');
};

/**
 * طباعة استجابة API مع تفاصيل إضافية للتطوير
 * @param {Object} response - استجابة API
 * @param {Object} requestData - البيانات المرسلة (اختياري)
 */
export const printDetailedApiResponse = (response, requestData = null) => {
  console.log('\n🔍 ================================================');
  console.log('📡 DETAILED API RESPONSE ANALYSIS');
  console.log('🔍 ================================================');
  
  // طباعة البيانات المرسلة إذا توفرت
  if (requestData) {
    console.log('\n📤 Request Data Sent:');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('\n' + '─'.repeat(50));
  }
  
  // طباعة الاستجابة
  printApiResponse(response, 'External Order API');
  
  // تحليل إضافي
  console.log('🔍 Additional Analysis:');
  console.log('📊 Response Type:', typeof response);
  console.log('📏 Response Size:', JSON.stringify(response).length, 'characters');
  console.log('🔑 Response Keys:', Object.keys(response).join(', '));
  
  // فحص البنية
  if (response.data && response.data.data) {
    console.log('✅ Has nested data structure');
    console.log('🔑 Nested Data Keys:', Object.keys(response.data.data).join(', '));
  }
  
  console.log('\n🔍 ================================================');
  console.log('📡 END OF DETAILED ANALYSIS');
  console.log('🔍 ================================================\n');
};

/**
 * طباعة استجابة مبسطة للاختبار السريع
 * @param {Object} response - استجابة API
 */
export const printSimpleResponse = (response) => {
  console.log('\n🚀 Quick Response Check:');
  console.log('✅ Success:', response.success ? '✓' : '✗');
  console.log('📝 Message:', response.message || 'No message');
  
  if (response.data?.data?.order_awb_number) {
    console.log('📦 AWB Number:', response.data.data.order_awb_number);
  }
  
  if (response.error) {
    console.log('❌ Error:', response.error);
  }
  
  console.log('🚀 End Quick Check\n');
};

// تصدير جميع الدوال
export default {
  printApiResponse,
  printDetailedApiResponse,
  printSimpleResponse
};
