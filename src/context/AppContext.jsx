import React, { createContext, useContext, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  language: 'ar',
  theme: 'light',
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage('user', null);
  const [storedCart, setStoredCart] = useLocalStorage('cart', []);

  const setUser = (user) => {
    setStoredUser(user);
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    setStoredUser(null);
    dispatch({ type: 'LOGOUT' });
  };

  const addToCart = (product) => {
    const updatedCart = [...state.cart, product];
    setStoredCart(updatedCart);
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    const updatedCart = state.cart.filter(item => item.id !== productId);
    setStoredCart(updatedCart);
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    setStoredCart([]);
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    ...state,
    setUser,
    logout,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 