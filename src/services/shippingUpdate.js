// 📦 خدمة تحديث بيانات الشحن - Update Shipping API Service

const SHIPPING_UPDATE_API_BASE = 'https://app.quickly.codes/luban-elgazal/public/api';
const SHIPPING_UPDATE_ENDPOINT = '/external-order/update-shipping';

/**
 * 📝 تحديث بيانات الشحن لطلب موجود
 * @param {string} orderNumber - رقم الطلب (مطلوب)
 * @param {Object} shippingData - بيانات الشحن للتحديث
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const updateShippingData = async (orderNumber, shippingData) => {
  try {
    console.log('\n🔄 =================================================');
    console.log('📝 STARTING SHIPPING DATA UPDATE');
    console.log('🔄 =================================================');
    console.log('📋 Order Number:', orderNumber);
    console.log('📦 Update Data:', JSON.stringify(shippingData, null, 2));
    console.log('🎯 Target Endpoint:', `${SHIPPING_UPDATE_API_BASE}${SHIPPING_UPDATE_ENDPOINT}`);
    console.log('🔄 =================================================\n');

    // التحقق من وجود رقم الطلب
    if (!orderNumber) {
      throw new Error('order_number مطلوب');
    }

    // 🎯 تحضير البيانات بالشكل المطلوب تماماً
    const updatePayload = {
      order_number: orderNumber,
      ...shippingData
    };

    console.log('📤 Final Payload (matching curl command):');
    console.log(JSON.stringify(updatePayload, null, 2));

    // 🔐 الحصول على token من localStorage أو من المتغيرات العامة
    const token = localStorage.getItem('token') || 
                  sessionStorage.getItem('token') || 
                  '318|8ZrKrDJ5rTan8O8WjzQMaZDlVU3VtrP36PbHvLZV696023bc'; // fallback token

    console.log('🚀 Sending update request to:', `${SHIPPING_UPDATE_API_BASE}${SHIPPING_UPDATE_ENDPOINT}`);
    console.log('🔐 Using token:', token ? 'Token found ✅' : 'No token ❌');

    // إرسال طلب التحديث
    const response = await fetch(`${SHIPPING_UPDATE_API_BASE}${SHIPPING_UPDATE_ENDPOINT}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    console.log('📡 Update Response Status:', response.status);
    console.log('📡 Update Response Headers:', Object.fromEntries(response.headers.entries()));

    // قراءة الاستجابة
    const responseText = await response.text();
    console.log('📡 Raw Update Response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse update response:', parseError);
      throw new Error(`فشل في تحليل استجابة API التحديث: ${responseText}`);
    }

    console.log('📡 Parsed Update Response:', JSON.stringify(responseData, null, 2));

    // معالجة النجاح
    if (response.ok && responseData.success) {
      console.log('\n✅ =================================================');
      console.log('🎉 SHIPPING DATA UPDATED SUCCESSFULLY');
      console.log('✅ =================================================');
      console.log('📋 Updated Order ID:', responseData.data?.order_id);
      console.log('📋 Order Number:', responseData.data?.order_number);
      console.log('📦 Updated Fields:', responseData.updated_fields);
      console.log('📝 Update Message:', responseData.message);
      
      if (responseData.data?.external_awb_number) {
        console.log('🏷️ External AWB:', responseData.data.external_awb_number);
      }
      if (responseData.data?.consignment_number) {
        console.log('🚛 Consignment Number:', responseData.data.consignment_number);
      }
      if (responseData.data?.shipped_at) {
        console.log('📅 Shipped At:', responseData.data.shipped_at);
      }
      console.log('✅ =================================================\n');

      return {
        success: true,
        data: responseData.data,
        updated_fields: responseData.updated_fields,
        message: responseData.message
      };
    }

    // معالجة الأخطاء
    console.log('\n❌ =================================================');
    console.log('💥 SHIPPING UPDATE FAILED');
    console.log('❌ =================================================');
    console.log('📈 HTTP Status:', response.status);
    console.log('📝 Error Message:', responseData.message || 'Unknown error');
    
    if (response.status === 404) {
      console.log('🔍 Order not found:', orderNumber);
    } else if (response.status === 400) {
      console.log('⚠️ Bad request - check data format');
    }
    
    console.log('❌ Full Error Response:', JSON.stringify(responseData, null, 2));
    console.log('❌ =================================================\n');

    throw new Error(`فشل تحديث بيانات الشحن: ${responseData.message || 'خطأ غير معروف'}`);

  } catch (error) {
    console.error('\n💥 Update shipping data error:', error.message);
    throw error;
  }
};

/**
 * 🔄 تحديث بيانات الشحن باستخدام معاملات نجاح الشحن
 * @param {string} orderNumber - رقم الطلب
 * @param {Object} shippingParameters - المعاملات المُستخرجة من نجاح الشحن
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const updateFromShippingSuccess = async (orderNumber, shippingParameters) => {
  try {
    // 🎯 تحضير البيانات بالشكل المطلوب بالضبط (حسب curl command)
    const updateData = {
      order_number: orderNumber, // "ORD-20250728-043"
      external_awb_number: shippingParameters.order_awb_number, // "LUBNGZ0005555"
      consignment_number: shippingParameters.consignment_number, // "P005000000"
      external_reference_id: shippingParameters.reference_id || shippingParameters.ClientOrderRef // "REF-MEDIUM-2025"
    };

    // إزالة القيم الفارغة
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key];
      }
    });

    console.log('\n📋 =================================================');
    console.log('🔄 AUTO-UPDATE FROM SHIPPING SUCCESS');
    console.log('📋 =================================================');
    console.log('📋 Order Number:', orderNumber);
    console.log('📦 Source: Shipping API Success Response');
    console.log('📝 Timing: After basic order update');
    console.log('🎯 Purpose: Add detailed shipping info to database');
    console.log('📦 Extracted Parameters:', JSON.stringify(shippingParameters, null, 2));
    console.log('🎯 Mapping for Update API:');
    console.log('  📋 order_number:', updateData.order_number);
    console.log('  📦 external_awb_number:', updateData.external_awb_number);
    console.log('  🚛 consignment_number:', updateData.consignment_number);
    console.log('  🔗 external_reference_id:', updateData.external_reference_id);
    console.log('📝 Final Update Payload (matching curl):', JSON.stringify(updateData, null, 2));
    console.log('📋 =================================================\n');

    // 🧪 اختبار الـ payload قبل الإرسال للتأكد
    testUpdatePayload(orderNumber, shippingParameters);

    return await updateShippingData(orderNumber, updateData);

  } catch (error) {
    console.error('❌ Auto-update from shipping success failed:', error.message);
    throw error;
  }
};

/**
 * 📝 تحديث بيانات شحن مبسطة (AWB فقط)
 * @param {string} orderNumber - رقم الطلب
 * @param {string} awbNumber - رقم الشحنة
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const updateSimpleAWB = async (orderNumber, awbNumber) => {
  return await updateShippingData(orderNumber, {
    external_awb_number: awbNumber
  });
};

/**
 * 📝 تحديث بيانات شحن كاملة
 * @param {string} orderNumber - رقم الطلب  
 * @param {Object} fullShippingData - جميع بيانات الشحن
 * @returns {Promise<Object>} نتيجة التحديث
 */
export const updateFullShippingData = async (orderNumber, fullShippingData) => {
  const {
    clientOrderRef,
    orderAwbNumber,
    consignmentNumber,
    referenceId,
    itemAwbNumber,
    requestId,
    shippingDetails
  } = fullShippingData;

  return await updateShippingData(orderNumber, {
    client_order_ref: clientOrderRef,
    external_awb_number: orderAwbNumber,
    consignment_number: consignmentNumber,
    external_reference_id: referenceId,
    external_item_awb_number: itemAwbNumber,
    external_request_id: requestId,
    external_shipping_details: shippingDetails
  });
};

/**
 * 🧪 اختبار الـ payload قبل الإرسال (للتأكد من التطابق مع curl command)
 * @param {string} orderNumber - رقم الطلب
 * @param {Object} shippingParameters - معاملات الشحن
 */
export const testUpdatePayload = (orderNumber, shippingParameters) => {
  console.log('\n🧪 =================================================');
  console.log('📋 TESTING UPDATE PAYLOAD STRUCTURE');
  console.log('🧪 =================================================');
  
  const updateData = {
    order_number: orderNumber,
    external_awb_number: shippingParameters.order_awb_number,
    consignment_number: shippingParameters.consignment_number,
    external_reference_id: shippingParameters.reference_id || shippingParameters.ClientOrderRef
  };
  
  console.log('🎯 Expected curl command format:');
  console.log(`curl --location --request PUT 'https://app.quickly.codes/luban-elgazal/public/api/external-order/update-shipping' \\`);
  console.log(`--header 'Authorization: Bearer YOUR_TOKEN' \\`);
  console.log(`--header 'Content-Type: application/json' \\`);
  console.log(`--data '${JSON.stringify(updateData, null, 2)}'`);
  
  console.log('\n📦 Generated Payload:');
  console.log(JSON.stringify(updateData, null, 2));
  
  console.log('\n🔍 Payload Verification:');
  console.log('✅ order_number:', updateData.order_number ? '✓' : '❌');
  console.log('✅ external_awb_number:', updateData.external_awb_number ? '✓' : '❌');
  console.log('✅ consignment_number:', updateData.consignment_number ? '✓' : '❌');
  console.log('✅ external_reference_id:', updateData.external_reference_id ? '✓' : '❌');
  
  console.log('🧪 =================================================\n');
  
  return updateData;
};

export default {
  updateShippingData,
  updateFromShippingSuccess,
  updateSimpleAWB,
  updateFullShippingData
}; 