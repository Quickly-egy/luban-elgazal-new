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
  NEWSLETTER_SUBSCRIBE: 'https://app.quickly.codes/luban-elgazal/public/api/newsletter/subscribe',
  CONTACT_DATA: 'https://app.quickly.codes/luban-elgazal/public/api/contact',
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

export const newsletterAPI = {
  subscribe: async (email) => {
    try {
     
      const originalError = console.error;
      console.error = () => {};
      
      const response = await fetch(ENDPOINTS.NEWSLETTER_SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        redirect: 'follow'
      });
      

      console.error = originalError;

      const result = await response.text();
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        throw new Error("خطأ في معالجة الاستجابة من الخادم");
      }
      
      
      // اعتبار 422 كحالة نجاح لأنها تعني "البريد مسجل بالفعل" في هذا الـ API
      const isSuccess = (response.ok || response.status === 422) && (
        data.status === "success" || 
        (data.message && data.message.includes("تم الاشتراك")) ||
        (data.message && data.message.includes("already")) ||
        response.status === 422
      );
      
      if (isSuccess) {
        // تحديد نوع النجاح
        const isAlreadySubscribed = response.status === 422 || 
          (data.message && data.message.includes("already"));
        
        return { 
          success: true, 
          data,
          isAlreadySubscribed,
          message: isAlreadySubscribed ? "هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية" : "تم الاشتراك بنجاح"
        };
      } else {
        let errorMsg = "حدث خطأ في الاشتراك، يرجى المحاولة مرة أخرى";
        let isAlreadySubscribed = false;
        
        if (data.message) {
          if (data.message.includes("already")) {
            errorMsg = "هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية";
            isAlreadySubscribed = true;
          } else if (data.message.includes("invalid") || data.message.includes("email")) {
            errorMsg = "يرجى إدخال بريد إلكتروني صحيح";
          } else {
            errorMsg = data.message;
          }
        } else if (response.status === 422) {
          errorMsg = "البيانات المدخلة غير صحيحة، يرجى التحقق من البريد الإلكتروني";
        } else if (response.status === 500) {
          errorMsg = "خطأ في الخادم، يرجى المحاولة لاحقاً";
        }
        
      
        
        const error = new Error(errorMsg);
        error.isAlreadySubscribed = isAlreadySubscribed;
        throw error;
      }
    } catch (error) {

      const originalError = console.error;
      console.error = () => {};
      setTimeout(() => { console.error = originalError; }, 100);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("حدث خطأ في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى");
    }
  },
};

export const contactAPI = {
  getContactData: async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(ENDPOINTS.CONTACT_DATA, requestOptions);
      const result = await response.text();
      const data = JSON.parse(result);
      
      if (data.status === "success") {
        return { success: true, data: data.data };
      } else {
        throw new Error("فشل في جلب بيانات الاتصال");
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      throw new Error("حدث خطأ في جلب بيانات الاتصال");
    }
  },
}; 