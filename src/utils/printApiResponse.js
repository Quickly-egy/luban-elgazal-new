// 🖨️ دالة لطباعة استجابة API الخاص بـ external-order
// يمكن استخدامها لطباعة الـ response بشكل منظم ومفصل

/**
 * طباعة استجابة API بشكل منظم
 * @param {Object} response - استجابة API
 * @param {string} apiName - اسم API (اختياري)
 */
export const printApiResponse = (response, apiName = 'External Order API') => {
  
  // طباعة الاستجابة الكاملة
  
  
  // إذا كان هناك data
  if (response.data) {
    
    // إذا كان هناك بيانات شحن
    if (response.data.data) {
      const shippingData = response.data.data;
      
      // تفاصيل الطلب
      if (shippingData.details) {
      }
    }
  }
  
  // إذا كان هناك أخطاء
  if (response.error || response.errors) {
  }
  
  // إذا كان هناك استجابة من API الخارجي
  if (response.external_api_response) {
  }
  
};

/**
 * طباعة استجابة API مع تفاصيل إضافية للتطوير
 * @param {Object} response - استجابة API
 * @param {Object} requestData - البيانات المرسلة (اختياري)
 */
export const printDetailedApiResponse = (response, requestData = null) => {
  
  // طباعة البيانات المرسلة إذا توفرت
  if (requestData) {
  }
  
  // طباعة الاستجابة
  printApiResponse(response, 'External Order API');
  
  // تحليل إضافي
  
  // فحص البنية
  if (response.data && response.data.data) {
  }
  
};

/**
 * طباعة استجابة مبسطة للاختبار السريع
 * @param {Object} response - استجابة API
 */
export const printSimpleResponse = (response) => {
  
  if (response.data?.data?.order_awb_number) {
  }
  
  if (response.error) {
  }
  
};

// تصدير جميع الدوال
export default {
  printApiResponse,
  printDetailedApiResponse,
  printSimpleResponse
};
