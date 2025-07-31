/**
 * Free Shipping Calculator
 * Calculates free shipping threshold based on API exchange rates
 */

// Base free shipping amount in Saudi Riyal
const BASE_FREE_SHIPPING_SAR = 200;

// Cache for currencies data
let currenciesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch currencies from API with caching
 */
export const fetchCurrencies = async () => {
  // Check if cache is still valid
  if (currenciesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return currenciesCache;
  }

  try {
    const response = await fetch('https://app.quickly.codes/luban-elgazal/public/api/currencies', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      // Update cache
      currenciesCache = data.data;
      cacheTimestamp = Date.now();
      return data.data;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching currencies:', error);
    
    // Return fallback exchange rates if API fails
    return [
      { code: "SAR", exchange_rate: "1.0000", symbol: "ريال", name: "ريال سعودي" },
      { code: "USD", exchange_rate: "3.7500", symbol: "$", name: "دولار أمريكي" },
      { code: "AED", exchange_rate: "1.0000", symbol: "AED", name: "درهم إماراتي" },
      { code: "QAR", exchange_rate: "1.0000", symbol: "QAR", name: "ريال قطري" },
      { code: "KWD", exchange_rate: "12.2800", symbol: "KWD", name: "دينار كويتي" },
      { code: "BHD", exchange_rate: "9.9500", symbol: "BHD", name: "دينار بحريني" },
      { code: "OMR", exchange_rate: "9.7500", symbol: "$", name: "ريال عماني" }
    ];
  }
};

/**
 * Calculate free shipping threshold for a specific currency
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'AED')
 * @returns {Promise<number>} - Free shipping threshold in the specified currency
 */
export const calculateFreeShippingThreshold = async (currencyCode = 'SAR') => {
  if (currencyCode === 'SAR') {
    return BASE_FREE_SHIPPING_SAR;
  }

  try {
    const currencies = await fetchCurrencies();
    const currency = currencies.find(c => c.code === currencyCode);
    
    if (!currency) {
      console.warn(`Currency ${currencyCode} not found, using SAR rate`);
      return BASE_FREE_SHIPPING_SAR;
    }

    // Convert SAR to target currency
    // exchange_rate tells us how many SAR = 1 unit of target currency
    // So to convert FROM SAR TO target currency: SAR_amount / exchange_rate
    const exchangeRate = parseFloat(currency.exchange_rate);
    const thresholdInTargetCurrency = BASE_FREE_SHIPPING_SAR / exchangeRate;
    
    // Round to reasonable decimal places
    return Math.round(thresholdInTargetCurrency * 100) / 100;
  } catch (error) {
    console.error('Error calculating free shipping threshold:', error);
    return BASE_FREE_SHIPPING_SAR; // Fallback to SAR amount
  }
};

/**
 * Get formatted free shipping threshold with currency symbol
 * @param {string} currencyCode - Currency code
 * @param {function} formatPrice - Price formatting function
 * @returns {Promise<string>} - Formatted threshold with currency symbol
 */
export const getFormattedFreeShippingThreshold = async (currencyCode, formatPrice) => {
  try {
    const threshold = await calculateFreeShippingThreshold(currencyCode);
    return formatPrice ? formatPrice(threshold) : `${threshold}`;
  } catch (error) {
    console.error('Error formatting free shipping threshold:', error);
    return formatPrice ? formatPrice(BASE_FREE_SHIPPING_SAR) : `${BASE_FREE_SHIPPING_SAR}`;
  }
};

/**
 * Calculate remaining amount needed for free shipping
 * @param {number} currentTotal - Current order total
 * @param {string} currencyCode - Currency code
 * @returns {Promise<number>} - Remaining amount needed for free shipping
 */
export const calculateRemainingForFreeShipping = async (currentTotal, currencyCode = 'SAR') => {
  try {
    const threshold = await calculateFreeShippingThreshold(currencyCode);
    return Math.max(0, threshold - currentTotal);
  } catch (error) {
    console.error('Error calculating remaining for free shipping:', error);
    return Math.max(0, BASE_FREE_SHIPPING_SAR - currentTotal);
  }
};

// Export the base amount for reference
export { BASE_FREE_SHIPPING_SAR };