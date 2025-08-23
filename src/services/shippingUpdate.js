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
  

    // التحقق من وجود رقم الطلب
    if (!orderNumber) {
      throw new Error('order_number مطلوب');
    }

    // 🎯 تحضير البيانات بالشكل المطلوب تماماً
    const updatePayload = {
      order_number: orderNumber,
      ...shippingData
    };


      // 🔐 الحصول على token من localStorage أو من المتغيرات العامة
  const token = localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    '318|8ZrKrDJ5rTan8O8WjzQMaZDlVU3VtrP36PbHvLZV696023bc'; // fallback token


    // إرسال طلب التحديث
    const response = await fetch(`${SHIPPING_UPDATE_API_BASE}${SHIPPING_UPDATE_ENDPOINT}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });


    // قراءة الاستجابة
    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      // console.error('❌ Failed to parse update response:', parseError);
      throw new Error(`فشل في تحليل استجابة API التحديث: ${responseText}`);
    }


    // معالجة النجاح
    if (response.ok && responseData.success) {
      
      if (responseData.data?.external_awb_number) {
      }
      if (responseData.data?.consignment_number) {
      }
      if (responseData.data?.shipped_at) {
      }

      return {
        success: true,
        data: responseData.data,
        updated_fields: responseData.updated_fields,
        message: responseData.message
      };
    }

    // معالجة الأخطاء
    
    if (response.status === 404) {
    } else if (response.status === 400) {
    }
    

    throw new Error(`فشل تحديث بيانات الشحن: ${responseData.message || 'خطأ غير معروف'}`);

  } catch (error) {
    // console.error('\n💥 Update shipping data error:', error.message);
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
  
  const updateData = {
    order_number: orderNumber,
    external_awb_number: shippingParameters.order_awb_number,
    consignment_number: shippingParameters.consignment_number,
    external_reference_id: shippingParameters.reference_id || shippingParameters.ClientOrderRef
  };
  
  
  
  
  
  return updateData;
};

export default {
  updateShippingData,
  updateFromShippingSuccess,
  updateSimpleAWB,
  updateFullShippingData
}; 