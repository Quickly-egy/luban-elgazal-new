import React from 'react';
import { useCurrency } from '../../../hooks';
import useLocationStore from '../../../stores/locationStore';

const CurrencyDisplay = () => {
  const { currencyInfo, formatPrice } = useCurrency();
  const { country, countryCode } = useLocationStore();

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px', 
      margin: '10px',
      fontSize: '14px'
    }}>
      <h4>معلومات العملة الحالية:</h4>
      <p><strong>البلد:</strong> {country} ({countryCode})</p>
      <p><strong>العملة:</strong> {currencyInfo.name}</p>
      <p><strong>الرمز:</strong> {currencyInfo.symbol}</p>
      <p><strong>مثال:</strong> {formatPrice(1000)}</p>
    </div>
  );
};

export default CurrencyDisplay; 