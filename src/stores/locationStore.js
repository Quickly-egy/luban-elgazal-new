import { create } from "zustand";
import userLocationAPI from "../services/userLocation";

// Supported GCC countries - دول الخليج المدعومة
const SUPPORTED_COUNTRIES = {
  'SA': 'السعودية',
  'AE': 'الإمارات العربية المتحدة', 
  'QA': 'قطر',
  'KW': 'الكويت',
  'BH': 'البحرين',
  'OM': 'سلطنة عمان'
};

// Map English country names to Arabic names - Extended for unsupported countries
const COUNTRY_NAME_MAP = {
  'Saudi Arabia': 'السعودية',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  'Qatar': 'قطر',
  'Kuwait': 'الكويت',
  'Bahrain': 'البحرين',
  'Oman': 'سلطنة عمان',
  // Add common unsupported countries
  'Egypt': 'مصر',
  'Morocco': 'المغرب',
  'Algeria': 'الجزائر',
  'Tunisia': 'تونس',
  'Jordan': 'الأردن',
  'Lebanon': 'لبنان',
  'Syria': 'سوريا',
  'Iraq': 'العراق',
  'Yemen': 'اليمن',
  'Libya': 'ليبيا',
  'Sudan': 'السودان',
  'Turkey': 'تركيا',
  'Iran': 'إيران',
  'India': 'الهند',
  'Pakistan': 'باكستان',
  'Bangladesh': 'بنغلاديش',
  'Malaysia': 'ماليزيا',
  'Indonesia': 'إندونيسيا',
  'Philippines': 'الفلبين',
  'China': 'الصين',
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  'Germany': 'ألمانيا',
  'France': 'فرنسا',
  'Italy': 'إيطاليا',
  'Spain': 'إسبانيا',
  'Canada': 'كندا',
  'Australia': 'أستراليا',
  'Brazil': 'البرازيل',
  'Russia': 'روسيا',
  'Japan': 'اليابان',
  'South Korea': 'كوريا الجنوبية'
};

const useLocationStore = create((set, get) => ({
      country: null,
      countryCode: null,
  originalCountryCode: null, // كود الدولة الأصلي لعرض العلم الصحيح
      loading: false,
      error: null,
      isAutoDetected: false,
      userIP: null,
      city: null,
      region: null,
      timezone: null,
      isSupported: false,
      detectionSource: null,

      // Set location data (legacy method for backward compatibility)
      setLocation: (country, countryCode) => {
    const upperCountryCode = countryCode.toUpperCase();
        set({
          country,
      countryCode: upperCountryCode,
      originalCountryCode: upperCountryCode,
          error: null,
          loading: false,
      isSupported: SUPPORTED_COUNTRIES.hasOwnProperty(upperCountryCode)
        });
        console.log(`📍 Location set manually: ${country} (${countryCode})`);
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

  // Auto-detect user location using Backend API - NO CACHING
      autoDetectLocation: async () => {
        set({ loading: true, error: null });

        try {
      console.log('🔍 Starting fresh location detection (no cache)...');
          
      // Always fetch fresh data - no cache
      const result = await userLocationAPI.detectUserCountryFresh();
          
          if (result.success && result.detectedCountry && result.countryCode) {
            // تحويل اسم الدولة للعربية
            const arabicCountryName = COUNTRY_NAME_MAP[result.detectedCountry] || result.detectedCountry;
        
        // إذا كانت الدولة غير مدعومة، استخدم USD كـ countryCode ولكن احتفظ بالاسم الأصلي
        const finalCountryCode = result.isSupported ? result.countryCode : "USD";
        const finalCountryName = arabicCountryName; // إزالة النص الإضافي
            
            set({
          country: finalCountryName,
          countryCode: finalCountryCode,
          originalCountryCode: result.countryCode, // حفظ الكود الأصلي للعلم
              loading: false,
              error: null,
              isAutoDetected: true,
              userIP: result.userIP,
              city: result.city,
              region: result.region,
              timezone: result.timezone,
              isSupported: result.isSupported,
              detectionSource: result.source || 'backend-api'
            });

        console.log(`✅ Auto-detected location: ${finalCountryName} (currency: ${finalCountryCode}, flag: ${result.countryCode})`);
            
            if (!result.isSupported) {
          console.warn(`⚠️ Detected country ${result.detectedCountry} is not supported - using USD pricing`);
            }

            return result;
          } else {
            // فشل في التحديد - استخدام fallback
            throw new Error(result.message || 'فشل في تحديد الموقع');
          }
        } catch (error) {
          console.error('❌ Auto-detection failed:', error);
          
          // استخدام fallback - السعودية كافتراضي
          set({
            country: "السعودية",
            countryCode: "SA",
        originalCountryCode: "SA",
            loading: false,
            error: `فشل في تحديد الموقع تلقائياً: ${error.message}`,
            isAutoDetected: false,
            isSupported: true,
            detectionSource: 'fallback'
          });

          return { success: false, error: error.message };
        }
      },

  // Initialize location detection - now ALWAYS fetches fresh data
      initializeLocation: async () => {
    console.log('🚀 Always fetching fresh location data...');
    await get().autoDetectLocation();
      },

      // Manual country change (for user selection from supported countries only)
      changeCountry: (country, countryCode) => {
        const upperCountryCode = countryCode.toUpperCase();
        
        console.log(`📝 Manual country change: ${country} (${upperCountryCode})`);
        
        // Ensure only supported countries can be manually selected
        if (SUPPORTED_COUNTRIES[upperCountryCode]) {
          set({
            country,
            countryCode: upperCountryCode,
        originalCountryCode: upperCountryCode,
            error: null,
            loading: false,
            isAutoDetected: false,
            isSupported: true
          });
        } else {
          console.warn(`⚠️ Attempted to set unsupported country: ${country} (${upperCountryCode})`);
        }
      },

  // Auto-detect location again - NO CACHING
      detectLocationAgain: async () => {
    console.log('🔄 Re-detecting location (fresh data)...');
        await get().autoDetectLocation();
      },

  // Force detection without cache (same as autoDetectLocation now)
      forceDetectLocation: async () => {
    return await get().autoDetectLocation();
  },

  // Clear location data (no longer clears cache since we don't use cache)
      clearLocation: () => {
        set({ 
          country: null, 
          countryCode: null, 
      originalCountryCode: null,
          error: null,
          isAutoDetected: false,
          userIP: null,
          city: null,
          region: null,
          timezone: null,
          isSupported: false,
          detectionSource: null
        });
        
        console.log('🗑️ Location data cleared');
      },

      // Get supported countries list
      getSupportedCountries: () => {
        return SUPPORTED_COUNTRIES;
      },

  // Get detection info
      getDetectionInfo: () => {
        const state = get();
        return {
          isAutoDetected: state.isAutoDetected,
          detectionSource: state.detectionSource,
          userIP: state.userIP,
          city: state.city,
          region: state.region,
          timezone: state.timezone,
      isSupported: state.isSupported,
      originalCountryCode: state.originalCountryCode
    };
  }
}));

export default useLocationStore;
