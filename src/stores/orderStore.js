import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set, get) => ({
      currentOrder: null,
      lastOrderDetails: null,
      
      // حفظ بيانات الطلب الحالي
      setCurrentOrder: (orderData) => {
        console.log('💾 حفظ بيانات الطلب في المخزن:', orderData);
        set({ 
          currentOrder: orderData,
          lastOrderDetails: {
            ...orderData,
            created_at: new Date().toISOString()
          }
        });
      },
      
      // الحصول على بيانات الطلب الحالي
      getCurrentOrder: () => get().currentOrder,
      
      // الحصول على بيانات آخر طلب
      getLastOrderDetails: () => get().lastOrderDetails,
      
      // مسح بيانات الطلب الحالي
      clearCurrentOrder: () => {
        console.log('🗑️ مسح بيانات الطلب من المخزن');
        set({ currentOrder: null });
      },

      // مسح كل البيانات
      clearAll: () => {
        console.log('🗑️ مسح كل بيانات الطلبات من المخزن');
        set({ currentOrder: null, lastOrderDetails: null });
      }
    }),
    {
      name: 'order-storage',
      getStorage: () => localStorage
    }
  )
);

export default useOrderStore;