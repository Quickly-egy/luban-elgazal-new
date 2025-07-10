// Geography API Service
// استخدام proxy في development, API مباشر في production
const BASE_URL = import.meta.env.DEV ? '/api' : 'https://apix.asyadexpress.com/v2';
const API_TOKEN = 'FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1';

const createHeaders = () => {
  const headers = new Headers();
  // في development، الـ proxy سيضيف الـ header تلقائياً
  if (!import.meta.env.DEV) {
    headers.append('Authorization', `Bearer ${API_TOKEN}`);
  }
  headers.append('Content-Type', 'application/json');
  return headers;
};

// قائمة الدول المطلوبة فقط
const ALLOWED_COUNTRIES = [
  "Bahrain",
  "Saudi Arabia", 
  "Qatar",
  "United Arab Emirates",
  "Oman"
];

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
      console.log('🌍 جلب قائمة الدول...');
      
      const response = await fetch(`${BASE_URL}/countries`, {
        method: 'GET',
        headers: createHeaders(),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ تم جلب الدول بنجاح:', data.data?.countryList?.length || 0);
      
      // تصفية الدول لإظهار فقط الدول المطلوبة
      const filteredCountries = (data.data?.countryList || []).filter(country => 
        ALLOWED_COUNTRIES.includes(country.countryName)
      );
      
      console.log('🔍 الدول المفلترة:', filteredCountries.length);
      
      return {
        success: true,
        data: filteredCountries,
        message: data.message || 'تم جلب الدول بنجاح'
      };
    } catch (error) {
      console.error('❌ خطأ في جلب الدول:', error);
      console.log('🔄 استخدام البيانات الاحتياطية...');
      
      // استخدام البيانات الاحتياطية في حالة فشل الـ API
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
      console.log(`🏙️ جلب مدن الدولة: ${countryName}`);
      
      const response = await fetch(`${BASE_URL}/countries/${countryName}/cities`, {
        method: 'GET',
        headers: createHeaders(),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // تحويل البيانات من object إلى array
      const citiesArray = data.data ? Object.keys(data.data).map(key => ({
        id: key,
        name: data.data[key].name,
        nameAr: data.data[key].name_ar,
        nameEn: data.data[key].name_en,
        latitude: data.data[key].latitude,
        longitude: data.data[key].longitude,
        countryCode: data.data[key].cca2,
        countryName: data.data[key].adm0name,
        population: data.data[key].pop_max,
        ...data.data[key]
      })) : [];

      console.log('✅ تم جلب المدن بنجاح:', citiesArray.length);
      
      return {
        success: true,
        data: citiesArray,
        message: data.message || 'تم جلب المدن بنجاح'
      };
    } catch (error) {
      console.error('❌ خطأ في جلب المدن:', error);
      
      // في حالة فشل جلب المدن، نرجع قائمة فارغة مع رسالة خطأ
      return {
        success: false,
        data: [],
        message: 'فشل في جلب قائمة المدن. يرجى المحاولة مرة أخرى.'
      };
    }
  },

  // البحث عن دولة بالاسم أو الكود
  searchCountry: async (query) => {
    try {
      const countries = await geographyAPI.getCountries();
      if (!countries.success) {
        return countries;
      }

      const filteredCountries = countries.data.filter(country => 
        ALLOWED_COUNTRIES.includes(country.countryName) && (
          country.countryName.toLowerCase().includes(query.toLowerCase()) ||
          country.countryCode.toLowerCase().includes(query.toLowerCase()) ||
          country.countryCurrency.toLowerCase().includes(query.toLowerCase())
        )
      );

      return {
        success: true,
        data: filteredCountries,
        message: `تم العثور على ${filteredCountries.length} دولة`,
        fallback: countries.fallback
      };
    } catch (error) {
      console.error('❌ خطأ في البحث عن الدولة:', error);
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
      const cities = await geographyAPI.getCities(countryName);
      if (!cities.success) {
        return cities;
      }

      const filteredCities = cities.data.filter(city => 
        city.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
        (city.nameAr && city.nameAr.includes(cityQuery)) ||
        (city.nameEn && city.nameEn.toLowerCase().includes(cityQuery.toLowerCase()))
      );

      return {
        success: true,
        data: filteredCities,
        message: `تم العثور على ${filteredCities.length} مدينة`
      };
    } catch (error) {
      console.error('❌ خطأ في البحث عن المدينة:', error);
      return {
        success: false,
        data: [],
        message: 'فشل في البحث عن المدينة'
      };
    }
  }
};

export default geographyAPI; 