import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLocationStore = create(
  persist(
    (set, get) => ({
      country: null,
      countryCode: null,
      loading: false,
      error: null,

      // Set location data (legacy method for backward compatibility)
      setLocation: (country, countryCode) => {
        set({
          country,
          countryCode: countryCode.toUpperCase(),
          error: null,
          loading: false,
        });
        console.log("Country set to:", { country, countryCode });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ loading });
      },

      // Set error state
      setError: (error) => {
        set({ error, loading: false });
      },

      // Fetch user location (renamed from initializeLocation for clarity)
      fetchUserLocation: async () => {
        set({ loading: true, error: null });

        try {
          // Try multiple geolocation services
          const services = [
            "https://ipapi.co/json/",
            "http://ip-api.com/json/",
            "https://ipinfo.io/json",
          ];

          for (const service of services) {
            try {
              const response = await fetch(service);
              const data = await response.json();

              let country, countryCode;

              if (service.includes("ipapi.co")) {
                country = data.country_name;
                countryCode = data.country_code;
              } else if (service.includes("ip-api.com")) {
                country = data.country;
                countryCode = data.countryCode;
              } else if (service.includes("ipinfo.io")) {
                country = data.country;
                countryCode = data.country;
              }

              if (country && countryCode) {
                set({
                  country,
                  countryCode: countryCode.toUpperCase(),
                  loading: false,
                  error: null,
                });
                console.log("Location detected:", { country, countryCode });
                return;
              }
            } catch (serviceError) {
              console.warn(
                `Failed to get location from ${service}:`,
                serviceError
              );
              continue;
            }
          }

          // If all services fail, set default
          set({
            country: "Egypt",
            countryCode: "EG",
            loading: false,
            error: "Could not detect location, using default",
          });
        } catch (error) {
          console.error("Location detection failed:", error);
          set({
            country: "Egypt",
            countryCode: "EG",
            loading: false,
            error: "Location detection failed",
          });
        }
      },

      // Initialize location detection only if no location is set
      initializeLocation: async () => {
        const state = get();
        if (state.country && state.countryCode) {
          return; // Already have location data
        }

        await state.fetchUserLocation();
      },

      // Manual country change (for user selection)
      changeCountry: (country, countryCode) => {
        set({
          country,
          countryCode: countryCode.toUpperCase(),
          error: null,
          loading: false,
        });
        console.log("Country manually changed to:", { country, countryCode });
      },

      // Auto-detect location again
      detectLocationAgain: async () => {
        await get().fetchUserLocation();
      },

      // Clear location data
      clearLocation: () => {
        set({ country: null, countryCode: null, error: null });
      },
    }),
    {
      name: "location-storage",
      partialize: (state) => ({
        country: state.country,
        countryCode: state.countryCode,
      }),
    }
  )
);

export default useLocationStore;
