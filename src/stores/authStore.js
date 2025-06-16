import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,

      // Login action
      login: (userData) => {
        set({
          isLoggedIn: true,
          user: userData,
        });
      },

      // Logout action
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
        });
      },

      // Update user data
      updateUser: (userData) => {
        set({
          user: { ...get().user, ...userData },
        });
      },

      // Check if user is logged in
      checkAuth: () => {
        return get().isLoggedIn;
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
