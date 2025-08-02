import { useState, useEffect } from 'react';

export const useCurrencyRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://app.quickly.codes/luban-elgazal/public/api/currencies', {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch currency rates');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // تحويل البيانات إلى شكل مناسب للاستخدام
          const currencyRates = {};
          data.data.forEach(currency => {
            currencyRates[currency.code] = parseFloat(currency.exchange_rate);
          });
          
          // إضافة الريال السعودي كعملة أساسية
          currencyRates['SAR'] = 1;
          
          setRates(currencyRates);
        }
      } catch (err) {
        console.error('Error fetching currency rates:', err);
        setError(err.message);
        
        // استخدام القيم الافتراضية في حالة الخطأ
        setRates({
          SAR: 1,
          USD: 3.75,
          AED: 1.0,
          QAR: 1.0,
          OMR: 9.75,
          BHD: 9.95,
          KWD: 12.28
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyRates();
  }, []);

  // دالة لحساب قيمة الشحن المجاني بالعملة المحددة
  const getFreeShippingThreshold = (currency = 'SAR', baseSAR = 200) => {
    const rate = rates[currency] || 1;
    return baseSAR / rate;
  };

  return {
    rates,
    loading,
    error,
    getFreeShippingThreshold
  };
};