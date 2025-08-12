// Country codes mapping for Arab countries
export const COUNTRY_CODES = {
  "مصر": "20",
  "السعودية": "966", 
  "الإمارات": "971",
  "الكويت": "965",
  "قطر": "974",
  "البحرين": "973",
  "عمان": "968",
  "الأردن": "962",
  "لبنان": "961",
  "سوريا": "963",
  "العراق": "964",
  "اليمن": "967",
  "ليبيا": "218",
  "تونس": "216",
  "الجزائر": "213",
  "المغرب": "212",
  "السودان": "249",
  "فلسطين": "970"
};

// Get country code by country name
export const getCountryCode = (countryName) => {
  return COUNTRY_CODES[countryName] || "";
};

// Get country name by country code
export const getCountryByCode = (code) => {
  return Object.keys(COUNTRY_CODES).find(country => COUNTRY_CODES[country] === code) || "";
};

// Format phone number with country code
export const formatPhoneWithCountryCode = (phone, countryName) => {
  if (!phone || !countryName) return phone;
  
  const countryCode = getCountryCode(countryName);
  if (!countryCode) return phone;
  
  // Remove any existing country code, + signs, and leading zeros
  let cleanPhone = phone.toString();
  
  // Remove country code if it exists at the beginning
  const codeWithoutPlus = countryCode.replace('+', '');
  if (cleanPhone.startsWith(countryCode)) {
    cleanPhone = cleanPhone.substring(countryCode.length);
  } else if (cleanPhone.startsWith(codeWithoutPlus)) {
    cleanPhone = cleanPhone.substring(codeWithoutPlus.length);
  } else if (cleanPhone.startsWith('+' + codeWithoutPlus)) {
    cleanPhone = cleanPhone.substring(codeWithoutPlus.length + 1);
  }
  
  // Remove leading zeros
  cleanPhone = cleanPhone.replace(/^0+/, '');
  
  // Remove any non-digit characters except for the first +
  cleanPhone = cleanPhone.replace(/[^\d]/g, '');
  
  return `${countryCode}${cleanPhone}`;
};

// Validate phone number format
export const validatePhoneNumber = (phone, countryName) => {
  if (!phone || !countryName) return false;
  
  const countryCode = getCountryCode(countryName);
  if (!countryCode) return false;
  
  // Remove country code and validate remaining digits
  const cleanPhone = phone.replace(countryCode, '').replace(/^0+/, '');
  
  // Basic validation: should be 8-12 digits
  return /^\d{8,12}$/.test(cleanPhone);
};
