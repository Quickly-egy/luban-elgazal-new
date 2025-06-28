import axios from "axios";

const BASE_URL = "https://app.quickly.codes/luban-elgazal/public/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Explicitly set for CORS
});

api.interceptors.request.use(
  (config) => {
    // Don't add Authorization header for registration endpoints
    const isRegistrationEndpoint =
      config.url?.includes("/clients/register") ||
      config.url?.includes("/clients/verify-registration") ||
      config.url?.includes("/clients/resend-verification");

    if (!isRegistrationEndpoint) {
      const token = localStorage.getItem("auth_token");
      console.log("🔐 Token من localStorage:", token ? "موجود" : "غير موجود");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ تم إضافة Authorization header");
      } else {
        console.log("❌ لا يوجد token - لن يتم إضافة Authorization header");
      }
    } else {
      console.log(
        "🚫 Registration endpoint detected - skipping Authorization header"
      );
    }

    const language = localStorage.getItem("language") || "ar";
    config.headers["Accept-Language"] = language;

    console.log("🚀 Request sent:", config.method?.toUpperCase(), config.url);
    console.log("📋 Headers:", config.headers);
    console.log("📦 Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    console.log("📋 Response Headers:", response.headers);
    console.log("📦 Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      // Don't redirect automatically, let the app handle it
    } else if (error.response?.status === 403) {
      console.error("Access denied");
    } else if (error.response?.status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      console.log("🔥 ApiService POST: URL =", url, ", Data =", data);
      console.log(
        "🔥 ApiService POST: Full URL =",
        `${api.defaults.baseURL}${url}`
      );
      console.log("🔥 ApiService POST: Config =", config);
      const response = await api.post(url, data, config);
      console.log("🔥 ApiService POST Response Status:", response.status);
      console.log("🔥 ApiService POST Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.log("🔥 ApiService POST Error Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
      console.log("🔥 ApiService POST Full Error:", error);
      throw handleApiError(error);
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadFile: async (url, file, onUploadProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

const handleApiError = (error) => {
  console.log("🔍 handleApiError called with:", error);

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    console.log("📊 Response error - Status:", status, "Data:", data);

    let message = "حدث خطأ في الخادم";

    // Handle specific status codes
    if (status === 201) {
      // 201 is actually success for registration
      console.log("✅ Status 201 - Registration successful");
      return data; // Return data instead of error
    } else if (status === 422 && data?.errors) {
      message = "توجد أخطاء في البيانات المدخلة";
    } else if (status === 401) {
      message = "غير مصرح لك بالوصول";
    } else if (status === 403) {
      message = "ممنوع الوصول";
    } else if (status === 404) {
      message = "الصفحة غير موجودة";
    } else if (status === 500) {
      message = "خطأ في الخادم الداخلي";
    } else if (data?.message) {
      message = data.message;
    }

    return {
      message,
      status,
      data,
      errors: data?.errors,
    };
  } else if (error.request) {
    // Network error
    console.log("🌐 Network error:", error.request);
    return {
      message: "لا يمكن الوصول للخادم - تحقق من الاتصال بالإنترنت",
      status: 0,
      data: null,
    };
  } else {
    // Other error
    console.log("❓ Other error:", error.message);
    return {
      message: error.message || "حدث خطأ غير متوقع",
      status: 0,
      data: null,
    };
  }
};

export const authUtils = {
  setToken: (token) => {
    localStorage.setItem("auth_token", token);
  },

  getToken: () => {
    return localStorage.getItem("auth_token");
  },

  removeToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token");
  },
};

// Products API functions
export const productsAPI = {
  getProducts: async (params = {}) => {
    try {
      const response = await apiService.get("/products", { params });
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  searchProducts: async (searchTerm, params = {}) => {
    try {
      const searchParams = {
        search: searchTerm,
        ...params,
      };
      const response = await apiService.get("/products/with-reviews", {
        params: searchParams,
      });
      return response;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await apiService.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await apiService.get("/product-categories/with-stock");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

// Tickets API functions
export const ticketsAPI = {
  getTickets: async (params = {}) => {
    try {
      const response = await apiService.get("/tickets", { params });
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await apiService.post("/tickets", ticketData);
      return response;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  getTicket: async (id) => {
    try {
      const response = await apiService.get(`/tickets/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },
};

export const handlePaymentError = (error, navigate) => {
  let errorMessage = "";
  let orderDetails = null;

  if (error.response) {
    // خطأ من الخادم مع رد
    switch (error.response.status) {
      case 400:
        errorMessage = "بيانات الدفع غير صحيحة";
        break;
      case 401:
        errorMessage = "يرجى تسجيل الدخول مرة أخرى";
        break;
      case 402:
        errorMessage = "فشل في عملية الدفع - يرجى التحقق من بيانات البطاقة";
        break;
      case 403:
        errorMessage = "غير مصرح لك بإجراء هذه العملية";
        break;
      case 404:
        errorMessage = "لم يتم العثور على معلومات الطلب";
        break;
      case 500:
        errorMessage = "خطأ في الخادم - يرجى المحاولة مرة أخرى لاحقاً";
        break;
      default:
        errorMessage = "حدث خطأ أثناء عملية الدفع";
    }
    orderDetails = error.response.data?.order;
  } else if (error.request) {
    // لم يتم تلقي رد من الخادم
    errorMessage = "لا يمكن الاتصال بالخادم - يرجى التحقق من اتصال الإنترنت";
  } else {
    // خطأ في إعداد الطلب
    errorMessage = "حدث خطأ أثناء إعداد عملية الدفع";
  }

  navigate("/payment-failed", {
    state: {
      errorMessage,
      orderDetails,
    },
  });
};

export default api;
