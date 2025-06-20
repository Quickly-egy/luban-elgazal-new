import { create } from "zustand";
import { persist } from "zustand/middleware";

// Supported GCC countries
const SUPPORTED_COUNTRIES = {
  'SA': 'السعودية',
  'AE': 'الإمارات العربية المتحدة', 
  'QA': 'قطر',
  'KW': 'الكويت',
  'BH': 'البحرين',
  'OM': 'سلطنة عمان'
};

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

      // Check if a country is supported
      isSupportedCountry: (countryCode) => {
        return SUPPORTED_COUNTRIES.hasOwnProperty(countryCode?.toUpperCase());
      },

      // Fetch user location and apply currency logic
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
                const upperCountryCode = countryCode.toUpperCase();
                
                // Check if detected country is supported
                if (SUPPORTED_COUNTRIES[upperCountryCode]) {
                  // Use detected supported country
                  set({
                    country: SUPPORTED_COUNTRIES[upperCountryCode],
                    countryCode: upperCountryCode,
                    loading: false,
                    error: null,
                  });
                  console.log("Supported country detected:", { 
                    country: SUPPORTED_COUNTRIES[upperCountryCode], 
                    countryCode: upperCountryCode 
                  });
                } else {
                  // Unsupported country - use USD with "Other" indication
                  set({
                    country: "دولة أخرى",
                    countryCode: "USD", // Special code to indicate USD currency
                    loading: false,
                    error: null,
                  });
                  console.log("Unsupported country detected, using USD:", { 
                    detectedCountry: country, 
                    detectedCode: countryCode,
                    currency: "USD"
                  });
                }
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

          // If all services fail, set default to Saudi Arabia
          set({
            country: "السعودية",
            countryCode: "SA",
            loading: false,
            error: "Could not detect location, using default",
          });
          console.log("Location detection failed, using Saudi Arabia as default");
        } catch (error) {
          console.error("Location detection failed:", error);
          set({
            country: "السعودية",
            countryCode: "SA",
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

      // Manual country change (for user selection from supported countries only)
      changeCountry: (country, countryCode) => {
        const upperCountryCode = countryCode.toUpperCase();
        
        // Ensure only supported countries can be manually selected
        if (SUPPORTED_COUNTRIES[upperCountryCode]) {
          set({
            country,
            countryCode: upperCountryCode,
            error: null,
            loading: false,
          });
          console.log("Country manually changed to:", { country, countryCode: upperCountryCode });
        } else {
          console.warn("Attempted to select unsupported country:", { country, countryCode });
        }
      },

      // Auto-detect location again
      detectLocationAgain: async () => {
        await get().fetchUserLocation();
      },

      // Clear location data
      clearLocation: () => {
        set({ country: null, countryCode: null, error: null });
      },

      // Get supported countries list
      getSupportedCountries: () => {
        return SUPPORTED_COUNTRIES;
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
