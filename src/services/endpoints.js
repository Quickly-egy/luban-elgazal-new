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