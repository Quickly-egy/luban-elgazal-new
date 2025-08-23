// User Location Detection Service
const BASE_URL = "https://app.quickly.codes/luban-elgazal/public/api";

const createHeaders = () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return headers;
};

// الدول المدعومة في النظام
const SUPPORTED_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates", 
  "Qatar",
  "Bahrain",
  "Oman"
];

// خريطة أكواد الدول للأسماء
const COUNTRY_CODE_MAP = {
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'QA': 'Qatar',
  'BH': 'Bahrain',
  'OM': 'Oman'
};

const userLocationAPI = {
  // تحديد دولة المستخدم تلقائياً - FRESH DATA ONLY
  detectUserCountryFresh: async () => {
    try {

      const response = await fetch(`${BASE_URL}/detect-user-country?nocache=${Date.now()}`, {
        method: 'GET',
        headers: createHeaders(),
        redirect: 'follow',
        cache: 'no-cache' // Ensure browser doesn't cache
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const result = {
          success: true,
          userIP: data.data.userIP,
          detectedCountry: data.data.detectedCountry,
          countryCode: data.data.countryCode,
          city: data.data.city,
          region: data.data.region,
          timezone: data.data.timezone,
          isSupported: data.data.isSupported,
          supportedCountries: data.data.supportedCountries || SUPPORTED_COUNTRIES,
          source: data.data.source,
          message: data.message,
          timestamp: Date.now()
        };

        return result;
      } else {
        throw new Error(data.message || 'فشل في تحديد دولة المستخدم');
      }
    } catch (error) {
      console.error('❌ Error detecting user country (FRESH):', error);

      return {
        success: false,
        error: error.message,
        detectedCountry: null,
        countryCode: null,
        isSupported: false,
        supportedCountries: SUPPORTED_COUNTRIES,
        requiresManualSelection: true,
        message: 'فشل في تحديد دولة المستخدم. يرجى اختيار الدولة يدوياً.',
        timestamp: Date.now()
      };
    }
  },

  // تحديد دولة المستخدم تلقائياً (legacy method - kept for compatibility)
  detectUserCountry: async () => {
    // Now just calls the fresh method since we don't want caching
    return await userLocationAPI.detectUserCountryFresh();
  },

  // الحصول على نتيجة محفوظة مؤقتاً أو تحديد جديد (DEPRECATED - now always fetches fresh)
  getCachedOrDetect: async (maxAge = 30 * 60 * 1000) => {
    return await userLocationAPI.detectUserCountryFresh();
  },

  // مسح البيانات المحفوظة محلياً (still works but cache is not used anymore)
  clearCache: () => {
    try {
      localStorage.removeItem('userCountryData');
      return true;
    } catch (error) {
      // console.error('❌ Error clearing cache:', error);
      return false;
    }
  },

  // تحديث الدولة المختارة يدوياً (no longer saves to cache)
  setManualCountry: (countryName, countryCode) => {
    
    // Return the data without saving to cache
    return {
        success: true,
        detectedCountry: countryName,
        countryCode: countryCode,
        isSupported: SUPPORTED_COUNTRIES.includes(countryName),
        supportedCountries: SUPPORTED_COUNTRIES,
        isManual: true,
        timestamp: Date.now(),
        message: 'تم اختيار الدولة يدوياً'
      };
  },

  // التحقق من دعم دولة معينة
  isCountrySupported: (countryName) => {
    return SUPPORTED_COUNTRIES.includes(countryName);
  },

  // الحصول على معلومات دولة بناءً على الكود
  getCountryByCode: (countryCode) => {
    return COUNTRY_CODE_MAP[countryCode] || null;
  },

  // الحصول على قائمة الدول المدعومة
  getSupportedCountries: () => {
    return [...SUPPORTED_COUNTRIES];
  }
};

export default userLocationAPI; 