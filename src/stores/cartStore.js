import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
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
          set({
            cartItems: [...cartItems, { ...product, quantity }]
          });
        }
        return true;
      },
      
      // حذف منتج من السلة
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter(item => item.id !== productId)
        });
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
        set({ cartItems: [] });
      },
      
      // الحصول على عدد المنتجات في السلة
      getCartCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      
      // الحصول على إجمالي السعر
      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => {
          const price = item.discountedPrice || item.price;
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