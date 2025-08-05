// Free Shipping Threshold Utility
// Fetches free shipping threshold per country from API, with caching

let freeShippingCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get free shipping threshold for a country code
 * @param {string} countryCode - e.g. 'SA', 'AE', 'OM', ...
 * @returns {Promise<number>} threshold amount
 */
export async function getFreeShippingThreshold(countryCode = 'SA') {
  if (freeShippingCache && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) {
    return findThreshold(freeShippingCache, countryCode);
  }
  try {
    const res = await fetch('https://app.quickly.codes/luban-elgazal/public/api/free-shipping-thresholds', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer 6TslV_sodBqqOIY4f3WNx1fGMq2u-f7n'
      }
    });
    const data = await res.json();
    if (data.success && data.data) {
      freeShippingCache = data.data;
      cacheTime = Date.now();
      return findThreshold(data.data, countryCode);
    }
  } catch (e) {
    // ignore
  }
  return 200; // fallback
}

function findThreshold(list, code) {
  const found = list.find(x => x.country_code === code);
  if (found) return Number(found.amount);
  const other = list.find(x => x.country_code === 'other');
  return other ? Number(other.amount) : 200;
}