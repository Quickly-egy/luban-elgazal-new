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
  name: "دولار أمريكي",
};

// Helper: convert Arabic-Indic digits (٠-٩) to English digits (0-9)
const toEnglishDigits = (str) =>
  str.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export const getCurrencyInfo = (countryCode) => {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
};

// Get price for specific country from product prices object
export const getPriceForCountry = (product, countryCode) => {
  if (!product || !countryCode) {
    return null;
  }

  // First, try to use the new 'prices' object if available
  if (product.prices && typeof product.prices === "object") {
    // Mapping from country codes to currency codes in the prices object
    const currencyMapping = {
      SA: "sar",
      AE: "aed",
      QA: "qar",
      KW: "kwd",
      BH: "bhd",
      OM: "omr",
      USD: "usd",
    };

    const currencyCode = currencyMapping[countryCode.toUpperCase()];
    const priceData = product.prices[currencyCode];

    if (priceData) {
      const result = {
        originalPrice: parseFloat(priceData.price || 0),
        finalPrice: parseFloat(priceData.final_price || priceData.price || 0),
        discountAmount: parseFloat(priceData.discount_amount || 0),
      };

      return result;
    }
  }

  // Fallback to old method using individual price fields

  // Mapping from country codes to price field names in the product object
  const priceFieldMapping = {
    SA: "price_sar",
    AE: "price_aed",
    QA: "price_qar",
    KW: "price_kwd",
    BH: "price_bhd",
    OM: "price_omr",
    USD: "price_usd",
  };

  const priceField = priceFieldMapping[countryCode.toUpperCase()];

  if (!priceField || !product[priceField]) {
    // Fallback to selling_price if no specific currency price
    return {
      originalPrice: parseFloat(product.selling_price || 0),
      finalPrice: parseFloat(product.selling_price || 0),
      discountAmount: 0,
    };
  }

  const countryPrice = parseFloat(product[priceField]);

  // Check if there's a discount and calculate accordingly
  if (product.discount_details && product.discount_details.value > 0) {
    let discountAmount;
    let finalPrice;

    if (product.discount_details.type === "percentage") {
      discountAmount =
        (countryPrice * parseFloat(product.discount_details.value)) / 100;
      finalPrice = countryPrice - discountAmount;
    } else if (product.discount_details.type === "fixed") {
      // For fixed discount, use the exact same amount across all currencies
      discountAmount = parseFloat(product.discount_details.value);
      finalPrice = countryPrice - discountAmount;
    } else {
      discountAmount = 0;
      finalPrice = countryPrice;
    }

    const result = {
      originalPrice: countryPrice,
      finalPrice: Math.max(0, finalPrice),
      discountAmount: discountAmount,
    };

    return result;
  }

  // No discount
  const result = {
    originalPrice: countryPrice,
    finalPrice: countryPrice,
    discountAmount: 0,
  };

  return result;
};

// دالة مساعدة لحساب سعر المنتج حسب الدولة (للاستخدام في السلة والمفضلة)
export const calculateItemPriceByCountry = (item, countryCode) => {
  if (!item || !countryCode) {
    return item?.discountedPrice || item?.price || 0;
  }

  // التعامل مع الباقات - الآن تدعم الأسعار حسب الدولة
  if (item.type === "package" || item.isPackage) {
   

    // أولاً، محاولة استخدام prices object للباقات
    if (item.prices && typeof item.prices === "object") {
      const currencyMapping = {
        SA: "sar",
        AE: "aed",
        QA: "qar",
        KW: "kwd",
        BH: "bhd",
        OM: "omr",
        USD: "usd",
      };

      const currencyCodeKey = currencyMapping[countryCode.toUpperCase()];
      const priceData = item.prices[currencyCodeKey];

   
      if (priceData && priceData.price) {
        const finalPrice = parseFloat(priceData.final_price || priceData.price || 0);
     
        return finalPrice;
      }
    }

    // Fallback للباقات
    const fallbackPrice = (
      item.discountedPrice ||
      item.calculated_price ||
      item.total_price ||
      item.price ||
      0
    );
   
    return fallbackPrice;
  }

  // التعامل مع المنتجات - نفس المنطق السابق
  if (item.prices && typeof item.prices === "object") {
    const currencyMapping = {
      SA: "sar",
      AE: "aed",
      QA: "qar",
      KW: "kwd",
      BH: "bhd",
      OM: "omr",
      USD: "usd",
    };

    const currencyCodeKey = currencyMapping[countryCode.toUpperCase()];
    const priceData = item.prices[currencyCodeKey];

    if (priceData) {
      return parseFloat(priceData.final_price || priceData.price || 0);
    }
  }

  // Fallback للمنتجات
  return item.discountedPrice || item.price || 0;
};

export const formatPrice = (price, countryCode = null) => {
  // Handle special USD case for unsupported countries
  if (countryCode === "USD") {
    try {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
      return toEnglishDigits(formatted);
    } catch (error) {
      return `$${price.toLocaleString("en-US")}`;
    }
  }

  const currencyInfo = getCurrencyInfo(countryCode);

  try {
    // Try to use Intl.NumberFormat with the currency
    const formatted = new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    return toEnglishDigits(formatted);
  } catch (error) {
    // Fallback to custom formatting if Intl doesn't support the currency
    const formattedNumber = new Intl.NumberFormat(currencyInfo.locale).format(
      price
    );
    return `${toEnglishDigits(formattedNumber)} ${currencyInfo.symbol}`;
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
