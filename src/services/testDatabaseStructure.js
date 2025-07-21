// 🧪 اختبار بنية البيانات من قاعدة البيانات
export const testDatabaseStructure = () => {
 
  
  // محاكاة بيانات الطلب كما تأتي من قاعدة البيانات
  const orderFromDatabase = {
    id: 72,
    order_number: 'ORD-20250710-031',
    status: 'confirmed',
    client: {
      id: 15,
      name: 'Abdelrahman Elsayed',
      phone: '+201288266400',
      email: 'abdelrahman@example.com'
    },
    address: {
      id: 11,
      address_line1: 'ثبثبثبث',
      address_line2: 'بثب',
      city: 'fefefefefe', // المدينة المرفوضة
      state: 'Jabal Ali', // المحافظة التي يجب استخدامها
      country: 'UAE',
      postal_code: '12345'
    },
    items: [
      {
        id: 15,
        name: '١١١١١',
        sku: 'PROD_15',
        quantity: 1,
        price: 55
      }
    ],
    payment_method: 'cash',
    shipping_cost: 50,
    fees: 15,
    total_amount: 120,
    final_amount: 120
  };
  

  
  // محاكاة المنطق الجديد
  let regionValue;
  let addressLine1;
  let customerName;
  let customerPhone;
  
  if (orderFromDatabase.address) {
    regionValue = orderFromDatabase.address.state || orderFromDatabase.address.region || "المنطقة";
    addressLine1 = orderFromDatabase.address.address_line1 || orderFromDatabase.address.address || "العنوان الرئيسي";
    customerName = orderFromDatabase.client?.name || orderFromDatabase.customer_name || "عميل لبان الغزال";
    customerPhone = orderFromDatabase.client?.phone || orderFromDatabase.customer_phone || '';
  }
  
  const consigneeData = {
    Name: customerName,
    AddressLine1: addressLine1,
    Area: regionValue,
    City: regionValue, // استخدام المحافظة بدلاً من المدينة
    Region: regionValue,
    MobileNo: customerPhone
  };
  

  
  // التحقق من النتيجة
  const isCorrect = (
    consigneeData.City === "Jabal Ali" && // استخدام المحافظة
    consigneeData.City !== "fefefefefe" && // تجنب المدينة المرفوضة
    consigneeData.Area === consigneeData.City &&
    consigneeData.Region === consigneeData.City
  );
  
  if (isCorrect) {
   
  } else {

  }
  
  return {
    success: isCorrect,
    originalCity: orderFromDatabase.address.city,
    originalState: orderFromDatabase.address.state,
    usedValue: regionValue,
    consigneeData
  };
};

// اختبار مع بيانات مختلفة
export const testDifferentDataStructures = () => {

  
  const testCases = [
    {
      name: "بيانات من قاعدة البيانات",
      data: {
        client: { name: "عميل 1", phone: "123456789" },
        address: { state: "الرياض", city: "مدينة مرفوضة", address_line1: "عنوان 1" }
      }
    },
    {
      name: "بيانات من الإنشاء المباشر",
      data: {
        customer_name: "عميل 2",
        customer_phone: "987654321",
        shipping_address: { state: "جدة", city: "مدينة مرفوضة", address_line1: "عنوان 2" }
      }
    },
    {
      name: "بيانات مختلطة",
      data: {
        client: { name: "عميل 3" },
        customer_phone: "555666777",
        address: { region: "الدمام", city: "مدينة مرفوضة", address: "عنوان 3" }
      }
    }
  ];
  
  testCases.forEach(testCase => {
  
    
    // محاكاة المنطق
    let regionValue;
    let customerName;
    let customerPhone;
    
    if (testCase.data.address) {
      regionValue = testCase.data.address.state || testCase.data.address.region || "المنطقة";
      customerName = testCase.data.client?.name || testCase.data.customer_name || "عميل افتراضي";
      customerPhone = testCase.data.client?.phone || testCase.data.customer_phone || '';
    } else if (testCase.data.shipping_address) {
      regionValue = testCase.data.shipping_address.state || testCase.data.shipping_address.region || "المنطقة";
      customerName = testCase.data.customer_name || "عميل افتراضي";
      customerPhone = testCase.data.customer_phone || '';
    }
    
  
    const result = {
      Area: regionValue,
      City: regionValue,
      Region: regionValue,
      Name: customerName,
      MobileNo: customerPhone
    };
    
    
  });
};

// تشغيل الاختبارات
if (typeof window !== 'undefined') {
  window.testDatabaseStructure = testDatabaseStructure;
  window.testDifferentDataStructures = testDifferentDataStructures;
  

} 