import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Cart store implementation

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      notification: null,
      notificationType: 'success',
      
      // Cart store methods
      
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
            )
          });
        } else {
          // إضافة منتج جديد
          const newItem = { ...product, quantity };
        
          set({
            cartItems: [...cartItems, newItem]
          });
        }
        
        return true;
      },
      
      // حذف منتج من السلة
      removeFromCart: (productId) => {
        const currentItems = get().cartItems;
        const item = currentItems.find(item => item.id === productId);
        
        set({
          cartItems: currentItems.filter(item => item.id !== productId)
        });
        
        // Send cart data to admin immediately for real-time tracking
        get().saveCartImmediately();
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
        } catch (error) {
          console.error('❌ Error deleting abandoned cart after clear:', error);
        }
        

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