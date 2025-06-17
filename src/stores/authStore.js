import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from '../services/endpoints';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Pending registration data (for OTP verification)
      pendingRegistration: null,
      
      // Initialize from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            get().logout();
          }
        }
      },
      
      // Register new client
      register: async (userData) => {
        console.log('🏪 AuthStore: بدء register مع userData:', userData);
        set({ isLoading: true, error: null });
        
        try {
          // Prepare data for API
          const registrationData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            country: userData.country || 'مصر',
            password: userData.password,
            gender: userData.gender || 'male'
          };
          
          console.log('📤 AuthStore: إرسال registrationData:', registrationData);
          const response = await authAPI.clientRegister(registrationData);
          console.log('✅ AuthStore: استجابة API:', response);
          
          // Send OTP after successful registration
          console.log('📱 AuthStore: إرسال OTP...');
          try {
            await authAPI.sendOTP(response.phone, response.verification_code);
            console.log('✅ AuthStore: تم إرسال OTP بنجاح');
          } catch (otpError) {
            console.warn('⚠️ AuthStore: فشل إرسال OTP، لكن التسجيل نجح:', otpError);
            // Continue even if OTP sending fails
          }
          
          // Store pending registration data for OTP verification
          set({
            pendingRegistration: {
              client_id: response.client_id,
              phone: response.phone,
              verification_code: response.verification_code,
              expires_at: response.expires_at,
              userData: registrationData
            },
            isLoading: false,
            error: null
          });
          
          return {
            success: true,
            message: response.message,
            client_id: response.client_id,
            phone: response.phone,
            verification_code: response.verification_code,
            note: response.note
          };
          
            } catch (error) {
      console.error('❌ AuthStore register error:', error);
      console.error('❌ Error status:', error.status);
      console.error('❌ Error data:', error.data);
      console.error('❌ Error message:', error.message);
      set({ isLoading: false });
      
      // Handle validation errors (422)
      if (error.status === 422 && (error.data?.errors || error.errors)) {
        console.log('🔍 AuthStore: validation errors detected:', error.data?.errors || error.errors);
        const validationErrors = error.data?.errors || error.errors;
        const errorObj = { validationErrors };
        set({ error: null });
        throw errorObj;
      }
      
      // Handle other errors
      const errorMessage = error.data?.message || error.message || 'حدث خطأ في التسجيل';
      console.error('💥 AuthStore: throwing error message:', errorMessage);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
      },
      
      // Verify registration with OTP
      verifyRegistration: async (verificationCode) => {
        const { pendingRegistration } = get();
        
        if (!pendingRegistration) {
          throw new Error('لا توجد عملية تسجيل معلقة');
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const verificationData = {
            client_id: pendingRegistration.client_id,
            verification_code: verificationCode
          };
          
          const response = await authAPI.verifyRegistration(verificationData);
          
          // Store user data and token
          const { client, token } = response;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(client));
          
          set({
            user: client,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            pendingRegistration: null
          });
          
          return {
            success: true,
            message: response.message,
            user: client
          };
          
        } catch (error) {
          const errorMessage = error.data?.message || error.message || 'كود التحقق غير صحيح';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Resend verification code
      resendVerification: async () => {
        const { pendingRegistration } = get();
        
        if (!pendingRegistration) {
          throw new Error('لا توجد عملية تسجيل معلقة');
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.resendVerification(pendingRegistration.client_id);
          
          set({ isLoading: false, error: null });
          
          return {
            success: true,
            message: response.message || 'تم إعادة إرسال الكود بنجاح'
          };
          
        } catch (error) {
          const errorMessage = error.data?.message || error.message || 'فشل في إعادة إرسال الكود';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Login (if needed later)
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.login(credentials);
          
          // Store user data and token
          const { user, token } = response;
          
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true, user };
          
        } catch (error) {
          const errorMessage = error.data?.message || error.message || 'فشل تسجيل الدخول';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Logout
      logout: async () => {
        const { token } = get();
        
        // If we have a token, try to logout from server
        if (token) {
          try {
            await authAPI.clientLogout();
          } catch (error) {
            console.error('Error during server logout:', error);
            // Continue with local logout even if server logout fails
          }
        }
        
        // Clear local storage and state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          pendingRegistration: null
        });
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      },
      
      // Clear pending registration
      clearPendingRegistration: () => {
        set({ pendingRegistration: null });
      },

      // Request phone change
      requestPhoneChange: async (newPhone) => {
        console.log('🏪 AuthStore: بدء requestPhoneChange مع الرقم:', newPhone);
        set({ isLoading: true, error: null });
        
        try {
          console.log('🌐 AuthStore: استدعاء authAPI.requestPhoneChange...');
          const response = await authAPI.requestPhoneChange({ new_phone: newPhone });
          console.log('✅ AuthStore: نجح استدعاء API، الاستجابة:', response);
          
          set({
            isLoading: false,
            error: null
          });
          
          return {
            success: true,
            message: response.message || 'تم إرسال رمز التحقق إلى رقمك الجديد',
            data: response
          };
          
        } catch (error) {
          set({ isLoading: false });
          
          // Handle validation errors (422)
          if (error.status === 422 && error.data?.errors) {
            const validationErrors = error.data.errors;
            const errorObj = { validationErrors };
            set({ error: null });
            throw errorObj;
          }
          
          // Handle other errors
          const errorMessage = error.data?.message || error.message || 'حدث خطأ في طلب تغيير رقم الهاتف';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Confirm phone change
      confirmPhoneChange: async (otp) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.confirmPhoneChange({ otp });
          
          // Update user phone in state and localStorage
          const updatedUser = { ...get().user, phone: response.new_phone || response.phone };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          });
          
          return {
            success: true,
            message: response.message || 'تم تغيير رقم الهاتف بنجاح',
            user: updatedUser
          };
          
        } catch (error) {
          set({ isLoading: false });
          
          // Handle validation errors (422)
          if (error.status === 422 && error.data?.errors) {
            const validationErrors = error.data.errors;
            const errorObj = { validationErrors };
            set({ error: null });
            throw errorObj;
          }
          
          // Handle other errors
          const errorMessage = error.data?.message || error.message || 'حدث خطأ في تأكيد تغيير رقم الهاتف';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Update client profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Prepare data for API (only editable fields)
          const updateData = {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email,
            country: profileData.country,
            gender: profileData.gender
          };
          
          const response = await authAPI.updateClientProfile(updateData);
          
          // Update user data in state and localStorage
          const updatedUser = { ...get().user, ...response.client };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          });
          
          return {
            success: true,
            message: response.message || 'تم تحديث البيانات بنجاح',
            user: updatedUser
          };
          
        } catch (error) {
          set({ isLoading: false });
          
          // Handle validation errors (422)
          if (error.status === 422 && error.data?.errors) {
            const validationErrors = error.data.errors;
            const errorObj = { validationErrors };
            set({ error: null });
            throw errorObj;
          }
          
          // Handle other errors
          const errorMessage = error.data?.message || error.message || 'حدث خطأ في تحديث البيانات';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: "auth-storage", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
