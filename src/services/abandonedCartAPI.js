import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://app.quickly.codes/luban-elgazal/public/api';

// Abandoned Cart API Service
export class AbandonedCartAPI {
  
  /**
   * Save abandoned cart data
   * @param {Object} cartData - Cart data to save
   * @param {number} cartData.client_id - Client ID
   * @param {Array} cartData.cart_data - Array of cart items
   * @param {string} cartData.session_id - Optional session ID
   * @returns {Promise} API response
   */
  static async saveAbandonedCart(cartData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/abandoned-carts/save`,
        cartData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error saving abandoned cart:', error);
      
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Format cart items for API
   * @param {Array} cartItems - Cart items from store
   * @returns {Array} Formatted cart data for API
   */
  static formatCartDataForAPI(cartItems) {
    return cartItems.map(item => ({
      product_id: item.id,
      product_name: item.name || item.title || `Product ${item.id}`,
      quantity: item.quantity,
      unit_price: parseFloat(item.price || 0)
    }));
  }

  /**
   * Get client ID from various sources
   * @returns {number|null} Client ID
   */
  static getClientId() {
    // Priority 1: Authenticated user client_id (saved after login/registration)
    let clientId = localStorage.getItem('client_id');
    
    if (clientId) {
      console.log('🔐 Using authenticated user client_id:', clientId);
      return parseInt(clientId);
    }
    
    // Priority 2: Try other sources for backward compatibility
    clientId = sessionStorage.getItem('client_id') || 
               localStorage.getItem('user_id') ||
               sessionStorage.getItem('user_id');
    
    if (clientId) {
      console.log('🔍 Found client_id from alternative source:', clientId);
      return parseInt(clientId);
    }
    
    // Priority 3: Guest client ID for non-authenticated users
    const guestId = localStorage.getItem('guest_client_id');
    if (guestId) {
      console.log('👤 Using existing guest client_id:', guestId);
      return parseInt(guestId);
    }
    
    // Priority 4: Create new guest client ID
    const tempId = -Math.floor(Date.now() / 1000); // Negative timestamp
    localStorage.setItem('guest_client_id', tempId.toString());
    console.log('🆕 Created new guest client_id:', tempId);
    
    return tempId;
  }

  /**
   * Get session ID
   * @returns {string} Session ID
   */
  static getSessionId() {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Check if cart should be saved (has items and client ID)
   * @param {Array} cartItems - Cart items
   * @param {number} clientId - Client ID
   * @returns {boolean} Whether cart should be saved
   */
  static shouldSaveCart(cartItems, clientId) {
    return cartItems && cartItems.length > 0 && clientId;
  }

  /**
   * Save abandoned cart immediately (for real-time admin tracking)
   * @param {Array} cartItems - Current cart items
   * @returns {Promise} API response
   */
  static async saveCartImmediately(cartItems) {
    console.log('🛒 Attempting to save cart immediately...', {
      itemsCount: cartItems?.length || 0,
      items: cartItems
    });
    
    const clientId = this.getClientId();
    console.log('👤 Client ID obtained:', clientId);
    
    // Always save cart data, even if empty (for admin tracking)
    if (clientId) {
      try {
        const formattedCartData = this.formatCartDataForAPI(cartItems);
        const sessionId = this.getSessionId();
        
        console.log('📦 Formatted data for API:', {
          client_id: clientId,
          cart_data: formattedCartData,
          session_id: sessionId
        });
        
        const result = await this.saveAbandonedCart({
          client_id: clientId,
          cart_data: formattedCartData,
          session_id: sessionId
        });
        
        if (result.success) {
          console.log('✅ Cart data sent to admin successfully:', {
            client_id: clientId,
            items_count: cartItems.length,
            total_products: formattedCartData.length,
            response: result.data
          });
        } else {
          console.error('❌ Failed to send cart data to admin:', result.error);
        }
        
        return result;
      } catch (error) {
        console.error('❌ Error saving cart immediately:', error);
        throw error;
      }
    } else {
      console.warn('⚠️ No client ID available, skipping immediate cart save');
      return null;
    }
  }

  /**
   * Delete abandoned cart from API
   * Used when cart is cleared or order is placed
   * @returns {Promise} API response
   */
  static async deleteAbandonedCart() {
    console.log('🗑️ Attempting to delete abandoned cart...');
    
    const clientId = this.getClientId();
    console.log('👤 Client ID for deletion:', clientId);
    
    if (clientId) {
      try {
        const sessionId = this.getSessionId();
        
        console.log('📦 Sending empty cart data to delete abandoned cart:', {
          client_id: clientId,
          cart_data: [],
          session_id: sessionId
        });
        
        const result = await this.saveAbandonedCart({
          client_id: clientId,
          cart_data: [],
          session_id: sessionId
        });
        
        console.log('✅ Abandoned cart deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Error deleting abandoned cart:', error);
        throw error;
      }
    } else {
      console.warn('⚠️ No client ID available, skipping abandoned cart deletion');
      return null;
    }
  }
}

// Debounce function to prevent too many API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
