import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AbandonedCartAPI, debounce } from '../services/abandonedCartAPI';

// Debounced function to save abandoned cart
const debouncedSaveAbandonedCart = debounce(async (cartItems) => {
  const clientId = AbandonedCartAPI.getClientId();
  
  if (AbandonedCartAPI.shouldSaveCart(cartItems, clientId)) {
    const formattedCartData = AbandonedCartAPI.formatCartDataForAPI(cartItems);
    const sessionId = AbandonedCartAPI.getSessionId();
    
    const result = await AbandonedCartAPI.saveAbandonedCart({
      client_id: clientId,
      cart_data: formattedCartData,
      session_id: sessionId
    });
    
    if (result.success) {
      console.log('Abandoned cart saved successfully:', result.data);
    } else {
      console.error('Failed to save abandoned cart:', result.error);
    }
  }
}, 2000); // Wait 2 seconds after last cart change

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      notification: null,
      notificationType: 'success',
      
      // Save abandoned cart function (debounced for general use)
      saveAbandonedCart: () => {
        const { cartItems } = get();
        debouncedSaveAbandonedCart(cartItems);
      },
      
      // Save cart immediately for real-time admin tracking
      saveCartImmediately: async () => {
        try {
          const { cartItems } = get();
          console.log('🏪 Cart Store: Calling saveCartImmediately with items:', cartItems);
          const result = await AbandonedCartAPI.saveCartImmediately(cartItems);
          console.log('🏪 Cart Store: API call result:', result);
          return result;
        } catch (error) {
          console.error('🏪 Cart Store: Error in saveCartImmediately:', error);
          return { success: false, error: error.message };
        }
      },
      
      // إضافة منتج للسلة
      addToCart: (product, quantity = 1) => {
      
        const { cartItems } = get();
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // إذا كان المنتج موجود، زيادة الكمية
          set({
            cartItems: cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            notification: `تم زيادة كمية "${product.name}" في السلة`,
            notificationType: 'success'
          });
        } else {
          // إضافة منتج جديد
          const newItem = { ...product, quantity };
        
          set({
            cartItems: [...cartItems, newItem],
            notification: `تم إضافة "${product.name}" للسلة`,
            notificationType: 'success'
          });
        }
        
        // Send cart data to admin immediately for real-time tracking
        get().saveCartImmediately();
        
        // إخفاء الإشعار بعد 3 ثوان
        setTimeout(() => {
          set({ notification: null });
        }, 3000);
        
        return true;
      },
      
      // حذف منتج من السلة
      removeFromCart: (productId) => {
        const currentItems = get().cartItems;
        const item = currentItems.find(item => item.id === productId);
        
        set({
          cartItems: currentItems.filter(item => item.id !== productId),
          notification: item ? `تم حذف "${item.name}" من السلة` : 'تم حذف المنتج من السلة',
          notificationType: 'remove'
        });
        
        // Send cart data to admin immediately for real-time tracking
        get().saveCartImmediately();
        
        // إخفاء الإشعار بعد 3 ثوان
        setTimeout(() => {
          set({ notification: null });
        }, 3000);
      },
      
      // تحديث كمية المنتج
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cartItems: get().cartItems.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        });
        
        // Send cart data to admin immediately for real-time tracking
        get().saveCartImmediately();
      },
      
      // زيادة الكمية
      increaseQuantity: (productId) => {
        const item = get().cartItems.find(item => item.id === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },
      
      // تقليل الكمية
      decreaseQuantity: (productId) => {
        const item = get().cartItems.find(item => item.id === productId);
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1);
        }
      },
      
      // مسح السلة
      clearCart: async () => {
        set({ cartItems: [] });
        
        // Delete abandoned cart from API when cart is cleared
        try {
          await AbandonedCartAPI.deleteAbandonedCart();
          console.log('✅ Abandoned cart deleted after clearing cart');
        } catch (error) {
          console.error('❌ Error deleting abandoned cart after clear:', error);
        }
        
        toast.success('تم مسح جميع المنتجات من السلة');
        setTimeout(() => {
          set({ notification: null });
        }, 3000);
      },
      
      // مسح الإشعار
      clearNotification: () => {
        set({ notification: null });
      },
      
      // الحصول على عدد المنتجات في السلة
      getCartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      
      // الحصول على إجمالي السعر
      getTotalPrice: (calculateItemPrice = null, countryCode = null) => {
        return get().cartItems.reduce((total, item) => {
          let price = item.discountedPrice || item.price;
          
          // If we have a price calculator function and country code, use it
          if (calculateItemPrice && countryCode) {
            price = calculateItemPrice(item, countryCode);
          }
          
          return total + (price * item.quantity);
        }, 0);
      },
      
      // التحقق من وجود المنتج في السلة
      isInCart: (productId) => {
        return get().cartItems.some(item => item.id === productId);
      },
      
      // الحصول على كمية منتج معين
      getItemQuantity: (productId) => {
        const item = get().cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
      }
    }),
    {
      name: 'cart-storage', // اسم المفتاح في localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore; 