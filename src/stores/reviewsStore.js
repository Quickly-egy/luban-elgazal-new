import { create } from 'zustand';
import { reviewsAPI } from '../services/endpoints';

const useReviewsStore = create((set, get) => ({
  // State
  reviews: {},
  loading: false,
  error: null,

  // Actions
  fetchProductReviews: async (productId) => {
    if (!productId) return;

    // التحقق من وجود التقييمات مسبقاً
    const existingReviews = get().reviews[productId];
    if (existingReviews && !existingReviews.isStale) {
      return existingReviews;
    }

    try {
      set({ loading: true, error: null });

      const response = await reviewsAPI.getProductReviews(productId);

      if (response.status === 'success' && response.data) {
        const reviewsData = {
          product: response.data.product,
          reviews: response.data.reviews || [],
          statistics: response.data.statistics || {
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: {
              '5_stars': 0,
              '4_stars': 0,
              '3_stars': 0,
              '2_stars': 0,
              '1_star': 0
            }
          },
          lastFetched: Date.now(),
          isStale: false
        };

        set(state => ({
          reviews: {
            ...state.reviews,
            [productId]: reviewsData
          }
        }));

        return reviewsData;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {

      set({ 
        error: 'فشل في تحميل التقييمات. يرجى المحاولة مرة أخرى.'
      });
      
      // في حالة الخطأ، إرجاع بيانات فارغة
      const emptyData = {
        product: { id: productId, name: '', main_image_url: '' },
        reviews: [],
        statistics: {
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: {
            '5_stars': 0,
            '4_stars': 0,
            '3_stars': 0,
            '2_stars': 0,
            '1_star': 0
          }
        },
        lastFetched: Date.now(),
        isStale: true
      };

      set(state => ({
        reviews: {
          ...state.reviews,
          [productId]: emptyData
        }
      }));

      return emptyData;
    } finally {
      set({ loading: false });
    }
  },

  // الحصول على التقييمات من الذاكرة
  getProductReviews: (productId) => {
    return get().reviews[productId] || null;
  },

  // مسح التقييمات من الذاكرة
  clearProductReviews: (productId) => {
    set(state => {
      const newReviews = { ...state.reviews };
      delete newReviews[productId];
      return { reviews: newReviews };
    });
  },

  // مسح جميع التقييمات
  clearAllReviews: () => {
    set({ reviews: {}, error: null });
  },

  // إعادة تحميل التقييمات
  refreshProductReviews: async (productId) => {
    // وضع علامة أن البيانات قديمة
    set(state => ({
      reviews: {
        ...state.reviews,
        [productId]: state.reviews[productId] ? {
          ...state.reviews[productId],
          isStale: true
        } : undefined
      }
    }));

    // تحميل البيانات الجديدة
    return await get().fetchProductReviews(productId);
  },

  // مسح الأخطاء
  clearError: () => {
    set({ error: null });
  }
}));

export default useReviewsStore; 