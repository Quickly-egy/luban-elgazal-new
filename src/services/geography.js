// Geography API Service - Updated to use Backend APIs
const BASE_URL = "https://app.quickly.codes/luban-elgazal/public/api";

const createHeaders = () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return headers;
};

// دول الخليج كـ fallback في حالة فشل الـ API
const GCC_COUNTRIES_FALLBACK = [
  { countryName: "Saudi Arabia", countryCode: "SA", countryCallCode: "966", countryCurrency: "SAR" },
  { countryName: "United Arab Emirates", countryCode: "AE", countryCallCode: "971", countryCurrency: "AED" },
  { countryName: "Qatar", countryCode: "QA", countryCallCode: "974", countryCurrency: "QAR" },
  { countryName: "Bahrain", countryCode: "BH", countryCallCode: "973", countryCurrency: "BHD" },
  { countryName: "Oman", countryCode: "OM", countryCallCode: "968", countryCurrency: "OMR" }
];

const geographyAPI = {
  // جلب جميع الدول
  getCountries: async () => {
    try {
      // console.log('🌍 Fetching countries from backend API...');

      const response = await fetch(`${BASE_URL}/countries`, {
        method: 'GET',
        headers: createHeaders(),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('✅ Countries response:', data);

      // البيانات تأتي من الباك اند مباشرة مفلترة بالفعل
      const countries = data.data?.countryList || [];

      return {
        success: true,
        data: countries,
        message: data.message || 'تم جلب الدول بنجاح',
        fallback: data.fallback || false
      };
    } catch (error) {
      // console.error('❌ Error fetching countries from backend:', error);

      return {
        success: true,
        data: GCC_COUNTRIES_FALLBACK,
        message: 'تم جلب الدول من البيانات الاحتياطية',
        fallback: true
      };
    }
  },

  // جلب مدن دولة معينة
  getCities: async (countryName) => {
    try {
      // console.log(`🏙️ Fetching cities for ${countryName} from backend API...`);

      const response = await fetch(
        `${BASE_URL}/countries/${encodeURIComponent(countryName)}/cities`,
        {
          method: 'GET',
          headers: createHeaders(),
          redirect: 'follow',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(`✅ Cities response for ${countryName}:`, data);

      // تحويل البيانات من Object إلى Array حسب التنسيق الجديد
      const citiesArray = data.data
        ? Object.keys(data.data).map((key) => ({
            id: key,
            name: data.data[key].name,
            nameAr: data.data[key].name_ar,
            nameEn: data.data[key].name_en,
            latitude: data.data[key].latitude,
            longitude: data.data[key].longitude,
            countryCode: data.data[key].cca2,
            countryName: data.data[key].adm0name,
            population: data.data[key].pop_max,
            ...data.data[key],
          }))
        : [];

      // console.log(`📍 Processed ${citiesArray.length} cities for ${countryName}`);

      return {
        success: true,
        data: citiesArray,
        message: data.message || 'تم جلب المدن بنجاح',
        fallback: data.fallback || false
      };
    } catch (error) {
      // console.error(`❌ Error fetching cities for ${countryName}:`, error);

      return {
        success: false,
        data: [],
        message: 'فشل في جلب قائمة المدن. يرجى المحاولة مرة أخرى.',
      };
    }
  },

  // البحث عن دولة بالاسم أو الكود
  searchCountry: async (query) => {
    try {
      const countries = await geographyAPI.getCountries();
      if (!countries.success) return countries;

      const filteredCountries = countries.data.filter(country =>
        country.countryName.toLowerCase().includes(query.toLowerCase()) ||
        country.countryCode.toLowerCase().includes(query.toLowerCase()) ||
        country.countryCurrency.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filteredCountries,
        message: `تم العثور على ${filteredCountries.length} دولة`,
        fallback: countries.fallback
      };
    } catch (error) {
      // console.error('❌ Error searching countries:', error);
      return {
        success: false,
        data: [],
        message: 'فشل في البحث عن الدولة'
      };
    }
  },

  // البحث عن مدينة في دولة معينة
  searchCity: async (countryName, cityQuery) => {
    try {
      // console.log(`🔍 Searching for "${cityQuery}" in ${countryName}`);
      const cities = await geographyAPI.getCities(countryName);
      if (!cities.success) return cities;

      const filteredCities = cities.data.filter(city =>
        city.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
        (city.nameAr && city.nameAr.includes(cityQuery)) ||
        (city.nameEn && city.nameEn.toLowerCase().includes(cityQuery.toLowerCase()))
      );

      // console.log(`🎯 Found ${filteredCities.length} cities matching "${cityQuery}"`);

      return {
        success: true,
        data: filteredCities,
        message: `تم العثور على ${filteredCities.length} مدينة`,
        fallback: cities.fallback
      };
    } catch (error) {
      // console.error(`❌ Error searching cities in ${countryName}:`, error);
      return {
        success: false,
        data: [],
        message: 'فشل في البحث عن المدينة'
      };
    }
  },

  // مسح cache البيانات (اختياري للإدارة)
  clearCache: async () => {
    try {
      // console.log('🗑️ Clearing geography cache...');
      const response = await fetch(`${BASE_URL}/geography/cache`, {
        method: 'DELETE',
        headers: createHeaders(),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('✅ Cache cleared successfully');

      return {
        success: true,
        message: data.message || 'تم مسح الذاكرة المؤقتة بنجاح'
      };
    } catch (error) {
      // console.error('❌ Error clearing cache:', error);
      return {
        success: false,
        message: 'فشل في مسح الذاكرة المؤقتة'
      };
    }
  }
};

export default geographyAPI;
