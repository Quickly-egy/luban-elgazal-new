// Country to currency mapping for GCC countries
const COUNTRY_CURRENCY_MAP = {
  SA: { currency: "SAR", locale: "ar-SA", symbol: "ر.س", name: "ريال سعودي" },
  AE: { currency: "AED", locale: "ar-AE", symbol: "د.إ", name: "درهم إماراتي" },
  QA: { currency: "QAR", locale: "ar-QA", symbol: "ر.ق", name: "ريال قطري" },
  KW: { currency: "KWD", locale: "ar-KW", symbol: "د.ك", name: "دينار كويتي" },
  BH: { currency: "BHD", locale: "ar-BH", symbol: "د.ب", name: "دينار بحريني" },
  OM: { currency: "OMR", locale: "ar-OM", symbol: "ر.ع", name: "ريال عماني" },
};

// Default currency fallback (USD for unsupported countries)
const DEFAULT_CURRENCY = { 
  currency: "USD", 
  locale: "en-US", 
  symbol: "$", 
  name: "دولار أمريكي" 
};

export const getCurrencyInfo = (countryCode) => {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
};

export const formatPrice = (price, countryCode = null) => {
  // Handle special USD case for unsupported countries
  if (countryCode === 'USD') {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    } catch (error) {
      return `$${price.toLocaleString('en-US')}`;
    }
  }

  const currencyInfo = getCurrencyInfo(countryCode);

  try {
    // Try to use Intl.NumberFormat with the currency
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    // Fallback to custom formatting if Intl doesn't support the currency
    const formattedNumber = new Intl.NumberFormat(currencyInfo.locale).format(
      price
    );
    return `${formattedNumber} ${currencyInfo.symbol}`;
  }
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("01")) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
