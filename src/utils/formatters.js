// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  EG: { currency: "EGP", locale: "ar-EG", symbol: "ج.م", name: "جنيه مصري" },
  SA: { currency: "SAR", locale: "ar-SA", symbol: "ر.س", name: "ريال سعودي" },
  AE: { currency: "AED", locale: "ar-AE", symbol: "د.إ", name: "درهم إماراتي" },
  KW: { currency: "KWD", locale: "ar-KW", symbol: "د.ك", name: "دينار كويتي" },
  QA: { currency: "QAR", locale: "ar-QA", symbol: "ر.ق", name: "ريال قطري" },
  BH: { currency: "BHD", locale: "ar-BH", symbol: "د.ب", name: "دينار بحريني" },
  OM: { currency: "OMR", locale: "ar-OM", symbol: "ر.ع", name: "ريال عماني" },
  JO: { currency: "JOD", locale: "ar-JO", symbol: "د.أ", name: "دينار أردني" },
  LB: { currency: "LBP", locale: "ar-LB", symbol: "ل.ل", name: "ليرة لبنانية" },
  IQ: { currency: "IQD", locale: "ar-IQ", symbol: "د.ع", name: "دينار عراقي" },
  MA: { currency: "MAD", locale: "ar-MA", symbol: "د.م", name: "درهم مغربي" },
  DZ: { currency: "DZD", locale: "ar-DZ", symbol: "د.ج", name: "دينار جزائري" },
  TN: { currency: "TND", locale: "ar-TN", symbol: "د.ت", name: "دينار تونسي" },
  LY: { currency: "LYD", locale: "ar-LY", symbol: "د.ل", name: "دينار ليبي" },
  SD: { currency: "SDG", locale: "ar-SD", symbol: "ج.س", name: "جنيه سوداني" },
  PS: { currency: "ILS", locale: "ar-PS", symbol: "₪", name: "شيكل إسرائيلي" },
  SY: { currency: "SYP", locale: "ar-SY", symbol: "ل.س", name: "ليرة سورية" },
  YE: { currency: "YER", locale: "ar-YE", symbol: "ر.ي", name: "ريال يمني" },
};

// Default currency fallback
const DEFAULT_CURRENCY = COUNTRY_CURRENCY_MAP["EG"];

export const getCurrencyInfo = (countryCode) => {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
};

export const formatPrice = (price, countryCode = null) => {
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
