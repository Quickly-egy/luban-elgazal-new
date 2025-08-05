let shippingPriceCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getShippingPrice(countryCode = 'SA') {
  if (shippingPriceCache && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) {
    return findShipping(shippingPriceCache, countryCode);
  }
  const res = await fetch('https://app.quickly.codes/luban-elgazal/public/api/shipping-prices', {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer 6TslV_sodBqqOIY4f3WNx1fGMq2u-f7n'
    }
  });
  const data = await res.json();
  if (data.success && data.data) {
    shippingPriceCache = data.data;
    cacheTime = Date.now();
    return findShipping(data.data, countryCode);
  }
  return 0; // fallback
}

function findShipping(list, code) {
  const found = list.find(x => x.country_code === code);
  if (found) return Number(found.shipping_price);
  const other = list.find(x => x.country_code === 'other');
  return other ? Number(other.shipping_price) : 0;
}