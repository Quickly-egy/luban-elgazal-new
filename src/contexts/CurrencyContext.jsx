import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocationStore from '../stores/locationStore';
import { getPriceForCountry, formatPrice, getCurrencyInfo } from '../utils/formatters';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const { countryCode } = useLocationStore();
  const [currentCountry, setCurrentCountry] = useState(countryCode);

  // Force update when country changes
  useEffect(() => {
    setCurrentCountry(countryCode);
  }, [countryCode]);

  const getProductPrice = (product) => {
    return getPriceForCountry(product, currentCountry);
  };

  const formatPriceWithCurrency = (price) => {
    return formatPrice(price, currentCountry);
  };

  const currencyInfo = getCurrencyInfo(currentCountry);

  const value = {
    countryCode: currentCountry,
    getProductPrice,
    formatPrice: formatPriceWithCurrency,
    currencyInfo,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider');
  }
  return context;
}; 