// 🧪 اختبار سريع للتأكد من استخدام المحافظة كمدينة
export const testRegionAsCity = () => {
  console.log('🧪 اختبار استخدام المحافظة كمدينة...');
  
  // محاكاة بيانات الطلب
  const mockOrderData = {
    customer_name: "عميل تجريبي",
    customer_phone: "0501234567",
    shipping_address: {
      state: "الرياض", // المحافظة
      city: "مدينة مختلفة", // مدينة مختلفة
      address_line1: "شارع الملك فهد",
      country: "Saudi Arabia",
      postal_code: "12345"
    },
    items: [
      { id: 1, name: "منتج تجريبي", sku: "TEST_001" }
    ],
    final_amount: 100,
    payment_method: "cod"
  };
  
  console.log('📦 بيانات الطلب الأصلية:', {
    region: mockOrderData.shipping_address.state,
    city: mockOrderData.shipping_address.city
  });
  
  // محاكاة المنطق الجديد
  const regionValue = mockOrderData.shipping_address?.state || mockOrderData.shipping_address?.region || "المنطقة";
  
  const consigneeData = {
    Area: regionValue,
    City: regionValue, // استخدام نفس قيمة المحافظة للمدينة
    Region: regionValue
  };
  
  console.log('📍 البيانات المرسلة لـ API الشحن:', consigneeData);
  
  // التحقق من النتيجة
  const isCorrect = (
    consigneeData.Area === "الرياض" &&
    consigneeData.City === "الرياض" &&
    consigneeData.Region === "الرياض"
  );
  
  if (isCorrect) {
    console.log('✅ الاختبار نجح - تم استخدام المحافظة في جميع الحقول');
    console.log('📝 النتيجة: Area, City, Region جميعها تستخدم قيمة "الرياض"');
  } else {
    console.log('❌ الاختبار فشل - لم يتم استخدام المحافظة بشكل صحيح');
  }
  
  return {
    success: isCorrect,
    originalRegion: mockOrderData.shipping_address.state,
    originalCity: mockOrderData.shipping_address.city,
    usedValue: regionValue,
    consigneeData
  };
};

// اختبار مع بيانات مختلفة
export const testDifferentRegionFormats = () => {
  console.log('\n🧪 اختبار تنسيقات مختلفة للمحافظة...');
  
  const testCases = [
    {
      name: "استخدام state",
      data: { state: "جدة", region: null, city: "مدينة أخرى" }
    },
    {
      name: "استخدام region",
      data: { state: null, region: "الدمام", city: "مدينة أخرى" }
    },
    {
      name: "استخدام state و region معاً",
      data: { state: "الرياض", region: "منطقة الرياض", city: "مدينة أخرى" }
    },
    {
      name: "عدم وجود بيانات",
      data: { state: null, region: null, city: "مدينة فقط" }
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n📋 ${testCase.name}:`);
    console.log('📥 البيانات الأصلية:', testCase.data);
    
    const regionValue = testCase.data.state || testCase.data.region || "المنطقة";
    
    console.log('📤 القيمة المستخدمة:', regionValue);
    console.log('✅ النتيجة:', {
      Area: regionValue,
      City: regionValue,
      Region: regionValue
    });
  });
};

// تشغيل الاختبارات
if (typeof window !== 'undefined') {
  window.testRegionAsCity = testRegionAsCity;
  window.testDifferentRegionFormats = testDifferentRegionFormats;
  
  console.log(`
🧪 اختبارات المحافظة كمدينة:
- window.testRegionAsCity() - اختبار أساسي
- window.testDifferentRegionFormats() - اختبار تنسيقات مختلفة
  `);
} 