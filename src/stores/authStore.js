import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/endpoints";

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
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            get().logout();
          }
        }
      },

      // Register new client
      register: async (userData) => {
        console.log("🏪 AuthStore: بدء register مع userData:", userData);
        set({ isLoading: true, error: null });

        try {
          // Prepare data for API
          const registrationData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            country: userData.country || "مصر",
            password: userData.password,
            gender: userData.gender || "male",
          };

          console.log(
            "📤 AuthStore: إرسال registrationData:",
            registrationData
          );
          const response = await authAPI.clientRegister(registrationData);
          console.log("✅ AuthStore: استجابة API:", response);

          // Send OTP after successful registration
          console.log("📱 AuthStore: إرسال OTP...");
          try {
            await authAPI.sendOTP(response.phone, response.verification_code);
            console.log("✅ AuthStore: تم إرسال OTP بنجاح");
          } catch (otpError) {
            console.warn(
              "⚠️ AuthStore: فشل إرسال OTP، لكن التسجيل نجح:",
              otpError
            );
            // Continue even if OTP sending fails
          }

          // Store pending registration data for OTP verification
          set({
            pendingRegistration: {
              client_id: response.client_id,
              phone: response.phone,
              verification_code: response.verification_code,
              expires_at: response.expires_at,
              userData: registrationData,
            },
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message,
            client_id: response.client_id,
            phone: response.phone,
            verification_code: response.verification_code,
            note: response.note,
          };
        } catch (error) {
          console.error("❌ AuthStore register error:", error);
          console.error("❌ Error status:", error.status);
          console.error("❌ Error data:", error.data);
          console.error("❌ Error message:", error.message);
          set({ isLoading: false });

          // Handle validation errors (422)
          if (error.status === 422 && (error.data?.errors || error.errors)) {
            console.log(
              "🔍 AuthStore: validation errors detected:",
              error.data?.errors || error.errors
            );
            const validationErrors = error.data?.errors || error.errors;
            const errorObj = { validationErrors };
            set({ error: null });
            throw errorObj;
          }

          // Handle other errors
          const errorMessage =
            error.data?.message || error.message || "حدث خطأ في التسجيل";
          console.error("💥 AuthStore: throwing error message:", errorMessage);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Verify registration with OTP
      verifyRegistration: async (verificationCode) => {
        const { pendingRegistration } = get();

        if (!pendingRegistration) {
          throw new Error("لا توجد عملية تسجيل معلقة");
        }

        set({ isLoading: true, error: null });

        try {
          const verificationData = {
            client_id: pendingRegistration.client_id,
            verification_code: verificationCode,
          };

          const response = await authAPI.verifyRegistration(verificationData);

          // Store user data and token
          const { client, token } = response;

          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(client));

          set({
            user: client,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            pendingRegistration: null,
          });

          return {
            success: true,
            message: response.message,
            user: client,
          };
        } catch (error) {
          const errorMessage =
            error.data?.message || error.message || "كود التحقق غير صحيح";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Resend verification code
      resendVerification: async () => {
        const { pendingRegistration } = get();

        if (!pendingRegistration) {
          throw new Error("لا توجد عملية تسجيل معلقة");
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.resendVerification(
            pendingRegistration.client_id
          );

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: response.message || "تم إعادة إرسال الكود بنجاح",
          };
        } catch (error) {
          const errorMessage =
            error.data?.message || error.message || "فشل في إعادة إرسال الكود";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Client Login
      login: async (credentials) => {
        console.log("🏪 AuthStore: بدء clientLogin");
        set({ isLoading: true, error: null });

        try {
          console.log("📦 AuthStore: البيانات المرسلة:", {
            email: credentials.email,
            password: "[HIDDEN]",
          });

          const response = await authAPI.clientLogin(credentials);
          console.log("✅ AuthStore: نجح تسجيل الدخول، الاستجابة:", response);

          // Extract data from response
          const { message, client, token } = response;

          // Store token and user data
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(client));

          console.log("💾 AuthStore: تم حفظ التوكن والبيانات");
          console.log("👤 AuthStore: بيانات العميل:", client);

          set({
            user: client,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: message || "تم تسجيل الدخول بنجاح",
            user: client,
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
          const errorMessage =
            error.data?.message || error.message || "فشل تسجيل الدخول";
          set({ error: errorMessage });
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
            console.error("Error during server logout:", error);
            // Continue with local logout even if server logout fails
          }
        }

        // Clear local storage and state
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          pendingRegistration: null,
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
        console.log("🏪 AuthStore: بدء requestPhoneChange مع الرقم:", newPhone);
        set({ isLoading: true, error: null });

        try {
          console.log("🌐 AuthStore: استدعاء authAPI.requestPhoneChange...");
          const response = await authAPI.requestPhoneChange({
            new_phone: newPhone,
          });
          console.log("✅ AuthStore: نجح استدعاء API، الاستجابة:", response);

          set({
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم إرسال رمز التحقق إلى رقمك الجديد",
            otp: response.otp,
            expires_at: response.expires_at,
            new_phone: response.new_phone,
            note: response.note,
            data: response,
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
          const errorMessage =
            error.data?.message ||
            error.message ||
            "حدث خطأ في طلب تغيير رقم الهاتف";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Confirm phone change
      confirmPhoneChange: async (otp) => {
        console.log("🏪 AuthStore: بدء confirmPhoneChange"); // OTP not logged for security
        set({ isLoading: true, error: null });

        try {
          console.log("🌐 AuthStore: استدعاء authAPI.confirmPhoneChange...");
          const response = await authAPI.confirmPhoneChange({ otp });
          console.log(
            "✅ AuthStore: نجح تأكيد تغيير الهاتف، الاستجابة:",
            response
          );

          // Get current user data
          const currentUser = get().user;
          console.log("👤 AuthStore: بيانات المستخدم الحالية:", currentUser);

          // Update user phone in state and localStorage
          const newPhone =
            response.new_phone || response.phone || response.data?.new_phone;
          const updatedUser = { ...currentUser, phone: newPhone };

          console.log("📱 AuthStore: الرقم الجديد:", newPhone);
          console.log("👤 AuthStore: بيانات المستخدم المحدثة:", updatedUser);

          localStorage.setItem("user_data", JSON.stringify(updatedUser));
          console.log("💾 AuthStore: تم تحديث localStorage بالبيانات الجديدة");

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم تغيير رقم الهاتف بنجاح",
            user: updatedUser,
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
          const errorMessage =
            error.data?.message ||
            error.message ||
            "حدث خطأ في تأكيد تغيير رقم الهاتف";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Update client profile
      updateProfile: async (profileData) => {
        console.log("🏪 AuthStore: بدء updateProfile:", profileData);
        set({ isLoading: true, error: null });

        try {
          // Prepare data for API (only editable fields)
          const updateData = {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email,
            country: profileData.country,
            gender: profileData.gender,
          };

          console.log("📦 AuthStore: البيانات المعدة للإرسال:", updateData);
          console.log("👤 AuthStore: المستخدم الحالي:", get().user);
          console.log(
            "🔑 AuthStore: التوكن موجود؟",
            get().token ? "نعم" : "لا"
          );

          const response = await authAPI.updateClientProfile(updateData);
          console.log(
            "✅ AuthStore: نجح تحديث البروفايل، الاستجابة:",
            response
          );

          // Update user data in state and localStorage
          const clientData =
            response.client || response.data?.client || response;
          const updatedUser = { ...get().user, ...clientData };

          console.log("👤 AuthStore: بيانات العميل من الاستجابة:", clientData);
          console.log("👤 AuthStore: بيانات المستخدم المحدثة:", updatedUser);

          localStorage.setItem("user_data", JSON.stringify(updatedUser));
          console.log("💾 AuthStore: تم تحديث localStorage");

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم تحديث البيانات بنجاح",
            user: updatedUser,
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
          const errorMessage =
            error.data?.message || error.message || "حدث خطأ في تحديث البيانات";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Change password
      changePassword: async (passwordData) => {
        console.log("🏪 AuthStore: بدء changePassword");
        set({ isLoading: true, error: null });

        try {
          console.log("📦 AuthStore: البيانات المرسلة:", {
            new_password: "[HIDDEN]",
            new_password_confirmation: "[HIDDEN]",
          });

          const response = await authAPI.changePassword(passwordData);
          console.log(
            "✅ AuthStore: نجح تغيير كلمة المرور، الاستجابة:",
            response
          );

          // Send SMS notification if phone number is provided in response
          if (response.phone) {
            try {
              console.log(
                "📱 AuthStore: إرسال رسالة تأكيد تغيير كلمة المرور إلى:",
                response.phone
              );
              const smsMessage =
                "تم تغيير كلمة المرور الخاصة بحسابك بنجاح. إذا لم تقم بهذا التغيير، يرجى التواصل معنا فوراً.";

              await authAPI.sendNotification(response.phone, smsMessage);
              console.log(
                "✅ AuthStore: تم إرسال رسالة تأكيد تغيير كلمة المرور"
              );
            } catch (smsError) {
              console.error(
                "❌ AuthStore: خطأ في إرسال رسالة تأكيد:",
                smsError
              );
              // Don't fail the password change if SMS fails
            }
          }

          set({
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم تغيير كلمة المرور بنجاح",
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
          const errorMessage =
            error.data?.message ||
            error.message ||
            "حدث خطأ في تغيير كلمة المرور";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        console.log("🏪 AuthStore: بدء forgotPassword");
        set({ isLoading: true, error: null });

        try {
          console.log("📦 AuthStore: البيانات المرسلة:", { email });

          const response = await authAPI.forgotPassword(email);
          console.log(
            "✅ AuthStore: نجح طلب إعادة التعيين، الاستجابة:",
            response
          );

          // Send OTP if phone number is provided in response
          if (response.phone && response.otp) {
            try {
              console.log(
                "📱 AuthStore: إرسال OTP إعادة التعيين إلى:",
                response.phone
              );
              await authAPI.sendOTP(response.phone, response.otp);
              console.log("✅ AuthStore: تم إرسال OTP إعادة التعيين");
            } catch (otpError) {
              console.error("❌ AuthStore: خطأ في إرسال OTP:", otpError);
              // Don't fail the forgot password if OTP sending fails
            }
          }

          set({
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم إرسال كود إعادة التعيين",
            phone: response.phone,
            otp: response.otp,
            expires_at: response.expires_at,
            email: email,
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
          const errorMessage =
            error.data?.message ||
            error.message ||
            "حدث خطأ في طلب إعادة التعيين";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Reset password
      resetPassword: async (resetData) => {
        console.log("🏪 AuthStore: بدء resetPassword");
        set({ isLoading: true, error: null });

        try {
          console.log("📦 AuthStore: البيانات المرسلة:", {
            email: resetData.email,
            reset_code: "[HIDDEN]",
            new_password: "[HIDDEN]",
            new_password_confirmation: "[HIDDEN]",
          });

          const response = await authAPI.resetPassword(resetData);
          console.log(
            "✅ AuthStore: نجح إعادة تعيين كلمة المرور، الاستجابة:",
            response
          );

          // Send success notification if phone number is provided in response
          if (response.phone) {
            try {
              console.log(
                "📱 AuthStore: إرسال رسالة تأكيد إعادة تعيين كلمة المرور إلى:",
                response.phone
              );
              const smsMessage =
                "تم إعادة تعيين كلمة المرور الخاصة بحسابك بنجاح. إذا لم تقم بهذا التغيير، يرجى التواصل معنا فوراً.";

              await authAPI.sendNotification(response.phone, smsMessage);
              console.log("✅ AuthStore: تم إرسال رسالة تأكيد إعادة التعيين");
            } catch (smsError) {
              console.error(
                "❌ AuthStore: خطأ في إرسال رسالة تأكيد:",
                smsError
              );
              // Don't fail the password reset if SMS fails
            }
          }

          set({
            isLoading: false,
            error: null,
          });

          return {
            success: true,
            message: response.message || "تم إعادة تعيين كلمة المرور بنجاح",
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
          const errorMessage =
            error.data?.message ||
            error.message ||
            "حدث خطأ في إعادة تعيين كلمة المرور";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
