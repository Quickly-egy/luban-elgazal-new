import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // الحالة الأولية
      wishlistItems: [],
      
      // إضافة منتج للمفضلة
      addToWishlist: (product) => {
        const { wishlistItems } = get();
        const existingItem = wishlistItems.find(item => item.id === product.id);
        
        if (!existingItem) {
          const wishlistItem = {
            id: product.id,
            name: product.name,
            category: product.category || 'غير محدد',
            price: product.discountedPrice || product.price,
            originalPrice: product.originalPrice,
            rating: product.rating || 0,
            reviewsCount: product.reviewsCount || 0,
            image: product.image,
            inStock: product.inStock !== false,
            discount: product.discountPercentage || 0,
            weight: product.weight || '',
            addedAt: new Date().toISOString()
          };
          
          set({ 
            wishlistItems: [...wishlistItems, wishlistItem] 
          });
          
          return true; // تم الإضافة بنجاح
        }
        
        return false; // المنتج موجود بالفعل
      },
      
      // حذف منتج من المفضلة
      removeFromWishlist: (productId) => {
        const { wishlistItems } = get();
        set({ 
          wishlistItems: wishlistItems.filter(item => item.id !== productId) 
        });
      },
      
      // التحقق من وجود منتج في المفضلة
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some(item => item.id === productId);
      },
      
      // تبديل حالة المنتج في المفضلة
      toggleWishlist: (product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
          return false; // تم الحذف
        } else {
          addToWishlist(product);
          return true; // تم الإضافة
        }
      },
      
      // مسح جميع المنتجات من المفضلة
      clearWishlist: () => {
        set({ wishlistItems: [] });
      },
      
      // الحصول على عدد المنتجات في المفضلة
      getWishlistCount: () => {
        const { wishlistItems } = get();
        return wishlistItems.length;
      },
      
      // الحصول على منتج معين من المفضلة
      getWishlistItem: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.find(item => item.id === productId);
      },
      
      // نقل منتج من المفضلة للسلة (يمكن ربطه مع store السلة لاحقاً)
      moveToCart: (productId) => {
        const { wishlistItems, removeFromWishlist } = get();
        const item = wishlistItems.find(item => item.id === productId);
        
        if (item) {
          // هنا يمكن إضافة المنتج للسلة
          console.log('نقل المنتج للسلة:', item);
          
          // حذف المنتج من المفضلة
          removeFromWishlist(productId);
          
          return item;
        }
        
        return null;
      }
    }),
    {
      name: 'wishlist-storage', // اسم المفتاح في localStorage
      getStorage: () => localStorage, // استخدام localStorage
      partialize: (state) => ({ 
        wishlistItems: state.wishlistItems 
      }), // حفظ wishlistItems فقط
    }
  )
);

export default useWishlistStore; 
 