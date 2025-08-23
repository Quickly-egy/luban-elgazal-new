// 📦 خدمات الشحن - Shipping Services Index

// خدمات الشحن الأساسية
export {
  createShippingOrder,
  trackShippingOrder,
  getSupportedCities,
  validateShippingData,
  extractShippingParameters,
  prepareForNextAPI,
  printShippingTestData
} from './shipping.js';

// خدمات تحديث بيانات الشحن
export {
  updateShippingData,
  updateFromShippingSuccess,
  updateSimpleAWB,
  updateFullShippingData,
  testUpdatePayload
} from './shippingUpdate.js';

// دالة شاملة لإنشاء الشحن مع التحديث التلقائي
export const createShippingWithAutoUpdate = async (orderData) => {
  try {
    // إنشاء طلب الشحن
    const shippingResult = await createShippingOrder(orderData);
    
    if (shippingResult.success) {
      
      // التحديث التلقائي مُضمن في createShippingOrder
      return shippingResult;
    } else {
      throw new Error('Failed to create shipping order');
    }
  } catch (error) {
    // console.error('❌ Create shipping with auto-update failed:', error);
    throw error;
  }
};

// دالة لتحديث بيانات شحن موجودة يدوياً
export const manualUpdateShipping = async (orderNumber, customData = {}) => {
  try {
    const { updateShippingData } = await import('./shippingUpdate.js');
    
    const result = await updateShippingData(orderNumber, customData);
    
    return result;
  } catch (error) {
    // console.error('❌ Manual update failed:', error);
    throw error;
  }
};

export default {
  // أساسيات الشحن
  createShippingOrder,
  trackShippingOrder,
  getSupportedCities,
  
  // تحديث البيانات
  updateShippingData,
  updateFromShippingSuccess,
  updateSimpleAWB,
  updateFullShippingData,
  
  // دوال شاملة
  createShippingWithAutoUpdate,
  manualUpdateShipping,
  
  // أدوات
  extractShippingParameters,
  prepareForNextAPI,
  validateShippingData
}; 