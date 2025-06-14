import { apiService } from './api';

export const ENDPOINTS = {
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_BY_ID: (id) => `/users/${id}`,
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_CATEGORIES: '/products/categories',
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  USER_ORDERS: (userId) => `/users/${userId}/orders`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_FILE: '/upload/file',
  SEND_MESSAGE: 'https://www.quickly-app.store/api/create-message',
};

export const authAPI = {
  login: async (credentials) => {
    return await apiService.post(ENDPOINTS.LOGIN, credentials);
  },
  
  register: async (userData) => {
    return await apiService.post(ENDPOINTS.REGISTER, userData);
  },
  
  logout: async () => {
    return await apiService.post(ENDPOINTS.LOGOUT);
  },
  
  refreshToken: async () => {
    return await apiService.post(ENDPOINTS.REFRESH_TOKEN);
  },
};

export const userAPI = {
  getProfile: async () => {
    return await apiService.get(ENDPOINTS.USER_PROFILE);
  },
  
  updateProfile: async (profileData) => {
    return await apiService.put(ENDPOINTS.USER_PROFILE, profileData);
  },
  
  getUserById: async (id) => {
    return await apiService.get(ENDPOINTS.USER_BY_ID(id));
  },
  
  getAllUsers: async (params = {}) => {
    return await apiService.get(ENDPOINTS.USERS, { params });
  },
};

export const productAPI = {
  getAllProducts: async (params = {}) => {
    return await apiService.get(ENDPOINTS.PRODUCTS, { params });
  },
  
  getProductById: async (id) => {
    return await apiService.get(ENDPOINTS.PRODUCT_BY_ID(id));
  },
  
  createProduct: async (productData) => {
    return await apiService.post(ENDPOINTS.PRODUCTS, productData);
  },
  
  updateProduct: async (id, productData) => {
    return await apiService.put(ENDPOINTS.PRODUCT_BY_ID(id), productData);
  },
  
  deleteProduct: async (id) => {
    return await apiService.delete(ENDPOINTS.PRODUCT_BY_ID(id));
  },
  
  getCategories: async () => {
    return await apiService.get(ENDPOINTS.PRODUCT_CATEGORIES);
  },
};

export const orderAPI = {
  getAllOrders: async (params = {}) => {
    return await apiService.get(ENDPOINTS.ORDERS, { params });
  },
  
  getOrderById: async (id) => {
    return await apiService.get(ENDPOINTS.ORDER_BY_ID(id));
  },
  
  createOrder: async (orderData) => {
    return await apiService.post(ENDPOINTS.ORDERS, orderData);
  },
  
  updateOrder: async (id, orderData) => {
    return await apiService.put(ENDPOINTS.ORDER_BY_ID(id), orderData);
  },
  
  getUserOrders: async (userId, params = {}) => {
    return await apiService.get(ENDPOINTS.USER_ORDERS(userId), { params });
  },
};

export const uploadAPI = {
  uploadImage: async (file, onProgress = null) => {
    return await apiService.uploadFile(ENDPOINTS.UPLOAD_IMAGE, file, onProgress);
  },
  
  uploadFile: async (file, onProgress = null) => {
    return await apiService.uploadFile(ENDPOINTS.UPLOAD_FILE, file, onProgress);
  },
};

export const messageAPI = {
  sendMessage: async (messageData = {}) => {
    const defaultData = {
      appkey: 'd63fda54-06e0-4796-b75c-fe66f09eb67b',
      authkey: 'MbjnVwlk2mH3gXUDS20hvnBsATk9IAHnsEe8gqak4woSvRc5kJ',
      to: '201288266400',
      message: 'رمز استعادة كلمة المرور هو: 123456',
      sandbox: 'true'
    };
    
    const formData = new FormData();
    const data = { ...defaultData, ...messageData };
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    try {
      const response = await fetch(ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
}; 