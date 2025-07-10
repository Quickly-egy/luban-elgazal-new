import { useState, useEffect, useCallback } from 'react';
import geographyAPI from '../services/geography';

// Hook لإدارة الدول
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await geographyAPI.getCountries();
      if (response.success) {
        setCountries(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('خطأ في جلب قائمة الدول');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCountries = useCallback(async (query) => {
    if (!query.trim()) {
      fetchCountries();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await geographyAPI.searchCountry(query);
      if (response.success) {
        setCountries(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('خطأ في البحث عن الدول');
    } finally {
      setLoading(false);
    }
  }, [fetchCountries]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    loading,
    error,
    fetchCountries,
    searchCountries
  };
};

// Hook لإدارة المدن
export const useCities = (countryName) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async (country) => {
    if (!country) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await geographyAPI.getCities(country);
      if (response.success) {
        setCities(response.data);
      } else {
        setError(response.message);
        setCities([]);
      }
    } catch (err) {
      setError('خطأ في جلب قائمة المدن');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCities = useCallback(async (country, query) => {
    if (!country) {
      setCities([]);
      return;
    }

    if (!query.trim()) {
      fetchCities(country);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await geographyAPI.searchCity(country, query);
      if (response.success) {
        setCities(response.data);
      } else {
        setError(response.message);
        setCities([]);
      }
    } catch (err) {
      setError('خطأ في البحث عن المدن');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [fetchCities]);

  useEffect(() => {
    fetchCities(countryName);
  }, [countryName, fetchCities]);

  return {
    cities,
    loading,
    error,
    fetchCities,
    searchCities
  };
};

// Hook مدمج لإدارة الدول والمدن معاً
export const useGeography = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
    fetchCountries,
    searchCountries
  } = useCountries();

  const {
    cities,
    loading: citiesLoading,
    error: citiesError,
    fetchCities,
    searchCities
  } = useCities(selectedCountry?.countryName);

  const handleCountryChange = useCallback((country) => {
    setSelectedCountry(country);
    setSelectedCity(null); // إعادة تعيين المدينة عند تغيير الدولة
  }, []);

  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedCountry(null);
    setSelectedCity(null);
  }, []);

  return {
    // البيانات
    countries,
    cities,
    selectedCountry,
    selectedCity,
    
    // حالات التحميل
    countriesLoading,
    citiesLoading,
    loading: countriesLoading || citiesLoading,
    
    // الأخطاء
    countriesError,
    citiesError,
    error: countriesError || citiesError,
    
    // الوظائف
    fetchCountries,
    searchCountries,
    fetchCities,
    searchCities,
    handleCountryChange,
    handleCityChange,
    resetSelection
  };
};

export default useGeography; 