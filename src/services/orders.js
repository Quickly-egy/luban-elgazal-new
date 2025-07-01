import { apiService } from './api';

/**
 * 📦 خدمة API طلبات العملاء
 * يوفر جميع وظائف إدارة طلبات العملاء
 */
export class ClientOrdersAPI {
  constructor() {
    this.baseEndpoint = '/my-orders';
  }

  /**
   * 🛍️ جلب جميع طلبات العميل مع إمكانيات التصفية والترتيب
   * @param {Object} filters - معاملات التصفية والترتيب
   * @returns {Promise<Object>} استجابة API مع الطلبات والإحصائيات
   */
  async getMyOrders(filters = {}) {
    try {
      console.log('🔍 جلب طلبات العميل مع الفلاتر:', filters);
      
      // تحضير معاملات الاستعلام
      const params = new URLSearchParams();
      
      // إضافة الفلاتر المتاحة
      const allowedFilters = [
        'status', 'internal_status', 'date_from', 'date_to', 
        'order_number', 'sort_by', 'sort_direction', 'per_page', 'page'
      ];
      
      allowedFilters.forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      console.log('📡 استدعاء API:', endpoint);
      const response = await apiService.get(endpoint);
      
      console.log('✅ تم جلب الطلبات بنجاح:', response);
      return response;
    } catch (error) {
      console.error('❌ خطأ في جلب طلبات العميل:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * 📋 جلب تفاصيل طلب واحد محدد
   * @param {number|string} orderId - معرف الطلب
   * @returns {Promise<Object>} تفاصيل الطلب الكاملة
   */
  async getMyOrder(orderId) {
    try {
      console.log('🔍 جلب تفاصيل الطلب:', orderId);
      
      if (!orderId) {
        throw new Error('معرف الطلب مطلوب');
      }

      const endpoint = `${this.baseEndpoint}/${orderId}`;
      console.log('📡 استدعاء API:', endpoint);
      
      const response = await apiService.get(endpoint);
      
      console.log('✅ تم جلب تفاصيل الطلب بنجاح:', response);
      return response;
    } catch (error) {
      console.error('❌ خطأ في جلب تفاصيل الطلب:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * ❌ إلغاء طلب (متاح فقط للطلبات في حالة pending أو confirmed)
   * @param {number|string} orderId - معرف الطلب
   * @param {string} cancelReason - سبب الإلغاء (اختياري)
   * @returns {Promise<Object>} نتيجة عملية الإلغاء
   */
  async cancelMyOrder(orderId, cancelReason = '') {
    try {
      console.log('❌ إلغاء الطلب:', orderId, 'السبب:', cancelReason);
      
      if (!orderId) {
        throw new Error('معرف الطلب مطلوب');
      }

      const endpoint = `${this.baseEndpoint}/${orderId}/cancel`;
      const requestData = cancelReason ? { cancel_reason: cancelReason } : {};
      
      console.log('📡 استدعاء API:', endpoint, 'البيانات:', requestData);
      
      const response = await apiService.patch(endpoint, requestData);
      
      console.log('✅ تم إلغاء الطلب بنجاح:', response);
      return response;
    } catch (error) {
      console.error('❌ خطأ في إلغاء الطلب:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * 📊 جلب إحصائيات سريعة للعميل
   * @returns {Promise<Object>} إحصائيات الطلبات
   */
  async getOrderStatistics() {
    try {
      console.log('📊 جلب إحصائيات الطلبات');
      
      // جلب صفحة واحدة فقط للحصول على الإحصائيات
      const response = await this.getMyOrders({ per_page: 1 });
      
      if (response.success && response.data?.statistics) {
        return {
          success: true,
          data: response.data.statistics
        };
      }
      
      throw new Error('فشل في جلب الإحصائيات');
    } catch (error) {
      console.error('❌ خطأ في جلب إحصائيات الطلبات:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * 🔍 البحث في الطلبات برقم الطلب
   * @param {string} orderNumber - رقم الطلب أو جزء منه
   * @returns {Promise<Object>} نتائج البحث
   */
  async searchOrders(orderNumber) {
    try {
      console.log('🔍 البحث في الطلبات برقم:', orderNumber);
      
      if (!orderNumber || orderNumber.trim() === '') {
        throw new Error('رقم الطلب مطلوب للبحث');
      }

      return await this.getMyOrders({ 
        order_number: orderNumber.trim(),
        per_page: 20 
      });
    } catch (error) {
      console.error('❌ خطأ في البحث في الطلبات:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * 📅 جلب طلبات فترة زمنية محددة
   * @param {string} dateFrom - تاريخ البداية (YYYY-MM-DD)
   * @param {string} dateTo - تاريخ النهاية (YYYY-MM-DD)
   * @returns {Promise<Object>} طلبات الفترة المحددة
   */
  async getOrdersByDateRange(dateFrom, dateTo) {
    try {
      console.log('📅 جلب طلبات الفترة:', dateFrom, 'إلى', dateTo);
      
      if (!dateFrom || !dateTo) {
        throw new Error('تاريخ البداية والنهاية مطلوبان');
      }

      return await this.getMyOrders({
        date_from: dateFrom,
        date_to: dateTo,
        sort_by: 'created_at',
        sort_direction: 'desc'
      });
    } catch (error) {
      console.error('❌ خطأ في جلب طلبات الفترة:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * 🏷️ جلب طلبات بحالة محددة
   * @param {string} status - حالة الطلب
   * @returns {Promise<Object>} طلبات بالحالة المحددة
   */
  async getOrdersByStatus(status) {
    try {
      console.log('🏷️ جلب طلبات بالحالة:', status);
      
      const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      
      if (!allowedStatuses.includes(status)) {
        throw new Error(`حالة غير صحيحة. الحالات المتاحة: ${allowedStatuses.join(', ')}`);
      }

      return await this.getMyOrders({
        status,
        sort_by: 'created_at',
        sort_direction: 'desc'
      });
    } catch (error) {
      console.error('❌ خطأ في جلب طلبات بالحالة:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * ✅ التحقق من إمكانية إلغاء الطلب
   * @param {Object} order - بيانات الطلب
   * @returns {boolean} هل يمكن إلغاء الطلب
   */
  canCancelOrder(order) {
    if (!order) return false;
    
    // يمكن إلغاء الطلب إذا كان في حالة pending أو confirmed وكان الفلاج can_cancel = true
    return order.can_cancel === true && ['pending', 'confirmed'].includes(order.status);
  }

  /**
   * 🏷️ الحصول على تسمية الحالة بالعربية
   * @param {string} status - حالة الطلب
   * @returns {string} التسمية العربية للحالة
   */
  getStatusLabel(status) {
    const statusLabels = {
      pending: 'في انتظار التأكيد',
      confirmed: 'مؤكد',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغى',
      canceled: 'ملغى', // حالة إضافية للتأكد
      rejected: 'مرفوض',
      failed: 'فشل',
      refunded: 'مسترد',
    };
    
    return statusLabels[status] || status;
  }

  /**
   * 🎨 الحصول على لون الحالة
   * @param {string} status - حالة الطلب
   * @returns {string} كود اللون الخاص بالحالة
   */
  getStatusColor(status) {
    const statusColors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      processing: '#9b59b6',
      shipped: '#e67e22',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
      canceled: '#e74c3c', // حالة إضافية للتأكد
      rejected: '#e74c3c',
      failed: '#e74c3c',
      refunded: '#8e44ad',
    };
    
    return statusColors[status] || '#95a5a6';
  }

  /**
   * ⚠️ معالجة أخطاء API
   * @param {Object} error - خطأ API
   * @returns {Error} خطأ معالج
   */
  handleApiError(error) {
    let message = 'حدث خطأ غير متوقع';
    
    if (error.status) {
      switch (error.status) {
        case 401:
          message = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً';
          break;
        case 403:
          message = 'هذا API مخصص للعملاء فقط';
          break;
        case 404:
          message = 'الطلب غير موجود أو لا تملك صلاحية للوصول إليه';
          break;
        case 422:
          if (error.data?.message) {
            message = error.data.message;
          } else {
            message = 'لا يمكن تنفيذ العملية في الحالة الحالية';
          }
          break;
        case 500:
          message = 'حدث خطأ في الخادم';
          break;
        default:
          message = error.data?.message || error.message || message;
      }
    } else if (error.message) {
      message = error.message;
    }

    const customError = new Error(message);
    customError.status = error.status;
    customError.data = error.data;
    
    return customError;
  }
}

// إنشاء instance مشترك من API
export const clientOrdersAPI = new ClientOrdersAPI();

// تصدير الوظائف المباشرة للاستخدام السهل
export const orderAPI = {
  /**
   * جلب جميع طلبات العميل
   */
  getMyOrders: (filters = {}) => clientOrdersAPI.getMyOrders(filters),
  
  /**
   * جلب تفاصيل طلب واحد
   */
  getMyOrder: (orderId) => clientOrdersAPI.getMyOrder(orderId),
  
  /**
   * إلغاء طلب
   */
  cancelMyOrder: (orderId, reason = '') => clientOrdersAPI.cancelMyOrder(orderId, reason),
  
  /**
   * جلب إحصائيات الطلبات
   */
  getStatistics: () => clientOrdersAPI.getOrderStatistics(),
  
  /**
   * البحث في الطلبات
   */
  searchOrders: (orderNumber) => clientOrdersAPI.searchOrders(orderNumber),
  
  /**
   * جلب طلبات بحالة محددة
   */
  getOrdersByStatus: (status) => clientOrdersAPI.getOrdersByStatus(status),
  
  /**
   * جلب طلبات فترة زمنية
   */
  getOrdersByDateRange: (dateFrom, dateTo) => clientOrdersAPI.getOrdersByDateRange(dateFrom, dateTo),
  
  /**
   * مساعدات مفيدة
   */
  canCancel: (order) => clientOrdersAPI.canCancelOrder(order),
  getStatusLabel: (status) => clientOrdersAPI.getStatusLabel(status),
  getStatusColor: (status) => clientOrdersAPI.getStatusColor(status)
};

export default orderAPI; 