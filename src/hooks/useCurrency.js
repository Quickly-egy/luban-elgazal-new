import { useMemo } from "react";
import useLocationStore from "../stores/locationStore";
import { formatPrice, getCurrencyInfo } from "../utils/formatters";

export const useCurrency = () => {
  const { countryCode } = useLocationStore();

  const currencyInfo = useMemo(() => {
    return getCurrencyInfo(countryCode);
  }, [countryCode]);

  const formatPriceWithCurrency = useMemo(() => {
    return (price) => formatPrice(price, countryCode);
  }, [countryCode]);

  return {
    currencyInfo,
    formatPrice: formatPriceWithCurrency,
    countryCode,
  };
};

export default useCurrency;
