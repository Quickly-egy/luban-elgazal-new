import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/orders';
import useAuthStore from '../stores/authStore';

/**
 * 🎣 Hook مخصص لإدارة طلبات العملاء
 * يوفر جميع وظائف جلب وإدارة الطلبات مع إدارة الحالة
 */
export const useClientOrders = (initialFilters = {}) => {
  // States
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Auth state
  const { isAuthenticated, token } = useAuthStore();

  /**
   * 🛍️ جلب جميع طلبات العميل
   */
  const fetchOrders = useCallback(async (customFilters = {}) => {
    if (!isAuthenticated || !token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 جلب الطلبات مع الفلاتر:', { ...filters, ...customFilters });
      
      const response = await orderAPI.getMyOrders({ ...filters, ...customFilters });
      
      if (response.success) {
        const orders = response.data.orders || [];
        
        // طباعة حالات الطلبات للمساعدة في التشخيص
        if (orders.length > 0) {
          console.log('📋 حالات الطلبات:', orders.map(order => ({ 
            id: order.id, 
            status: order.status, 
            status_label: order.status_label,
            order_number: order.order_number 
          })));
        }
        
        setOrders(orders);
        setPagination(response.data.pagination || null);
        setStatistics(response.data.statistics || null);
        console.log('✅ تم جلب الطلبات بنجاح:', orders.length);
      } else {
        throw new Error(response.message || 'فشل في جلب الطلبات');
      }
    } catch (err) {
      console.error('❌ خطأ في جلب الطلبات:', err);
      setError(err.message || 'حدث خطأ في جلب الطلبات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated, token]);

  /**
   * 📋 جلب تفاصيل طلب واحد
   */
  const fetchOrder = useCallback(async (orderId) => {
    if (!isAuthenticated || !token) {
      setError('يجب تسجيل الدخول أولاً');
      return null;
    }

    if (!orderId) {
      setError('معرف الطلب مطلوب');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 جلب تفاصيل الطلب:', orderId);
      
      const response = await orderAPI.getMyOrder(orderId);
      
      if (response.success) {
        const order = response.data.order;
        
        // طباعة حالة الطلب للمساعدة في التشخيص
        console.log('📋 تفاصيل الطلب:', { 
          id: order.id, 
          status: order.status, 
          status_label: order.status_label,
          order_number: order.order_number 
        });
        
        setCurrentOrder(order);
        console.log('✅ تم جلب تفاصيل الطلب بنجاح');
        return order;
      } else {
        throw new Error(response.message || 'فشل في جلب تفاصيل الطلب');
      }
    } catch (err) {
      console.error('❌ خطأ في جلب تفاصيل الطلب:', err);
      setError(err.message || 'حدث خطأ في جلب تفاصيل الطلب');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  /**
   * ❌ إلغاء طلب
   */
  const cancelOrder = useCallback(async (orderId, reason = '') => {
    if (!isAuthenticated || !token) {
      setError('يجب تسجيل الدخول أولاً');
      return false;
    }

    if (!orderId) {
      setError('معرف الطلب مطلوب');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 إلغاء الطلب:', orderId, 'السبب:', reason);
      
      const response = await orderAPI.cancelMyOrder(orderId, reason);
      
      if (response.success) {
        console.log('✅ تم إلغاء الطلب بنجاح');
        
        // تحديث الطلب في القائمة إذا كان موجوداً
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled', can_cancel: false }
              : order
          )
        );

        // تحديث الطلب الحالي إذا كان هو نفسه
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(prev => ({ 
            ...prev, 
            status: 'cancelled', 
            can_cancel: false 
          }));
        }

        // تحديث الإحصائيات
        if (statistics) {
          setStatistics(prev => ({
            ...prev,
            cancelled_orders: (prev.cancelled_orders || 0) + 1,
            pending_orders: Math.max((prev.pending_orders || 0) - 1, 0),
            confirmed_orders: Math.max((prev.confirmed_orders || 0) - 1, 0)
          }));
        }

        return true;
      } else {
        throw new Error(response.message || 'فشل في إلغاء الطلب');
      }
    } catch (err) {
      console.error('❌ خطأ في إلغاء الطلب:', err);
      setError(err.message || 'حدث خطأ في إلغاء الطلب');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentOrder, statistics]);

  /**
   * 🔍 البحث في الطلبات
   */
  const searchOrders = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      // إذا كان البحث فارغاً، جلب جميع الطلبات
      await fetchOrders();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 البحث في الطلبات:', searchTerm);
      
      const response = await orderAPI.searchOrders(searchTerm.trim());
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || null);
        console.log('✅ تم البحث بنجاح، النتائج:', response.data.orders?.length || 0);
      } else {
        throw new Error(response.message || 'فشل في البحث');
      }
    } catch (err) {
      console.error('❌ خطأ في البحث:', err);
      setError(err.message || 'حدث خطأ في البحث');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  /**
   * 🏷️ تصفية الطلبات حسب الحالة
   */
  const filterByStatus = useCallback(async (status) => {
    const newFilters = { ...filters };
    
    if (status === 'all') {
      delete newFilters.status;
    } else {
      newFilters.status = status;
    }
    
    setFilters(newFilters);
    await fetchOrders(newFilters);
  }, [filters, fetchOrders]);

  /**
   * 📅 تصفية الطلبات حسب التاريخ
   */
  const filterByDateRange = useCallback(async (dateFrom, dateTo) => {
    const newFilters = { ...filters };
    
    if (dateFrom) {
      newFilters.date_from = dateFrom;
    } else {
      delete newFilters.date_from;
    }
    
    if (dateTo) {
      newFilters.date_to = dateTo;
    } else {
      delete newFilters.date_to;
    }
    
    setFilters(newFilters);
    await fetchOrders(newFilters);
  }, [filters, fetchOrders]);

  /**
   * 📊 تحديث الفلاتر
   */
  const updateFilters = useCallback(async (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await fetchOrders(updatedFilters);
  }, [filters, fetchOrders]);

  /**
   * 🔄 إعادة تحميل الطلبات
   */
  const refreshOrders = useCallback(async () => {
    setRefreshFlag(prev => prev + 1);
    await fetchOrders();
  }, [fetchOrders]);

  /**
   * 📄 تحميل الصفحة التالية
   */
  const loadNextPage = useCallback(async () => {
    if (!pagination || !pagination.has_more_pages) {
      return;
    }

    const nextPage = pagination.current_page + 1;
    await fetchOrders({ ...filters, page: nextPage });
  }, [pagination, filters, fetchOrders]);

  /**
   * 📄 الانتقال لصفحة محددة
   */
  const goToPage = useCallback(async (page) => {
    if (!pagination || page < 1 || page > pagination.last_page) {
      return;
    }

    await fetchOrders({ ...filters, page });
  }, [pagination, filters, fetchOrders]);

  /**
   * 🧹 مسح الأخطاء
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 🧹 مسح الطلب الحالي
   */
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // تحميل الطلبات عند تغيير الفلاتر أو المصادقة
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    }
  }, [isAuthenticated, token, refreshFlag]);

  // Helper functions
  const canCancelOrder = useCallback((order) => {
    return orderAPI.canCancel(order);
  }, []);

  const getStatusLabel = useCallback((status) => {
    return orderAPI.getStatusLabel(status);
  }, []);

  const getStatusColor = useCallback((status) => {
    return orderAPI.getStatusColor(status);
  }, []);

  return {
    // البيانات
    orders,
    currentOrder,
    statistics,
    pagination,
    filters,
    
    // الحالات
    loading,
    error,
    
    // الوظائف الأساسية
    fetchOrders,
    fetchOrder,
    cancelOrder,
    
    // البحث والتصفية
    searchOrders,
    filterByStatus,
    filterByDateRange,
    updateFilters,
    
    // التنقل
    loadNextPage,
    goToPage,
    
    // المساعدات
    refreshOrders,
    clearError,
    clearCurrentOrder,
    canCancelOrder,
    getStatusLabel,
    getStatusColor,
    
    // حالات مفيدة
    hasOrders: orders.length > 0,
    hasNextPage: pagination?.has_more_pages || false,
    currentPage: pagination?.current_page || 1,
    totalPages: pagination?.last_page || 1,
    totalOrders: pagination?.total || 0,
    isAuthenticated
  };
};

/**
 * 🎣 Hook مبسط لطلب واحد
 */
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, token } = useAuthStore();

  const fetchOrder = useCallback(async () => {
    if (!isAuthenticated || !token || !orderId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderAPI.getMyOrder(orderId);
      
      if (response.success) {
        const order = response.data.order;
        
        // طباعة حالة الطلب للمساعدة في التشخيص
        console.log('📋 حالة الطلب المنفرد:', { 
          id: order.id, 
          status: order.status, 
          status_label: order.status_label,
          order_number: order.order_number 
        });
        
        setOrder(order);
      } else {
        throw new Error(response.message || 'فشل في جلب الطلب');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في جلب الطلب');
    } finally {
      setLoading(false);
    }
  }, [orderId, isAuthenticated, token]);

  const cancelOrder = useCallback(async (reason = '') => {
    if (!order) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await orderAPI.cancelMyOrder(order.id, reason);
      
      if (response.success) {
        setOrder(prev => ({ ...prev, status: 'cancelled', can_cancel: false }));
        return true;
      } else {
        throw new Error(response.message || 'فشل في إلغاء الطلب');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في إلغاء الطلب');
      return false;
    } finally {
      setLoading(false);
    }
  }, [order]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    fetchOrder,
    cancelOrder,
    canCancel: order ? orderAPI.canCancel(order) : false,
    getStatusLabel: (status) => orderAPI.getStatusLabel(status),
    getStatusColor: (status) => orderAPI.getStatusColor(status)
  };
};

/**
 * 🎣 Hook للإحصائيات فقط
 */
export const useOrderStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, token } = useAuthStore();

  const fetchStatistics = useCallback(async () => {
    if (!isAuthenticated || !token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderAPI.getStatistics();
      
      if (response.success) {
        setStatistics(response.data);
      } else {
        throw new Error(response.message || 'فشل في جلب الإحصائيات');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في جلب الإحصائيات');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    fetchStatistics
  };
};

export default useClientOrders; 