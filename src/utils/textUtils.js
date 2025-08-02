/**
 * إزالة التشكيل (النبر) من النص العربي
 * @param {string} text - النص المراد إزالة التشكيل منه
 * @returns {string} - النص بدون تشكيل
 */
export const removeDiacritics = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // حركات التشكيل العربية
  const arabicDiacritics = [
    '\u064B', // تنوين فتح ً
    '\u064C', // تنوين ضم ٌ
    '\u064D', // تنوين كسر ٍ
    '\u064E', // فتحة َ
    '\u064F', // ضمة ُ
    '\u0650', // كسرة ِ
    '\u0651', // شدة ّ
    '\u0652', // سكون ْ
    '\u0653', // مدة ٓ
    '\u0654', // همزة علوية ٔ
    '\u0655', // همزة سفلية ٕ
    '\u0656', // صفر مستطيل ٖ
    '\u0657', // قلقلة ٗ
    '\u0658', // نون غنة ٘
    '\u0659', // سكتة ٙ
    '\u065A', // صفر مستدير ٚ
    '\u065B', // صفر مستطيل عكسي ٛ
    '\u065C', // صفر صغير ٜ
    '\u065D', // رقم صغير ٝ
    '\u065E', // فتحة بحركة ٞ
    '\u065F', // واو صغيرة ٟ
    '\u0670', // ألف خنجرية ٰ
  ];

  // إنشاء regex pattern لإزالة جميع الحركات
  const diacriticsRegex = new RegExp(`[${arabicDiacritics.join('')}]`, 'g');
  
  // إزالة التشكيل
  return text.replace(diacriticsRegex, '');
};

/**
 * تنظيف النص من المسافات الزائدة والتشكيل
 * @param {string} text - النص المراد تنظيفه
 * @returns {string} - النص المنظف
 */
export const cleanText = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  return removeDiacritics(text)
    .replace(/\s+/g, ' ') // استبدال المسافات المتعددة بمسافة واحدة
    .trim(); // إزالة المسافات من البداية والنهاية
};

/**
 * إزالة التشكيل من اسم المنتج مع الحفاظ على التنسيق
 * @param {string} productName - اسم المنتج
 * @returns {string} - اسم المنتج بدون تشكيل
 */
export const cleanProductName = (productName) => {
  return cleanText(productName);
}; 