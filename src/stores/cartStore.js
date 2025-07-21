import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      notification: null,
      notificationType: 'success',
      
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
      clearCart: () => {
        set({ 
          cartItems: [],
          notification: 'تم مسح جميع المنتجات من السلة',
          notificationType: 'remove'
        });
        
        // إخفاء الإشعار بعد 3 ثوان
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