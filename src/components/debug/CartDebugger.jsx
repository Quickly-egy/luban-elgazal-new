import React from 'react';
import useCartStore from '../../stores/cartStore';
import useAuthStore from '../../stores/authStore';
import { AbandonedCartAPI } from '../../services/abandonedCartAPI';
import { useAbandonedCart } from '../../hooks/useAbandonedCart';

/**
 * Debug component to test abandoned cart API integration
 * This component helps debug cart API calls and shows current state
 */
const CartDebugger = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, saveCartImmediately } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { getCurrentClientId, isUsingGuestId } = useAbandonedCart();

  // Test product for debugging
  const testProduct = {
    id: 999,
    name: 'منتج تجريبي للاختبار',
    price: 25.50,
    image: 'https://via.placeholder.com/150'
  };

  const handleTestAdd = () => {
    console.log('🧪 DEBUG: Adding test product to cart');
    addToCart(testProduct, 1);
  };

  const handleTestRemove = () => {
    console.log('🧪 DEBUG: Removing test product from cart');
    removeFromCart(testProduct.id);
  };

  const handleManualApiCall = async () => {
    console.log('🧪 DEBUG: Manual API call triggered');
    const result = await saveCartImmediately();
    console.log('🧪 DEBUG: Manual API call result:', result);
  };

  const handleCheckClientId = () => {
    const clientId = AbandonedCartAPI.getClientId();
    const sessionId = AbandonedCartAPI.getSessionId();
    console.log('🧪 DEBUG: Current client ID:', clientId);
    console.log('🧪 DEBUG: Current session ID:', sessionId);
    
    // Also check localStorage
    console.log('🧪 DEBUG: localStorage contents:', {
      client_id: localStorage.getItem('client_id'),
      user_id: localStorage.getItem('user_id'),
      guest_client_id: localStorage.getItem('guest_client_id')
    });
  };

  const handleClearStorage = () => {
    localStorage.removeItem('guest_client_id');
    localStorage.removeItem('client_id');
    localStorage.removeItem('session_id');
    sessionStorage.removeItem('session_id');
    console.log('🧹 All storage data cleared');
  };

  const handleDeleteAbandonedCart = async () => {
    try {
      console.log('🗑️ Testing abandoned cart deletion...');
      const result = await AbandonedCartAPI.deleteAbandonedCart();
      console.log('✅ Delete test completed:', result);
    } catch (error) {
      console.error('❌ Delete test failed:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '400px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>
        🧪 Cart API Debugger
      </h4>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Authentication Status:</strong>
          <div style={{ fontSize: '14px', color: isAuthenticated ? '#28a745' : '#dc3545' }}>
            {isAuthenticated ? `✅ Logged in as: ${user?.first_name} ${user?.last_name}` : '❌ Not logged in (Guest)'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Client ID: {getCurrentClientId()} {isUsingGuestId() ? '(Guest)' : '(Authenticated)'}
          </div>
        </div>
        
        <div>
          <strong>Cart Items: {cartItems.length}</strong>
          {cartItems.length > 0 && (
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {cartItems.map(item => (
                <li key={item.id}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={handleTestAdd}
          style={{
            padding: '8px 12px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Add Test Product
        </button>

        <button 
          onClick={handleTestRemove}
          style={{
            padding: '8px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➖ Remove Test Product
        </button>

        <button 
          onClick={handleManualApiCall}
          style={{
            padding: '8px 12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📡 Manual API Call
        </button>

        <button 
          onClick={handleCheckClientId}
          style={{
            padding: '8px 12px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔍 Check Client ID
        </button>

        <button 
        >
          🗑️ Clear Storage
        </button>

        <button 
          onClick={clearCart}
          style={{
            padding: '8px 12px',
            background: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🧹 Clear Cart
        </button>
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        💡 Check browser console for detailed logs
      </div>
    </div>
  );
};

export default CartDebugger;
