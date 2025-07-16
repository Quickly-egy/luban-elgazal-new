export const APP_CONFIG = {
  NAME: 'لبان الغزال',
  VERSION: '1.0.0',
  DESCRIPTION: 'نقدم أفضل المنتجات والخدمات',
  COPYRIGHT: '© 2025 جميع الحقوق محفوظة لبان الغزال',
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CART: '/cart',
  ORDERS: '/orders',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LANGUAGE: 'language',
  CART: 'cart',
};

export const MESSAGES = {
  LOADING: 'جاري التحميل...',
  ERROR: 'حدث خطأ غير متوقع',
  NO_DATA: 'لا توجد بيانات',
  SUCCESS: 'تم بنجاح',
  NETWORK_ERROR: 'خطأ في الاتصال',
  UNAUTHORIZED: 'غير مصرح لك بالدخول',
  FORBIDDEN: 'ممنوع الوصول',
  NOT_FOUND: 'غير موجود',
};

export const FOOTER_DATA = {
  sections: [
    {
      title: 'حسابي',
      links: ['حسابي', 'الطلبات', 'المفضلة']
    },
    {
      title: 'لبان الغزال',
      links: ['سياسة الخصوصية', 'قواعد الاستخدام', 'الشحن والتوصيل', 'سياسة الاستبدال والاسترجاع', 'المدونة']
    },
    {
      title: 'أشهر التصنيفات',
      links: ['جميع المنتجات', 'باقات التوفير', 'اللبان الجودي للعلاج والأكل والشرب', 'منتجات اللبان للعناية بالجمال', 'اللبان الجودي للبخور']
    }
  ],
  contact: {
    description: 'نحن نقدم أجود أنواع اللبان الجودي الطبيعي من عُمان، مع ضمان الجودة والأصالة في كل منتج نقدمه لعملائنا الكرام',
    email: 'updated@example.com',
    phone: '+20 987654321',
    address: 'Updated Address'
  },
  social: ['facebook', 'twitter', 'instagram', 'youtube', 'tiktok'],
  payments: ['visa', 'mastercard', 'paypal', 'apple-pay', 'cash']
};
