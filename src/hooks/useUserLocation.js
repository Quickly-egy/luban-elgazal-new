import { useState, useEffect, useCallback } from 'react';
import userLocationAPI from '../services/userLocation';

// Hook لتحديد دولة المستخدم تلقائياً - NO CACHING
export const useUserLocation = (options = {}) => {
  const {
    autoDetect = true,           // تحديد تلقائي عند التحميل
    onDetection = null,          // callback عند النجاح
    onError = null               // callback عند الخطأ
  } = options;

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // تحديد دولة المستخدم - ALWAYS FRESH
  const detectCountry = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsDetecting(true);

    try {
      
      // Always fetch fresh data - no cache
      const result = await userLocationAPI.detectUserCountryFresh();


      setUserLocation(result);

      // استدعاء callback functions
      if (result.success && onDetection) {
        onDetection(result);
      } else if (!result.success && onError) {
        onError(result.error || result.message);
      }

      return result;
    } catch (err) {
      console.error('❌ Error in detectCountry:', err);
      const errorMessage = err.message || 'فشل في تحديد دولة المستخدم';
      
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        requiresManualSelection: true
      };
    } finally {
      setLoading(false);
      setIsDetecting(false);
    }
  }, [onDetection, onError]);

  // تحديد دولة يدوياً
  const setManualCountry = useCallback((countryName, countryCode) => {
    try {
      
      const result = userLocationAPI.setManualCountry(countryName, countryCode);
      
      if (result) {
        setUserLocation(result);
        setError(null);
        
        if (onDetection) {
          onDetection(result);
        }
        
        return result;
      } else {
        throw new Error('فشل في تحديد الدولة يدوياً');
      }
    } catch (err) {
      console.error('❌ Error setting manual country:', err);
      const errorMessage = err.message || 'فشل في تحديد الدولة يدوياً';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return null;
    }
  }, [onDetection, onError]);

  // مسح البيانات (no cache to clear anymore)
  const clearLocationData = useCallback(() => {
    setUserLocation(null);
    setError(null);
  }, []);

  // إعادة التحديد (always fresh)
  const forceDetect = useCallback(() => {
    return detectCountry();
  }, [detectCountry]);

  // تحديد تلقائي عند التحميل
  useEffect(() => {
    if (autoDetect) {
      detectCountry();
    }
  }, [autoDetect, detectCountry]);

  // Helper functions
  const isSupported = userLocation?.isSupported || false;
  const requiresSelection = userLocation?.requiresManualSelection || false;
  const detectedCountry = userLocation?.detectedCountry || null;
  const countryCode = userLocation?.countryCode || null;
  const isManual = userLocation?.isManual || false;

  return {
    // بيانات الموقع
    userLocation,
    detectedCountry,
    countryCode,
    city: userLocation?.city,
    region: userLocation?.region,
    timezone: userLocation?.timezone,
    userIP: userLocation?.userIP,
    
    // حالات
    loading,
    error,
    isDetecting,
    isSupported,
    requiresSelection,
    isManual,
    
    // وظائف
    detectCountry,
    setManualCountry,
    clearLocationData,
    forceDetect,
    
    // معلومات إضافية
    supportedCountries: userLocationAPI.getSupportedCountries(),
    isCountrySupported: userLocationAPI.isCountrySupported,
    getCountryByCode: userLocationAPI.getCountryByCode
  };
};

// Hook مبسط للحصول على الدولة فقط
export const useDetectedCountry = () => {
  const { detectedCountry, countryCode, isSupported, loading } = useUserLocation({
    autoDetect: true
  });

  return {
    country: detectedCountry,
    countryCode,
    isSupported,
    loading
  };
};

// Hook للحصول على معلومات كاملة مع إدارة متقدمة
export const useLocationWithManagement = () => {
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  
  const locationData = useUserLocation({
    autoDetect: true,
    onDetection: (result) => {
      if (!result.isSupported || result.requiresManualSelection) {
        setShowCountrySelector(true);
      }
    },
    onError: () => {
      setShowCountrySelector(true);
    }
  });

  const handleCountryChange = (countryName, countryCode) => {
    locationData.setManualCountry(countryName, countryCode);
    setShowCountrySelector(false);
  };

  return {
    ...locationData,
    showCountrySelector,
    setShowCountrySelector,
    handleCountryChange
  };
};

export default useUserLocation; 