import { useMemo } from "react";
import useLocationStore from "../stores/locationStore";
import { formatPrice, getCurrencyInfo } from "../utils/formatters";

export const useCurrency = () => {
  const { countryCode } = useLocationStore();

  const currencyInfo = useMemo(() => {
    // Handle special case where countryCode is 'USD' (for unsupported countries)
    if (countryCode === 'USD') {
      return {
        currency: "USD",
        locale: "en-US", 
        symbol: "$",
        name: "دولار أمريكي"
      };
    }
    
    return getCurrencyInfo(countryCode);
  }, [countryCode]);

  const formatPriceWithCurrency = useMemo(() => {
    return (price) => {
      // Handle USD special case
      if (countryCode === 'USD') {
        return formatPrice(price, 'USD');
      }
      return formatPrice(price, countryCode);
    };
  }, [countryCode]);

  return {
    currencyInfo,
    formatPrice: formatPriceWithCurrency,
    countryCode,
    isUSDFallback: countryCode === 'USD', // Flag to indicate if using USD fallback
  };
};

export default useCurrency;
