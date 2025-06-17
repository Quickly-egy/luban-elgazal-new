import axios from "axios";

const BASE_URL = "https://app.quickly.codes/luban-elgazal/public/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    console.log("🔐 Token من localStorage:", token ? "موجود" : "غير موجود");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ تم إضافة Authorization header");
    } else {
      console.log("❌ لا يوجد token - لن يتم إضافة Authorization header");
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
      console.log('🔥 ApiService POST: URL =', url, ', Data =', data);
      const response = await api.post(url, data, config);
      console.log('🔥 ApiService POST Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('🔥 ApiService POST Error:', error);
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
  if (error.response) {
    return {
      message: error.response.data?.message || "حدث خطأ في الخادم",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: "لا يمكن الوصول للخادم",
      status: 0,
      data: null,
    };
  } else {
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
      const response = await apiService.get("/products", {
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
      const response = await apiService.get("/categories");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

export default api;
