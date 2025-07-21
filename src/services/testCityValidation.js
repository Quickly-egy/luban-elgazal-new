// 🧪 اختبار سريع للتحقق من دعم Jabal Ali
import { validateCity, getSupportedCities } from './shipping.js';

export const testJabalAliSupport = () => {

  
  const testCities = [
    'Jabal Ali',
    'JABAL ALI',
    'jabal ali',
    'Jebel Ali',
    'JEBEL ALI',
    'Dubai',
    'Abu Dhabi',
    'Riyadh'
  ];
  

  
  testCities.forEach(city => {
    const isSupported = validateCity(city);

  });
  
  // التحقق من Jabal Ali تحديداً
  const jabalAliSupported = validateCity('Jabal Ali');
  
  if (jabalAliSupported) {

  } else {

  }
  
  return {
    jabalAliSupported,
    testResults: testCities.map(city => ({
      city,
      supported: validateCity(city)
    }))
  };
};

// إضافة الاختبار للكونسول
if (typeof window !== 'undefined') {
  window.testJabalAliSupport = testJabalAliSupport;
  

} 