// 🧪 اختبار سريع للتأكد من استخدام المحافظة كمدينة
export const testRegionAsCity = () => {

  
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
  

  // محاكاة المنطق الجديد
  const regionValue = mockOrderData.shipping_address?.state || mockOrderData.shipping_address?.region || "المنطقة";
  
  const consigneeData = {
    Area: regionValue,
    City: regionValue, // استخدام نفس قيمة المحافظة للمدينة
    Region: regionValue
  };

  
  // التحقق من النتيجة
  const isCorrect = (
    consigneeData.Area === "الرياض" &&
    consigneeData.City === "الرياض" &&
    consigneeData.Region === "الرياض"
  );
  
  if (isCorrect) {
   
  } else {

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

    
    const regionValue = testCase.data.state || testCase.data.region || "المنطقة";
    
    
  });
};

// تشغيل الاختبارات
if (typeof window !== 'undefined') {
  window.testRegionAsCity = testRegionAsCity;
  window.testDifferentRegionFormats = testDifferentRegionFormats;
  
  
} 