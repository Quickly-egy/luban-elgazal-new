import { useEffect } from 'react';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import { AbandonedCartAPI } from '../services/abandonedCartAPI';

/**
 * Hook for managing abandoned cart functionality
 * Automatically saves cart data when user authentication status changes
 */
export const useAbandonedCart = () => {
  const { cartItems, saveCartImmediately } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // When user logs in, immediately update cart with their real client_id
    if (isAuthenticated && user?.id) {
      console.log('🔄 User authenticated, updating cart with real client_id:', user.id);
      
      // Remove guest client ID as it's no longer needed
      localStorage.removeItem('guest_client_id');
      
      // Save current cart with authenticated user ID immediately
      if (cartItems.length > 0) {
        saveCartImmediately();
      }
    }
  }, [isAuthenticated, user, cartItems.length, saveCartImmediately]);

  useEffect(() => {
    // Save cart whenever it changes (for both authenticated and guest users)
    if (cartItems.length > 0) {
      const clientId = AbandonedCartAPI.getClientId();
      if (clientId) {
        console.log('🛒 Cart changed, saving with client_id:', clientId);
        saveCartImmediately();
      }
    }
  }, [cartItems, saveCartImmediately]);

  const getCurrentClientId = () => {
    return AbandonedCartAPI.getClientId();
  };

  const isUsingGuestId = () => {
    const clientId = AbandonedCartAPI.getClientId();
    return clientId && clientId < 0; // Negative IDs are guest IDs
  };

  return {
    saveCartImmediately,
    getCurrentClientId,
    isUsingGuestId,
    isAuthenticated,
    hasItems: cartItems.length > 0
  };
};
