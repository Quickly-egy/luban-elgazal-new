import { data } from "react-router-dom";
import { apiService } from "./api";

export const ENDPOINTS = {
  USERS: "/users",
  USER_PROFILE: "/users/profile",
  USER_BY_ID: (id) => `/users/${id}`,
  PRODUCTS: "/products",
  PRODUCTS_SEARCH: "/products",
PRODUCTS_WITH_REVIEWS: "/products/with-reviews",
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_CATEGORIES: "/products/categories",
  PRODUCT_REVIEWS: (productId) => `/reviews/${productId}`,
  ORDERS: "/orders",
  ORDER_BY_ID: (id) => `/orders/${id}`,
  USER_ORDERS: (userId) => `/users/${userId}/orders`,
  LOGIN: "/auth/login",
  CLIENT_LOGIN: "/clients/login-with-2fa",
  REGISTER: "/auth/register",
  CLIENT_REGISTER: "/clients/register",
  CLIENT_VERIFY: "/clients/verify-registration",
  CLIENT_RESEND_VERIFICATION: "/clients/resend-verification",
  CLIENT_REQUEST_PHONE_CHANGE: "/clients/request-phone-change",
  CLIENT_CONFIRM_PHONE_CHANGE: "/clients/confirm-phone-change",
  CLIENT_UPDATE_PROFILE: "/clients/profile",
  CLIENT_CHANGE_PASSWORD: "/clients/change-password",
  CLIENT_FORGOT_PASSWORD: "/clients/forgot-password",
  CLIENT_RESET_PASSWORD: "/clients/reset-password",
  CLIENT_LOGOUT: "/clients/logout",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_FILE: "/upload/file",
  SEND_MESSAGE: "https://www.quickly-app.store/api/create-message",
  NEWSLETTER_SUBSCRIBE:
    "https://app.quickly.codes/luban-elgazal/public/api/newsletter/subscribe",
  CONTACT_DATA: "https://app.quickly.codes/luban-elgazal/public/api/contact",
  TICKETS: "/tickets",
  TICKET_BY_ID: (id) => `/tickets/${id}`,
  TICKET_MESSAGES: (id) => `/tickets/${id}/messages`,
};

// Addresses endpoints
export const ADDRESSES = {
  LIST: "/client/addresses",
  CREATE: "/client/addresses",
  UPDATE: (id) => `/client/addresses/${id}`,
  DELETE: (id) => `/client/addresses/${id}`,
};
const WHATSAPP_CONFIG = {
  API_URL: 'https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6',
  TRACKING_BASE_URL: 'https://luban-alghazal.com/tracking/'
};
// Addresses Endpoints
export const ADDRESSES_ENDPOINTS = {
  CREATE: "https://app.quickly.codes/luban-elgazal/public/api/client/addresses",
  LIST: "https://app.quickly.codes/luban-elgazal/public/api/client/addresses",
  UPDATE: (id) =>
    `https://app.quickly.codes/luban-elgazal/public/api/client/addresses/${id}`,
  DELETE: (id) =>
    `https://app.quickly.codes/luban-elgazal/public/api/client/addresses/${id}`,
};

export const authAPI = {
  login: async (credentials) => {
    return await apiService.post(ENDPOINTS.LOGIN, credentials);
  },

  clientLogin: async (credentials) => {
    try {
   

      const response = await apiService.post(
        ENDPOINTS.CLIENT_LOGIN,
        credentials
      );
     
      
      return response;
    } catch (error) {
      
      
      throw error;
    }
  },

  register: async (userData) => {
    return await apiService.post(ENDPOINTS.REGISTER, userData);
  },

  clientRegister: async (userData) => {
    try {
    

      const response = await apiService.post(
        ENDPOINTS.CLIENT_REGISTER,
        userData
      );
      return response;
    } catch (error) {

      // Fallback to native fetch if axios fails with network error
      if (error.status === 0 || error.message?.includes("Network Error")) {
        try {
          const fullUrl = `https://app.quickly.codes/luban-elgazal/public/api${ENDPOINTS.CLIENT_REGISTER}`;

          const fetchResponse = await fetch(fullUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            mode: "cors", // Explicitly set CORS mode
          });

       

          if (!fetchResponse.ok) {
            const errorData = await fetchResponse.text();
          
            throw new Error(`HTTP Error ${fetchResponse.status}: ${errorData}`);
          }

          const responseData = await fetchResponse.json();
        
          return responseData;
        } catch (fetchError) {
         
          throw error; // Re-throw original error
        }
      }

      throw error;
    }
  },

  verifyRegistration: async (verificationData) => {
    try {
      const response = await apiService.post(
        ENDPOINTS.CLIENT_VERIFY,
        verificationData
      );
      return response;
    } catch (error) {

      throw error;
    }
  },

  resendVerification: async (clientId) => {
    try {
      const response = await apiService.post(
        ENDPOINTS.CLIENT_RESEND_VERIFICATION,
        { client_id: clientId }
      );
      return response;
    } catch (error) {

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
     
      throw error;
    }
  },

  requestPhoneChange: async (phoneData) => {
    try {
    
      const response = await apiService.post(
        ENDPOINTS.CLIENT_REQUEST_PHONE_CHANGE,
        phoneData
      );
   

      // Send OTP after successful phone change request
      if (response.success && response.otp && response.new_phone) {
      
        try {
          await authAPI.sendOTP(response.new_phone, response.otp);
         
        } catch (otpError) {
          
          // Continue even if OTP sending fails
        }
      }

      return response;
    } catch (error) {
    
      throw error;
    }
  },

  confirmPhoneChange: async (otpData) => {
    try {
      const response = await apiService.post(
        ENDPOINTS.CLIENT_CONFIRM_PHONE_CHANGE,
        otpData
      );
      return response;
    } catch (error) {
     
      throw error;
    }
  },

  updateClientProfile: async (profileData) => {
    try {
   

      const response = await apiService.post(
        ENDPOINTS.CLIENT_UPDATE_PROFILE,
        profileData
      );
      
      return response;
    } catch (error) {
      
      throw error;
    }
  },

 
  sendOTP: async (phone, verificationCode) => {
    try {


      const url = 'https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6';

      const data = {
        chatId: `${phone}@c.us`,
        message: `رمز التحقق الخاص بك هو: ${verificationCode}`,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
    

      if (!response.ok) {
        throw new Error(`OTP sending failed: ${JSON.stringify(result)}`);
      }

      return {
        success: true,
        message: "تم إرسال رمز التحقق بنجاح",
        response: result,
      };
    } catch (error) {

      throw error;
    }
},


sendOrderConfirmation: async (customerData) => {
  try {
    const url = 'https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6';

    // تكوين رسالة تأكيد الطلب


    const data = {
      chatId: `201128893835@c.us`,
      message: message,
    };


    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Order confirmation sending failed: ${JSON.stringify(result)}`);
    }

    return {
      success: true,
      message: "تم إرسال رسالة تأكيد الطلب بنجاح",
      response: result,
    };
  } catch (error) {
    console.error('❌ Error sending order confirmation:', error);
    throw error;
  }
},


  sendNotification: async (phone, message) => {
    try {
   
      const formData = new FormData();
      formData.append("appkey", "0f49bdae-7f33-4cbc-a674-36b10dc4be4a");
      formData.append(
        "authkey",
        "ytuCW4d3ljpURtKQtzePxtht1JuZ1BMgUcuUZUsODn6zkO703e"
      );
      formData.append("to", phone);
      formData.append("message", message);
      formData.append("sandbox", "false");

      const response = await fetch(
        "https://www.quickly-app.store/api/create-message",
        {
          method: "POST",
          body: formData,
          redirect: "follow",
        }
      );

      const result = await response.text();
    

      if (!response.ok) {
        throw new Error(`Notification sending failed: ${result}`);
      }

      return {
        success: true,
        message: "تم إرسال التنبيه بنجاح",
        response: result,
      };
    } catch (error) {

      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
    

      const response = await apiService.post(
        ENDPOINTS.CLIENT_CHANGE_PASSWORD,
        passwordData
      );
    
      return response;
    } catch (error) {
     
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
     

      const response = await apiService.post(ENDPOINTS.CLIENT_FORGOT_PASSWORD, {
        email,
      });
     
      return response;
    } catch (error) {
     
      throw error;
    }
  },

  resetPassword: async (resetData) => {
    try {
     
      const response = await apiService.post(
        ENDPOINTS.CLIENT_RESET_PASSWORD,
        resetData
      );
    
      return response;
    } catch (error) {
     
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
  try {
   
    // إرسال الـ request إلى الـ API
    const response = await apiService.get(ENDPOINTS.PRODUCTS, { params });

    
    // تأكد من أن البيانات التي تحتاجها موجودة
    if (response.data) {
      return response.data;  // يجب أن تعود بالبيانات المطلوبة مثل المنتجات
    }

    throw new Error("No products found in the response.");

  } catch (error) {
    

    // يمكنك إرسال رسالة خطأ مخصصة هنا أو إظهارها في الواجهة
    throw new Error("Failed to fetch products. Please try again later.");
  }
},

  getProductsWithReviews: async (page=1) => {
    try {
const url = `${ENDPOINTS.PRODUCTS_WITH_REVIEWS}?page=${page}`;
       const response = await apiService.get(url);
       
       // 📋 طباعة response الـ API الخاص بجلب المنتجات مع التقييمات

     
      if (response?.data) {
        // Return both products and packages
        return {
          success: true,
          data: {
            products: response.data.products || { data: [] },
            packages: response.data.packages || []
          }
        };
      }

      // If we don't have the expected structure, return empty arrays
      return {
        success: false,
        data: {
          products: { data: [] },
          packages: []
        },
        message: "No data found in response"
      };
    } catch (error) {

      throw error;
    }
  },

 

  createProduct: async (productData) => {
    try {
     
      const response = await apiService.post(ENDPOINTS.PRODUCTS, productData);
    
      return response;
    } catch (error) {

      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {

      const response = await apiService.put(
        ENDPOINTS.PRODUCT_BY_ID(id),
        productData
      );
    
      return response;
    } catch (error) {

      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
    
      const response = await apiService.delete(ENDPOINTS.PRODUCT_BY_ID(id));
 
      return response;
    } catch (error) {
   
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.PRODUCT_CATEGORIES);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const reviewsAPI = {
  getProductReviews: async (productId) => {
    try {
      const response = await apiService.get(
        ENDPOINTS.PRODUCT_REVIEWS(productId)
      );
      return response;
    } catch (error) {

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
    return await apiService.uploadFile(
      ENDPOINTS.UPLOAD_IMAGE,
      file,
      onProgress
    );
  },

  uploadFile: async (file, onProgress = null) => {
    return await apiService.uploadFile(ENDPOINTS.UPLOAD_FILE, file, onProgress);
  },
};

export const messageAPI = {
  sendMessage: async (messageData = {}) => {
    const defaultData = {
      appkey: "d63fda54-06e0-4796-b75c-fe66f09eb67b",
      authkey: "MbjnVwlk2mH3gXUDS20hvnBsATk9IAHnsEe8gqak4woSvRc5kJ",
      to: "201288266400",
      message: "رمز استعادة كلمة المرور هو: 123456",
      sandbox: "true",
    };

    const formData = new FormData();
    const data = { ...defaultData, ...messageData };

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      const response = await fetch(ENDPOINTS.SEND_MESSAGE, {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      return result;
    } catch (error) {
  
      throw error;
    }
  },
};

export const newsletterAPI = {
  subscribe: async (email) => {
    try {
      const originalError = console.error;
    

      const response = await fetch(ENDPOINTS.NEWSLETTER_SUBSCRIBE, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        redirect: "follow",
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
      const isSuccess =
        (response.ok || response.status === 422) &&
        (data.status === "success" ||
          (data.message && data.message.includes("تم الاشتراك")) ||
          (data.message && data.message.includes("already")) ||
          response.status === 422);

      if (isSuccess) {
        // تحديد نوع النجاح
        const isAlreadySubscribed =
          response.status === 422 ||
          (data.message && data.message.includes("already"));

        return {
          success: true,
          data,
          isAlreadySubscribed,
          message: isAlreadySubscribed
            ? "هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية"
            : "تم الاشتراك بنجاح",
        };
      } else {
        let errorMsg = "حدث خطأ في الاشتراك، يرجى المحاولة مرة أخرى";
        let isAlreadySubscribed = false;

        if (data.message) {
          if (data.message.includes("already")) {
            errorMsg = "هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية";
            isAlreadySubscribed = true;
          } else if (
            data.message.includes("invalid") ||
            data.message.includes("email")
          ) {
            errorMsg = "يرجى إدخال بريد إلكتروني صحيح";
          } else {
            errorMsg = data.message;
          }
        } else if (response.status === 422) {
          errorMsg =
            "البيانات المدخلة غير صحيحة، يرجى التحقق من البريد الإلكتروني";
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
      setTimeout(() => {
        console.error = originalError;
      }, 100);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "حدث خطأ في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى"
      );
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
        redirect: "follow",
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
      throw new Error("حدث خطأ في جلب بيانات الاتصال");
    }
  },
};

export const ticketsAPI = {
  createTicket: async (ticketData, files = [], retryCount = 0) => {
    const maxRetries = 2; // أقصى عدد إعادة محاولات

    try {
     
   

      // Get token from localStorage or store
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error(
          "UNAUTHORIZED: لا يوجد رمز دخول، يرجى تسجيل الدخول مرة أخرى"
        );
      }

    

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const formdata = new FormData();
      formdata.append("subject", ticketData.subject);
      formdata.append("message", ticketData.message);
      formdata.append("priority", ticketData.priority);
      
      // إضافة الملفات المرفقة
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formdata.append(`attachments[${index}]`, file);
        });
      }

      // إضافة timeout للطلب (أقل من المعتاد للمحاولة الأولى)
      const timeoutDuration = retryCount === 0 ? 15000 : 30000; // 15s للأولى، 30s للثانية
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
        signal: controller.signal,
      };

    
      const response = await fetch(
        "https://app.quickly.codes/luban-elgazal/public/api/client/tickets",
        requestOptions
      );

      clearTimeout(timeoutId);

     

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 401) {
          throw new Error(
            "UNAUTHORIZED: انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"
          );
        } else if (response.status === 422) {
          throw new Error(
            "VALIDATION: البيانات المدخلة غير صحيحة، يرجى التحقق من البيانات"
          );
        } else if (response.status === 500) {
          throw new Error("SERVER_ERROR: خطأ في الخادم، يرجى المحاولة لاحقاً");
        } else {
          throw new Error(`HTTP_ERROR: خطأ في الاتصال (${response.status})`);
        }
      }

      const result = await response.json();
  

      return result;
    } catch (error) {
     

      // تحديد ما إذا كان يجب إعادة المحاولة
      const shouldRetry =
        retryCount < maxRetries &&
        (error.name === "AbortError" ||
          error.message.includes("NetworkError") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_CONNECTION_TIMED_OUT") ||
          error.message.includes("HTTP_ERROR"));

      if (shouldRetry) {
      
        // انتظار قليل قبل إعادة المحاولة
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return await ticketsAPI.createTicket(ticketData, retryCount + 1);
      }

      // معالجة أنواع الأخطاء المختلفة
      if (error.name === "AbortError") {
        throw new Error(
          "TIMEOUT: انتهت مهلة الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى"
        );
      } else if (
        error.message.includes("CORS") ||
        error.message.includes("blocked by CORS policy")
      ) {
        throw new Error("CORS_ERROR: مشكلة في الأمان، يرجى المحاولة لاحقاً");
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "NETWORK_ERROR: خطأ في الشبكة، يرجى التحقق من الإنترنت والمحاولة مرة أخرى"
        );
      } else if (error.message.includes("ERR_CONNECTION_TIMED_OUT")) {
        throw new Error(
          "CONNECTION_TIMEOUT: انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى"
        );
      } else if (error.message.startsWith("UNAUTHORIZED")) {
        throw new Error(
          "UNAUTHORIZED: انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"
        );
      } else if (error.message.startsWith("VALIDATION")) {
        throw new Error(
          "VALIDATION: البيانات المدخلة غير صحيحة، يرجى التحقق من البيانات"
        );
      } else if (error.message.startsWith("SERVER_ERROR")) {
        throw new Error("SERVER_ERROR: خطأ في الخادم، يرجى المحاولة لاحقاً");
      } else {
        throw error;
      }
    }
  },

// البدايه












// النهايه












  getTickets: async (filters = {}) => {
    try {


      // Get token from localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error(
          "UNAUTHORIZED: لا يوجد رمز دخول، يرجى تسجيل الدخول مرة أخرى"
        );
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");
      
      // بناء query parameters
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.per_page) params.append('per_page', filters.per_page);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const url = `https://app.quickly.codes/luban-elgazal/public/api/client/tickets${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {


        if (response.status === 401) {
          throw new Error(
            "UNAUTHORIZED: انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"
          );
        } else if (response.status === 500) {
          throw new Error("SERVER_ERROR: خطأ في الخادم، يرجى المحاولة لاحقاً");
        } else {
          throw new Error(`HTTP_ERROR: خطأ في الاتصال (${response.status})`);
        }
      }

      const result = await response.json();


      return result;
    } catch (error) {

      throw error;
    }
  },

  getTicketById: async (id) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error(
          "UNAUTHORIZED: لا يوجد رمز دخول، يرجى تسجيل الدخول مرة أخرى"
        );
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://app.quickly.codes/luban-elgazal/public/api/client/tickets/${id}`,
        requestOptions
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "UNAUTHORIZED: انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"
          );
        } else if (response.status === 404) {
          throw new Error("التذكرة غير موجودة");
        } else if (response.status === 500) {
          throw new Error("SERVER_ERROR: خطأ في الخادم، يرجى المحاولة لاحقاً");
        } else {
          throw new Error(`HTTP_ERROR: خطأ في الاتصال (${response.status})`);
        }
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (ticketId, messageText, files = []) => {
    try {


      // Get token from localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error(
          "UNAUTHORIZED: لا يوجد رمز دخول، يرجى تسجيل الدخول مرة أخرى"
        );
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const formdata = new FormData();
      formdata.append("message", messageText);
      
      // إضافة الملفات المرفقة
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formdata.append(`attachments[${index}]`, file);
        });
      }

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

    
      const response = await fetch(
        `https://app.quickly.codes/luban-elgazal/public/api/client/tickets/${ticketId}/messages`,
        requestOptions
      );

      if (!response.ok) {


        if (response.status === 401) {
          throw new Error(
            "UNAUTHORIZED: انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"
          );
        } else if (response.status === 422) {
          throw new Error(
            "VALIDATION: البيانات المدخلة غير صحيحة، يرجى التحقق من الرسالة"
          );
        } else if (response.status === 500) {
          throw new Error("SERVER_ERROR: خطأ في الخادم، يرجى المحاولة لاحقاً");
        } else {
          throw new Error(`HTTP_ERROR: خطأ في الاتصال (${response.status})`);
        }
      }

      const result = await response.json();


      return result;
    } catch (error) {

      throw error;
    }
  },
};

