import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCartStore from "./cartStore";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // الحالة الأولية
      wishlistItems: [],

      // إضافة منتج للمفضلة
      addToWishlist: (product) => {
        const { wishlistItems } = get();
        const existingItem = wishlistItems.find(
          (item) => item.id === product.id
        );

        if (!existingItem) {
          const wishlistItem = {
            id: product.id,
            name: product.name,
            category: product.category || "غير محدد",
            price: product.discountedPrice || product.price,
            originalPrice: product.originalPrice,
            rating: product.rating || 0,
            reviewsCount: product.reviewsCount || 0,
            image: product.image,
            inStock: product.inStock !== false,
            discount: product.discountPercentage || 0,
            weight: product.weight || "",
            addedAt: new Date().toISOString(),
            // إضافة كائن prices للاستخدام في المفضلة
            prices: product.prices || null,
            price_sar: product.price_sar,
            price_aed: product.price_aed,
            price_qar: product.price_qar,
            price_kwd: product.price_kwd,
            price_bhd: product.price_bhd,
            price_omr: product.price_omr
          };

          set({
            wishlistItems: [...wishlistItems, wishlistItem],
          });

          return true; // تم الإضافة بنجاح
        }

        return false; // المنتج موجود بالفعل
      },

      // حذف منتج من المفضلة
      removeFromWishlist: (productId) => {
        const { wishlistItems } = get();
        set({
          wishlistItems: wishlistItems.filter((item) => item.id !== productId),
        });
      },

      // التحقق من وجود منتج في المفضلة
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.id === productId);
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
        return wishlistItems.find((item) => item.id === productId);
      },

      // نقل منتج من المفضلة للسلة
      moveToCart: (productId) => {
        const { wishlistItems, removeFromWishlist } = get();
        const item = wishlistItems.find((item) => item.id === productId);

        if (item) {
          // إضافة المنتج للسلة
          const cartStore = useCartStore.getState();
          const success = cartStore.addToCart(item, 1);

          if (success) {
            // حذف المنتج من المفضلة بعد إضافته للسلة بنجاح
            removeFromWishlist(productId);
            console.log("تم نقل المنتج من المفضلة للسلة:", item.name);
            return item;
          }
        }

        return null;
      },

      // نقل جميع المنتجات من المفضلة للسلة
      moveAllToCart: () => {
        const { wishlistItems, clearWishlist } = get();

        if (wishlistItems.length === 0) {
          return { success: false, message: "قائمة المفضلة فارغة" };
        }

        const cartStore = useCartStore.getState();
        let successCount = 0;

        wishlistItems.forEach((item) => {
          const success = cartStore.addToCart(item, 1);
          if (success) {
            successCount++;
          }
        });

        if (successCount > 0) {
          clearWishlist();
          return {
            success: true,
            message: `تم نقل ${successCount} منتج من المفضلة للسلة`,
            count: successCount,
          };
        }

        return { success: false, message: "فشل في نقل المنتجات للسلة" };
      },
    }),
    {
      name: "wishlist-storage", // اسم المفتاح في localStorage
      getStorage: () => localStorage, // استخدام localStorage
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
      }), // حفظ wishlistItems فقط
    }
  )
);

export default useWishlistStore;
