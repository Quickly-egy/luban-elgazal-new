// 🧪 اختبار سريع للتحقق من دعم Jabal Ali
import { validateCity, getSupportedCities } from './shipping.js';

export const testJabalAliSupport = () => {
  console.log('🧪 اختبار دعم Jabal Ali...');
  
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
  
  console.log('📍 المدن المدعومة حالياً:', getSupportedCities());
  
  testCities.forEach(city => {
    const isSupported = validateCity(city);
    console.log(`${isSupported ? '✅' : '❌'} ${city}: ${isSupported ? 'مدعومة' : 'غير مدعومة'}`);
  });
  
  // التحقق من Jabal Ali تحديداً
  const jabalAliSupported = validateCity('Jabal Ali');
  
  if (jabalAliSupported) {
    console.log('🎉 ممتاز! Jabal Ali أصبحت مدعومة الآن');
  } else {
    console.log('❌ لا تزال Jabal Ali غير مدعومة');
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
  
  console.log(`
🧪 اختبار دعم Jabal Ali:
- window.testJabalAliSupport() - اختبار دعم Jabal Ali والمدن الأخرى
  `);
} 