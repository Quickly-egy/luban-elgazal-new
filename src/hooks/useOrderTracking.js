import { useState } from 'react';

export const useOrderTracking = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackOrder = async (orderNumber) => {
    setLoading(true);
    setError(null);
    setTrackingData(null);

    // استخدام الـ production URL مباشرة
    const API_BASE_URL = "https://app.quickly.codes/luban-elgazal/public";

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          order_number: orderNumber.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        const trackingInfo = {
          order_number: orderNumber,
          tracking_history: data.data || [],
          request_id: data.request_id,
          message: data.message
        };
        
        setTrackingData(trackingInfo);
        return { success: true, data: trackingInfo };
      } else {
        const errorMessage = data.message || "لا يمكن العثور على الطلب";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

    } catch (err) {
      console.error('Tracking API Error:', err);
      const errorMessage = "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearTracking = () => {
    setTrackingData(null);
    setError(null);
  };

  return {
    trackingData,
    loading,
    error,
    trackOrder,
    clearTracking
  };
};

export default useOrderTracking; 