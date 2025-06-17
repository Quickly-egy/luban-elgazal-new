import { apiService } from './api';

export const ENDPOINTS = {
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_BY_ID: (id) => `/users/${id}`,
  PRODUCTS: '/products',
  PRODUCTS_WITH_REVIEWS: '/products/with-reviews',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_CATEGORIES: '/products/categories',
  PRODUCT_REVIEWS: (productId) => `/reviews/product/${productId}`,
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  USER_ORDERS: (userId) => `/users/${userId}/orders`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CLIENT_REGISTER: '/clients/register',
  CLIENT_VERIFY: '/clients/verify-registration',
  CLIENT_RESEND_VERIFICATION: '/clients/resend-verification',
  CLIENT_REQUEST_PHONE_CHANGE: '/clients/request-phone-change',
  CLIENT_CONFIRM_PHONE_CHANGE: '/clients/confirm-phone-change',
  CLIENT_UPDATE_PROFILE: '/clients/profile',
  CLIENT_LOGOUT: '/clients/logout',
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
  
  clientRegister: async (userData) => {
    try {
      console.log('🌐 authAPI.clientRegister: بدء الإرسال');
      console.log('🎯 Endpoint:', ENDPOINTS.CLIENT_REGISTER);
      console.log('📦 Data being sent:', userData);
      console.log('🔑 Token exists?', !!localStorage.getItem('auth_token'));
      
      const response = await apiService.post(ENDPOINTS.CLIENT_REGISTER, userData);
      console.log('✅ authAPI.clientRegister: نجح الإرسال، استجابة:', response);
      return response;
    } catch (error) {
      console.error("❌ authAPI.clientRegister: خطأ في التسجيل:", error);
      console.error("❌ Full error object:", error);
      
      // Fallback to native fetch if axios fails with network error
      if (error.status === 0 || error.message?.includes('Network Error')) {
        console.log('🔄 Trying fallback with native fetch...');
        try {
          const fullUrl = `https://app.quickly.codes/luban-elgazal/public/api${ENDPOINTS.CLIENT_REGISTER}`;
          console.log('🌐 Fallback URL:', fullUrl);
          
          const fetchResponse = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            mode: 'cors', // Explicitly set CORS mode
          });
          
          console.log('📊 Fallback Response Status:', fetchResponse.status);
          console.log('📊 Fallback Response OK:', fetchResponse.ok);
          
          if (!fetchResponse.ok) {
            const errorData = await fetchResponse.text();
            console.error('❌ Fallback Response Error:', errorData);
            throw new Error(`HTTP Error ${fetchResponse.status}: ${errorData}`);
          }
          
          const responseData = await fetchResponse.json();
          console.log('✅ Fallback Success:', responseData);
          return responseData;
          
        } catch (fetchError) {
          console.error('❌ Fallback fetch failed:', fetchError);
          throw error; // Re-throw original error
        }
      }
      
      throw error;
    }
  },
  
  verifyRegistration: async (verificationData) => {
    try {
      const response = await apiService.post(ENDPOINTS.CLIENT_VERIFY, verificationData);
      return response;
    } catch (error) {
      console.error("Error in verification:", error);
      throw error;
    }
  },
  
  resendVerification: async (clientId) => {
    try {
      const response = await apiService.post(ENDPOINTS.CLIENT_RESEND_VERIFICATION, { client_id: clientId });
      return response;
    } catch (error) {
      console.error("Error in resend verification:", error);
      throw error;
    }
  },
  
  logout: async () => {
    return await apiService.post(ENDPOINTS.LOGOUT);
  },
  
  clientLogout: async () => {
    try {
      const response = await apiService.post(ENDPOINTS.CLIENT_LOGOUT);
      return response;
    } catch (error) {
      console.error("Error in client logout:", error);
      throw error;
    }
  },
  
  requestPhoneChange: async (phoneData) => {
    try {
      console.log('📱 authAPI.requestPhoneChange: طلب تغيير رقم الهاتف:', phoneData);
      const response = await apiService.post(ENDPOINTS.CLIENT_REQUEST_PHONE_CHANGE, phoneData);
      console.log('✅ authAPI.requestPhoneChange: استجابة API:', response);
      
      // Send OTP after successful phone change request
      if (response.success && response.otp && response.new_phone) {
        console.log('📱 authAPI.requestPhoneChange: إرسال OTP إلى:', response.new_phone);
        try {
          await authAPI.sendOTP(response.new_phone, response.otp);
          console.log('✅ authAPI.requestPhoneChange: تم إرسال OTP بنجاح');
        } catch (otpError) {
          console.warn('⚠️ authAPI.requestPhoneChange: فشل إرسال OTP، لكن الطلب نجح:', otpError);
          // Continue even if OTP sending fails
        }
      }
      
      return response;
    } catch (error) {
      console.error("❌ authAPI.requestPhoneChange: خطأ في طلب تغيير رقم الهاتف:", error);
      throw error;
    }
  },
  
  confirmPhoneChange: async (otpData) => {
    try {
      const response = await apiService.post(ENDPOINTS.CLIENT_CONFIRM_PHONE_CHANGE, otpData);
      return response;
    } catch (error) {
      console.error("Error in confirm phone change:", error);
      throw error;
    }
  },
  
  updateClientProfile: async (profileData) => {
    try {
      console.log('👤 authAPI.updateClientProfile: تحديث بيانات العميل:', profileData);
      console.log('🎯 Endpoint:', ENDPOINTS.CLIENT_UPDATE_PROFILE);
      console.log('🔑 Token exists?', !!localStorage.getItem('auth_token'));
      
      const response = await apiService.post(ENDPOINTS.CLIENT_UPDATE_PROFILE, profileData);
      console.log('✅ authAPI.updateClientProfile: نجح التحديث، استجابة:', response);
      return response;
    } catch (error) {
      console.error("❌ authAPI.updateClientProfile: خطأ في تحديث البروفايل:", error);
      throw error;
    }
  },
  
  sendOTP: async (phone, verificationCode) => {
    try {
      console.log('📱 authAPI.sendOTP: إرسال OTP إلى:', phone);
      console.log('🔢 Verification Code:', verificationCode);
      
      const formData = new FormData();
      formData.append("appkey", "0f49bdae-7f33-4cbc-a674-36b10dc4be4a");
      formData.append("authkey", "ytuCW4d3ljpURtKQtzePxtht1JuZ1BMgUcuUZUsODn6zkO703e");
      formData.append("to", phone);
      formData.append("message", `رمز التحقق هو: ${verificationCode}`);
      formData.append("sandbox", "false");
      
      const response = await fetch("https://www.quickly-app.store/api/create-message", {
        method: "POST",
        body: formData,
        redirect: "follow"
      });
      
      const result = await response.text();
      console.log('📱 authAPI.sendOTP: استجابة:', result);
      
      if (!response.ok) {
        throw new Error(`OTP sending failed: ${result}`);
      }
      
      return { success: true, message: 'تم إرسال رمز التحقق بنجاح', response: result };
    } catch (error) {
      console.error("❌ authAPI.sendOTP: خطأ في إرسال OTP:", error);
      throw error;
    }
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
  
  getProductsWithReviews: async (params = {}) => {
    try {
      const response = await apiService.get(ENDPOINTS.PRODUCTS_WITH_REVIEWS, { params });
      return response;
    } catch (error) {
      console.error("Error fetching products with reviews:", error);
      throw error;
    }
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

export const reviewsAPI = {
  getProductReviews: async (productId) => {
    try {
      const response = await apiService.get(ENDPOINTS.PRODUCT_REVIEWS(productId));
      return response;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      throw error;
    }
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