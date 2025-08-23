import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { slugify, transliterate } from "transliteration";
import {
  FaShoppingCart,
  FaCreditCard,
  FaPaypal,
  FaMobile,
  FaPercent,
  FaCheck,
  FaTimes,
  FaTruck,
  FaArrowLeft,
  FaLock,
  FaPlus,
  FaMinus,
  FaTrash,
  FaMapMarkerAlt,
  FaSpinner,
  FaMoneyBillWave,
  FaApple,
  FaCcMastercard,
  FaCcVisa,
  FaUserPlus,
  FaGlobeAmericas,
  FaHome,
  FaMars,
  FaVenus
} from "react-icons/fa";
import { SiSamsungpay } from "react-icons/si";
import useCartStore from "../../stores/cartStore";
import useLocationStore from "../../stores/locationStore";
import RegistrationForm from "../../components/Checkout/RegistrationForm";
import styles from "./Checkout.module.css";
import { useCurrency, useGeography, useCities } from "../../hooks";
import { useCurrencyRates } from "../../hooks/useCurrencyRates";
import { calculateItemPriceByCountry } from "../../utils/formatters";
import { useAddresses } from "../../hooks/useAddresses";
import { ADDRESSES_ENDPOINTS } from "../../services/endpoints";
import useAuthStore from "../../stores/authStore";
import useOrderStore from "../../stores/orderStore";
import ShippingInfoModal from "../../components/profile/ShippingInfoModal";
import tabbyLogo from "../../assets/payment methods/تابي .png";
import SuccessModal from "../../components/common/SuccessModal/SuccessModal";
import { processShippingOrder } from "../../services/shipping";
import { testShippingAPI } from "../../services/testShipping";
import { toast } from "react-toastify";
import { getFreeShippingThreshold, getShippingPrice } from '../../utils';
import RegisterModal from "../../components/common/Header/authModals/RegisterModal";
import { COUNTRY_CODES, getCountryCode, formatPhoneWithCountryCode, validatePhoneNumber } from "../../utils/countryCodes";

const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  TABBY: "tabby",
  CASH_ON_DELIVERY: "cash_on_delivery",
};

const MY_FATOORAH_OPTIONS = {
  VISA_MASTER: "visa_master",
  APPLE_PAY: "apple_pay",
  SAMSUNG_PAY: "samsung_pay",
  MADA: "mada",
};

const MadaLogo = () => (
  <img
    src="/images/mada-logo.png"
    alt="مدى"
    className={styles.madaLogo}
    width="48"
    height="24"
    loading="lazy"
  />
);

const TabbyLogo = () => (
  <img
    loading="lazy"
    src={tabbyLogo}
    alt="تابي"
    className={styles.tabbyLogo}
    width="64"
    height="24"
  />
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getCartCount, clearCart, removeFromCart, updateQuantity } = useCartStore();
  const { formatPrice, currency, currencyInfo } = useCurrency();
  const {
    addresses,
    isLoading: isLoadingAddresses,
    refetchAddresses,
  } = useAddresses();

  // Fixed: Properly destructure user and token from auth store
  const { user, token, isAuthenticated } = useAuthStore();
  const { countryCode } = useLocationStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedCountry: "السعودية", // Default country for customer data
    gender: "male", // Default gender
    selectedAddressId: 0,
    paymentMethod: "card",

    newAddress: {
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    },
  });

  // Country options configuration
  const countryOptions = [
    { 
      name: "السعودية", 
      code: "+966", 
      countryCode: "SA",
      regex: /^5\d{8}$/, 
      placeholder: "5XXXXXXXX",
      example: "512345678"
    },
    { 
      name: "الإمارات", 
      code: "+971", 
      countryCode: "AE",
      regex: /^5\d{8}$/, 
      placeholder: "5XXXXXXXX",
      example: "501234567"
    },
    { 
      name: "عمان", 
      code: "+968", 
      countryCode: "OM",
      regex: /^[79]\d{7}$/, 
      placeholder: "7XXXXXXX أو 9XXXXXXX",
      example: "71234567"
    },
    { 
      name: "قطر", 
      code: "+974", 
      countryCode: "QA",
      regex: /^[3567]\d{7}$/, 
      placeholder: "3XXXXXXX أو 5XXXXXXX",
      example: "31234567"
    },
    { 
      name: "البحرين", 
      code: "+973", 
      countryCode: "BH",
      regex: /^[367]\d{7}$/, 
      placeholder: "3XXXXXXX",
      example: "31234567"
    },
    { 
      name: "الكويت", 
      code: "+965", 
      countryCode: "KW",
      regex: /^[569]\d{7}$/, 
      placeholder: "5XXXXXXX أو 6XXXXXXX",
      example: "51234567"
    }
  ];

  // Get current country option based on location store
  const getCurrentCountryOption = () => {
    const currentCountry = countryOptions.find(country => country.countryCode === countryCode);
    return currentCountry || countryOptions.find(country => country.countryCode === "OM");
  };

  // Phone-related state
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [internationalPhone, setInternationalPhone] = useState("");
  const [country, setCountry] = useState(getCurrentCountryOption());
  
  // Other state variables
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(null);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [cashOnDeliveryFee, setCashOnDeliveryFee] = useState(15);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isShippingDone, setIsShippingDone] = useState(false);
  const [Token, setOrderToken] = useState(""); // Renamed to avoid conflict
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingOrderData, setPendingOrderData] = useState(null);

  // دالة إرسال كلمة المرور عبر WhatsApp
  const sendPasswordViaWhatsApp = async (clientData, generatedPassword) => {
    try {
      console.log('Sending password via WhatsApp to:', clientData.phone);
      
      // تنسيق رقم الهاتف للـ WhatsApp API (إضافة @c.us)
      const formattedPhone = clientData.phone.replace(/\D/g, '') + '@c.us';
      
      // إعداد الرسالة
      const message = `🌟 *مرحباً ${clientData.first_name} ${clientData.last_name}!* 🌟

✅ تم إنشاء حسابك بنجاح في *لبان الغزال*

🔐 *بيانات الدخول:*
📧 البريد الإلكتروني: \`${clientData.email}\`
🔑 كلمة المرور: \`${generatedPassword}\`

💡 *نصائح مهمة:*
• احتفظ بكلمة المرور في مكان آمن
• يمكنك تغيير كلمة المرور من إعدادات الحساب
• استخدم هذه البيانات لتسجيل الدخول

🛍️ استمتع بتجربة التسوق معنا!
شكراً لاختيارك *لبان الغزال* 💚

---
*لبان الغزال - أجود أنواع اللبان العماني الأصيل*`;
      
      // بيانات الطلب
      const whatsappData = {
        chatId: formattedPhone,
        message: message
      };
      
      // إرسال الطلب إلى Green API
      const whatsappResponse = await fetch('https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappData)
      });
      
      const whatsappResult = await whatsappResponse.json();
      
      if (whatsappResponse.ok) {
        console.log('✅ Password sent via WhatsApp successfully:', whatsappResult);
      } else {
        console.error('❌ Failed to send password via WhatsApp:', whatsappResult);
        throw new Error(`WhatsApp API error: ${whatsappResult.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('❌ Error in sendPasswordViaWhatsApp:', error);
      throw error;
    }
  };




  // Fixed: Get shipping price and threshold
  useEffect(() => {
    async function fetchShipping() {
      try {
        const code = countryCode || 'other';
        const price = await getShippingPrice(code);
        setShippingPrice(price);
      } catch (error) {
        console.error('Error fetching shipping price:', error);
        setShippingPrice(0);
      }
    }
    fetchShipping();
  }, [countryCode]);

  useEffect(() => {
    async function fetchThreshold() {
      try {
        const code = countryCode || 'other';
        const amount = await getFreeShippingThreshold(code);
        setFreeShippingThreshold(amount);
      } catch (error) {
        console.error('Error fetching free shipping threshold:', error);
        setFreeShippingThreshold(200); // Default fallback
      }
    }
    fetchThreshold();
  }, [countryCode]);

  // Update formData when international phone changes
  useEffect(() => {
    if (internationalPhone) {
      setFormData(prev => ({
        ...prev,
        phone: internationalPhone
      }));
    }
  }, [internationalPhone]);

  const { countries } = useGeography();
  
  // جلب المدن بناءً على الدولة المختارة في العنوان
  const selectedAddressCountry = formData.newAddress.country;
  const { cities, loading: citiesLoading, error: citiesError } = useCities(selectedAddressCountry);
  
  const countriesWithPostalCodes = countries?.map((country) => {
    let postalCode = "";
    let countryCallCode = "";

    switch (country.countryCode) {
      case "SA":
        postalCode = "12271";
        countryCallCode = "+966";
        break;
      case "AE":
        postalCode = "00000";
        countryCallCode = "+971";
        break;
      case "QA":
        postalCode = "00000";
        countryCallCode = "+974";
        break;
      case "BH":
        postalCode = "199";
        countryCallCode = "+973";
        break;
      case "OM":
        postalCode = "121";
        countryCallCode = "+968";
        break;
      default:
        postalCode = "00000";
        countryCallCode = "+000";
    }

    return {
      ...country,
      postalCode,
      countryCallCode,
    };
  }) || []; // Add fallback for undefined countries

  // Authentication check effect
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!token || !user) {
        setShowRegistrationForm(true);
      }
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [token, user]);

  // Test shipping API for development
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.testShippingAPI = testShippingAPI;
    }
  }, []);

  // Redirect to products if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isRedirecting && !showSuccessModal) {
      navigate("/products");
    }
  }, [cartItems, navigate, isRedirecting, showSuccessModal]);

  // Payment gateways configuration
  const paymentGateways = [
    { id: "fawry", name: "فوري", icon: "💳", color: "#FF6B35" },
    { id: "vodafone", name: "فودافون كاش", icon: "📱", color: "#E60000" },
    { id: "paymob", name: "PayMob", icon: "💰", color: "#2E86AB" },
    { id: "paypal", name: "PayPal", icon: <FaPaypal />, color: "#0070BA" },
    { id: "visa", name: "Visa", icon: <FaCcVisa />, color: "#1A1F71" },
    {
      id: "mastercard",
      name: "Mastercard",
      icon: <FaCcMastercard />,
      color: "#EB001B",
    },
  ];

  // Currency rates with fallback values
  const { rates } = useCurrencyRates();
  const CURRENCY_TO_SAR_RATE = {
    SAR: 1,
    AED: rates?.AED || 1.0,
    QAR: rates?.QAR || 1.0,
    OMR: rates?.OMR || 9.75,
    BHD: rates?.BHD || 9.95,
    KWD: rates?.KWD || 12.28,
    USD: rates?.USD || 3.75
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle customer country selection and update phone automatically
  const handleCustomerCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => {
      const currentPhone = prev.phone;
      let newPhone = currentPhone;
      
      // If there's already a phone number, reformat it with the new country code
      if (currentPhone) {
        // Remove any existing country code first
        const cleanPhone = currentPhone.replace(/^\+?\d{1,4}/, '').replace(/^0+/, '');
        // Add new country code without + sign
        const newCountryCode = getCountryCode(selectedCountry);
        if (newCountryCode && cleanPhone) {
          newPhone = `${newCountryCode}${cleanPhone}`;
        }
      }
      
      return {
        ...prev,
        selectedCountry,
        phone: newPhone
      };
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
    if (method === "gateway") {
      setShowPaymentMethods(true);
    } else {
      setShowPaymentMethods(false);
      setSelectedPaymentGateway("");
    }
  };

  // Calculate shipping cost
  const getShippingCost = () => {
    const threshold = freeShippingThreshold !== null ? freeShippingThreshold : 200;
    const currentTotal = getUpdatedTotalPrice();
    if (currentTotal >= threshold) return 0;
    return shippingPrice !== null ? shippingPrice : 0;
  };

  // Calculate final total including COD fee
  const getFinalTotal = () => {
    const subtotal = getUpdatedTotalPrice() + getShippingCost();
    const codFee = formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0;
    return subtotal + codFee;
  };

  // Form validation
  const isFormValid = () => {
    const hasAddress = formData.newAddress.address_line1 && formData.newAddress.city && formData.newAddress.state;
    const hasPaymentMethod = formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ||
        formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD ||
        formData.paymentMethod === PAYMENT_METHODS.TABBY;
    
    console.log('Form validation:', {
      hasAddress,
      hasPaymentMethod,
      address: formData.newAddress,
      paymentMethod: formData.paymentMethod,
      isValid: hasAddress && hasPaymentMethod
    });
    
    return hasAddress && hasPaymentMethod;
  };

  // دالة إضافة عنوان جديد للمستخدم
  const addAddressToUser = async (currentToken) => {
    try {
      console.log("📍 === إضافة عنوان جديد ===");
      console.log("🏠 بيانات العنوان:", formData.newAddress);
      console.log("🔑 التوكن المستخدم:", currentToken ? `Bearer ${currentToken.substring(0, 20)}...` : 'لا يوجد توكن');
      
      const addressData = {
        address_line1: formData.newAddress.address_line1,
        address_line2: formData.newAddress.address_line2 || "",
        city: formData.newAddress.city,
        state: formData.newAddress.state,
        postal_code: formData.newAddress.postal_code || "",
        country: formData.newAddress.country,
        is_default: true
      };

      const response = await fetch(ADDRESSES_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(addressData)
      });

      const responseText = await response.text();
      console.log("📥 استجابة إضافة العنوان:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });

      if (response.status === 201) {
        const result = JSON.parse(responseText);
        console.log("✅ تم إضافة العنوان بنجاح، ID:", result.address?.id || result.id);
        return result.address?.id || result.id;
      } else {
        console.error("❌ فشل في إضافة العنوان:", response.status, responseText);
        throw new Error(`فشل في إضافة العنوان: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ خطأ في addAddressToUser:", error);
      throw error;
    }
  };

  // دالة تنفيذ الطلب فقط (بدون التحقق من التسجيل)
  const executeOrder = async (clientData = null, currentToken = null) => {
    console.log("🔥 === بداية executeOrder ===");
    
    if (!isFormValid()) {
      console.log("❌ النموذج غير صالح");
      alert("يرجى تعبئة جميع البيانات المطلوبة");
      return;
    }

    console.log("✅ النموذج صالح، بدء معالجة الطلب");
    setIsProcessingOrder(true);

    try {
      console.log("🔄 بدء معالجة الطلب...");
      
      // استخدام بيانات المستخدم المُمررة أو المحفوظة
      const currentUser = clientData || user;
      const tokenToUse = currentToken || token;
      console.log("👤 بيانات المستخدم المستخدمة:", currentUser);
      console.log("🔑 التوكن المستخدم:", tokenToUse ? `Bearer ${tokenToUse.substring(0, 20)}...` : 'لا يوجد توكن');
      
      if (!currentUser || !currentUser.id) {
        throw new Error("بيانات المستخدم غير متاحة");
      }

      if (!tokenToUse) {
        throw new Error("التوكن غير متاح");
      }
      
      // إنشاء العنوان أولاً
      console.log("🏠 إنشاء عنوان جديد...");
      const addressId = await addAddressToUser(tokenToUse);
      console.log("✅ تم إنشاء العنوان بنجاح، ID:", addressId);
      
      // Prepare order data with address ID
      const orderData = {
        client_id: currentUser.id,
        client_address_id: addressId,
        payment_method: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? "cash" : formData.paymentMethod,
        shipping_cost: parseFloat(getShippingCost()),
        fees: parseFloat(formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0),
        items: cartItems.map((item) => ({
          type: item.type || "product",
          id: parseInt(item.id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.selling_price || item.price || item.unit_price || 0),
        })),
        notes: "طلب من موقع لبان الغزال",
        customer_phone: internationalPhone || phone
      };

      // Validate item prices
      const invalidItems = orderData.items.filter(item => !item.unit_price || item.unit_price <= 0);
      if (invalidItems.length > 0) {
        alert("يوجد منتجات بأسعار غير صحيحة في السلة");
        return;
      }

      // طباعة بيانات الطلب في الـ console
      console.log("🚀 === إرسال طلب جديد ===");
      console.log("👤 معلومات المستخدم:", {
        id: user?.id,
        name: user?.first_name + ' ' + user?.last_name,
        email: user?.email,
        phone: user?.phone
      });
      console.log("🛒 محتويات السلة:", cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.selling_price || item.price,
        type: item.type
      })));
      console.log("🏠 عنوان الشحن:", formData.selectedAddressId ? 
        `عنوان محفوظ (ID: ${formData.selectedAddressId})` : 
        formData.newAddress
      );
      console.log("💰 تفاصيل السعر:", {
        subtotal: getUpdatedTotalPrice(),
        shipping: getShippingCost(),
        fees: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0,
        total: getFinalTotal()
      });
      console.log("📦 بيانات الطلب المُرسلة:", JSON.stringify(orderData, null, 2));
      console.log("🔗 API Endpoint:", "https://app.quickly.codes/luban-elgazal/public/api/orders");
      console.log("🔑 Authorization Token:", token ? `Bearer ${token.substring(0, 20)}...` : 'لا يوجد توكن');

      // Submit order to API
      const response = await fetch(
        "https://app.quickly.codes/luban-elgazal/public/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const responseText = await response.text();
      
      // طباعة استجابة الـ API في الـ console
      console.log("📥 === استجابة API ===");
      console.log("📊 حالة الاستجابة:", response.status, response.statusText);
      console.log("🔍 Headers:", Object.fromEntries(response.headers.entries()));
      console.log("📄 محتوى الاستجابة:", responseText);
      
      // محاولة تحليل JSON
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseText);
        console.log("✅ البيانات المُحللة:", JSON.stringify(parsedResponse, null, 2));
      } catch (parseError) {
        console.error("❌ فشل في تحليل JSON:", parseError);
        console.log("📝 النص الخام:", responseText);
      }

      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", e);
        data = { raw: responseText };
      }

      if (response.ok) {
        // Create order details locally using calculated values
        const apiOrderDetails = data.data?.order || {};
        const orderDetails = {
          ...apiOrderDetails,
          total_amount: getUpdatedTotalPrice(),
          shipping_cost: getShippingCost(),
          fees: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0,
          final_amount: getFinalTotal(),
          products: cartItems.filter(item => !item.is_package).map((item) => {
            const currentPrice = calculateItemPriceByCountry(item, countryCode);
            return {
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              unit_price: currentPrice,
              total_price: currentPrice * item.quantity,
              image: item.image,
              variant: item.variant || null,
              sku: item.sku || `PRODUCT_${item.id}`
            };
          }),
          packages: cartItems.filter(item => item.is_package).map((item) => {
            const currentPrice = calculateItemPriceByCountry(item, countryCode);
            return {
              package_id: item.id,
              package_name: item.name,
              quantity: item.quantity,
              unit_price: currentPrice,
              total_price: currentPrice * item.quantity,
              image: item.image,
              variant: item.variant || null,
              sku: item.sku || `PACKAGE_${item.id}`
            };
          }),
          client: {
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "عميل لبان الغزال",
            email: user.email || "customer@lubanelgazal.com",
            phone: user.phone || "966500000000"
          },
          address: {
            address_line1: formData.newAddress.address_line1,
            address_line2: formData.newAddress.address_line2,
            city: formData.newAddress.city,
            state: formData.newAddress.state,
            country: formData.newAddress.country,
            postal_code: formData.newAddress.postal_code
          },
          payment_method: formData.paymentMethod,
          notes: "طلب من موقع لبان الغزال",
          created_at: new Date().toISOString(),
          order_number: apiOrderDetails.order_number || `ORDER-${Date.now()}`
        };

        // Process shipping if needed
        try {
          const shippingOrderData = {
            ...orderDetails,
            customer_name: orderDetails.client.name,
            customer_email: orderDetails.client.email,
            customer_phone: orderDetails.client.phone,
            shipping_address: orderDetails.address,
            final_amount: getFinalTotal(),
            formatted_total_amount: `${getFinalTotal()} ${currencyInfo?.symbol || 'SAR'}`,
            currency: currencyInfo?.currency || 'SAR',
            shipping_cost: getShippingCost(),
            items: cartItems.map((item) => ({
              ...item,
              sku: item.sku || `PRODUCT_${item.id}`,
            })),
            notes: "طلب من موقع لبان الغزال",
          };

          const shippingResult = await processShippingOrder(shippingOrderData, token);
          
          if (shippingResult.success) {
            orderDetails.shipping_info = {
              tracking_number: shippingResult.trackingNumber,
              shipping_reference: shippingResult.shippingReference,
              awb_number: shippingResult.order_awb_number,
              consignment_number: shippingResult.consignment_number,
            };
          }
        } catch (shippingError) {
          console.error("Shipping error:", shippingError);
        }

        // Navigate to success page
        navigate("/order-success", { state: { orderDetails } });

        // Handle payment method specific actions
        if (formData.paymentMethod === PAYMENT_METHODS.TABBY && data.data?.payment?.tabby_checkout_url) {
          clearCart();
          window.location.href = data.data.payment.tabby_checkout_url;
        } else {
          setIsRedirecting(true);
          clearCart();
        }
      } else {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء الطلب");
      }
    } catch (error) {
      console.error("❌ === خطأ في executeOrder ===");
      console.error("🚨 نوع الخطأ:", error.name);
      console.error("📝 رسالة الخطأ:", error.message);
      console.error("📍 تفاصيل الخطأ:", error);
      console.error("🔍 Stack trace:", error.stack);
      alert("حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.");
    } finally {
      console.log("🏁 === انتهاء executeOrder ===");
      setIsProcessingOrder(false);
    }
  };

  // دالة إتمام الطلب الرئيسية - تتعامل مع التسجيل والطلب
  const handlePlaceOrder = async () => {
    console.log('🎯 === بداية handlePlaceOrder ===');
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.selectedCountry || !formData.gender) {
      alert('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    // التحقق من صحة رقم الهاتف
    const phoneWithoutCode = formData.phone.replace(getCountryCode(formData.selectedCountry), '');
    if (!phoneWithoutCode || phoneWithoutCode.length < 8) {
      alert('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsProcessingOrder(true);

    try {
      // تجهيز بيانات الطلب
      const orderData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.newAddress.address_line1,
          detailed_address: formData.newAddress.address_line2 || '',
          country: formData.newAddress.country,
          city: formData.newAddress.city
        },
        order: {
          items: cartItems
            .filter(item => !item.type || item.type === 'product')
            .map(item => ({
              product_id: item.id,
              quantity: parseInt(item.quantity),
              unit_price: calculateItemPriceByCountry(item, countryCode),
              product: {
                id: item.id,
                name: item.name
              }
            })),
          packages: cartItems
            .filter(item => item.type === 'package')
            .map(item => ({
              package_id: item.id,
              quantity: parseInt(item.quantity),
              unit_price: calculateItemPriceByCountry(item, countryCode),
              package: {
                id: item.id,
                name: item.name
              }
            })),
          total_amount: getUpdatedTotalPrice(),
          shipping_cost: getShippingCost(),
          fees: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0,
          final_amount: getFinalTotal(),
          currency: currencyInfo?.currency || 'SAR'
        },
        payment_method: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? "cash" : formData.paymentMethod
      };

      // طباعة البيانات المرسلة بتنسيق JSON
      console.log('📦 === بيانات الطلب المرسلة ===');
      console.log(JSON.stringify({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: {
          street: orderData.address.street,
          detailed_address: orderData.address.detailed_address,
          country: orderData.address.country,
          city: orderData.address.city
        },
        order: {
          items: orderData.order.items,
          packages: orderData.order.packages
        },
        payment_method: orderData.payment_method
      }, null, 2));

      const response = await fetch("https://app.quickly.codes/luban-elgazal/public/api/account-with-order", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      // طباعة الاستجابة من السيرفر
      console.log('📥 === استجابة السيرفر ===');
      console.log('Status Code:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response Body:', JSON.stringify(result, null, 2));

      if (response.status === 200) {
        const { status, data } = result;
        
        if (status === 'requires_verification' && data?.client_id && data?.otp) {
          // حفظ بيانات الطلب المعلق
          setPendingOrderData({
            userId: data.client_id,
            otp: data.otp
          });

          // إرسال OTP عبر WhatsApp
          const formattedPhone = formData.phone.replace(/\D/g, '') + '@c.us';
          const whatsappData = {
            chatId: formattedPhone,
            message: `رمز التحقق الخاص بك في لبان الغزال هو: ${data.otp}\n\nهذا الرمز صالح لمدة 5 دقائق فقط.`
          };

          console.log('📱 === بيانات إرسال OTP ===');
          console.log(JSON.stringify({
            url: 'https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: whatsappData
          }, null, 2));

          // إرسال OTP عبر WhatsApp
          fetch('https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(whatsappData)
          })
          .then(response => response.json())
          .then(result => {
            console.log('✅ تم إرسال OTP بنجاح:', result);
          })
          .catch(error => {
            console.error('❌ خطأ في إرسال OTP:', error);
          });
          
          // إظهار موديل OTP
          setShowOtpModal(true);
          
          toast.info('تم إرسال رمز التحقق إلى رقم هاتفك عبر WhatsApp', {
            position: "top-center",
            autoClose: 5000
          });
        } else {
          throw new Error('استجابة غير متوقعة من السيرفر');
        }
      } else if (response.status === 201) {
        console.log('🎯 === تم إنشاء الطلب بنجاح ===');
        console.log('📦 بيانات الطلب:', result);
        
        // حفظ بيانات الطلب في المخزن
        useOrderStore.getState().setCurrentOrder(result.data);

        // تنظيف السلة وإظهار رسالة النجاح
        clearCart();
        toast.success('تم إنشاء الطلب بنجاح!', {
          position: "top-center",
          autoClose: 3000
        });

        // التوجيه إلى صفحة النجاح
        console.log('🔄 جاري التوجيه إلى صفحة نجاح الطلب...');
        window.location.href = '/order-success';
      } else if (response.status === 200) {
        const { status, data } = result;
        
        if (status === 'requires_verification' && data?.user_id && data?.otp) {
          // حفظ بيانات الطلب المعلق
          setPendingOrderData({
            userId: data.user_id,
            otp: data.otp
          });

          // إرسال OTP عبر WhatsApp
          const formattedPhone = formData.phone.replace(/\D/g, '') + '@c.us';
          const whatsappData = {
            chatId: formattedPhone,
            message: `رمز التحقق الخاص بك في لبان الغزال هو: ${data.otp}\n\nهذا الرمز صالح لمدة 5 دقائق فقط.`
          };

          console.log('📱 === بيانات إرسال OTP ===');
          console.log(JSON.stringify({
            url: 'https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: whatsappData
          }, null, 2));

          // إرسال OTP عبر WhatsApp
          fetch('https://7103.api.greenapi.com/waInstance7103166449/sendMessage/20b6231d113742e8bbe65520a9642739b024707e306d4286b6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(whatsappData)
          })
          .then(response => response.json())
          .then(result => {
            console.log('✅ تم إرسال OTP بنجاح:', result);
          })
          .catch(error => {
            console.error('❌ خطأ في إرسال OTP:', error);
          });
          
          // إظهار موديل OTP
          setShowOtpModal(true);
          
          toast.info('تم إرسال رمز التحقق إلى رقم هاتفك عبر WhatsApp', {
            position: "top-center",
            autoClose: 5000
          });
        } else {
          throw new Error('استجابة غير متوقعة من السيرفر');
        }
      } else {
        throw new Error(result.message || 'حدث خطأ أثناء إنشاء الطلب');
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast.error(error.message || 'حدث خطأ أثناء إنشاء الطلب', {
        position: "top-center",
        autoClose: 5000
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // تعامل مع التسجيل وإتمام الطلب تلقائياً
  const handlePlaceOrderAfterRegistration = async (registrationResult) => {
    try {
      const { client: registeredUser, token: registeredToken } = registrationResult;
      
      // تحديث بيانات المصادقة
      useAuthStore.setState({
        user: registeredUser,
        token: registeredToken,
        isAuthenticated: true
      });
      
      // إغلاق نموذج التسجيل
      setShowRegistrationForm(false);
      
      // تنفيذ الطلب مباشرة بعد التسجيل الناجح
      await executeOrder(registrationResult.client, registrationResult.token);
    } catch (error) {
      console.error("Error in chained registration and order placement:", error);
      alert("حدث خطأ أثناء إنشاء الحساب وإتمام الطلب. الرجاء المحاولة مرة أخرى.");
    }
  };

  // Phone number formatting and validation
  const formatPhoneNumber = (value, selectedCountry) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    
    if (selectedCountry.countryCode === "SA" && cleaned.length <= 9) {
      if (cleaned.length >= 3) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3);
      if (cleaned.length >= 6) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3, 6) + " " + cleaned.substring(6);
    } else if ((selectedCountry.countryCode === "AE" || selectedCountry.countryCode === "OM") && cleaned.length <= 8) {
      if (cleaned.length >= 2) formatted = cleaned.substring(0, 2) + " " + cleaned.substring(2);
      if (cleaned.length >= 5) formatted = cleaned.substring(0, 2) + " " + cleaned.substring(2, 5) + " " + cleaned.substring(5);
    } else if ((selectedCountry.countryCode === "QA" || selectedCountry.countryCode === "BH" || selectedCountry.countryCode === "KW") && cleaned.length <= 8) {
      if (cleaned.length >= 3) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3);
      if (cleaned.length >= 6) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3, 6) + " " + cleaned.substring(6);
    }
    
    return formatted;
  };

  const validatePhoneWithCountry = (phoneValue, selectedCountry) => {
    const cleaned = phoneValue.replace(/\D/g, "");

    if (!cleaned) {
      setError("");
      setInternationalPhone("");
      return;
    }

    if (!selectedCountry.regex.test(cleaned)) {
      setError(`رقم غير صحيح، يجب أن يكون مثل: ${selectedCountry.code} ${selectedCountry.example} (بدون كود الدولة)`);
      setInternationalPhone("");
    } else {
      setError("");
      const fullPhone = `${selectedCountry.code} ${cleaned}`;
      setInternationalPhone(fullPhone);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value, country);
    setPhone(formatted);
    setError("");
    
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= (country.countryCode === "OM" ? 8 : country.countryCode === "SA" ? 9 : 8)) {
      validatePhoneWithCountry(formatted, country);
    }
  };

  // Address handling
  const handleAddressSelect = (addressId) => {
    setFormData((prev) => ({
      ...prev,
      selectedAddressId: addressId,
    }));
    setShowNewAddressForm(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // إذا تم تغيير الدولة، امسح المدينة المختارة
    const newAddressData = {
      ...formData.newAddress,
      [name]: type === "checkbox" ? checked : value,
    };
    
    if (name === 'country') {
      newAddressData.city = ''; // مسح المدينة عند تغيير الدولة
    }
    
    setFormData((prev) => ({
      ...prev,
      newAddress: newAddressData,
    }));
    setAddressError("");
  };

  const validateNewAddress = () => {
    const required = ["address_line1", "city", "state"];
    const missing = required.filter(field => !formData.newAddress[field]?.trim());

    if (missing.length > 0) {
      setAddressError("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }
    return true;
  };

  // Update country when location changes
  useEffect(() => {
    const newCountry = getCurrentCountryOption();
    setCountry(newCountry);
    if (phone) {
      validatePhoneWithCountry(phone, newCountry);
    }
  }, [countryCode]);

  // Calculate total with current country prices
  const getUpdatedTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const currentPrice = calculateItemPriceByCountry(item, countryCode);
      return total + currentPrice * item.quantity;
    }, 0);
  }, [cartItems, countryCode]);

  // Close success modal handler
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsRedirecting(false);
    navigate("/");
  };

  // دالة التحقق من OTP وإنشاء الطلب
  const handleVerifyOtp = async () => {
    if (!pendingOrderData) {
      setOtpError('حدث خطأ. يرجى المحاولة مرة أخرى');
      return;
    }

    try {
      setIsProcessingOrder(true);
      setOtpError('');

      // تجهيز بيانات التحقق
      const verifyData = {
        client_id: pendingOrderData.userId,
        otp: otpValue
      };

      // طباعة بيانات التحقق
      console.log('📤 === بيانات التحقق من OTP ===');
      console.log(JSON.stringify(verifyData, null, 2));

      const response = await fetch("https://app.quickly.codes/luban-elgazal/public/api/verify-otp-and-create-order", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(verifyData)
      });

      const result = await response.json();
      
      // طباعة استجابة التحقق
      console.log('📥 === استجابة التحقق من OTP ===');
      console.log('Status Code:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response Body:', JSON.stringify(result, null, 2));
      
      if (response.status === 201) {
        console.log('🎯 === تم التحقق من OTP وإنشاء الطلب بنجاح ===');
        console.log('📦 بيانات الطلب:', result);

        // تجهيز بيانات الطلب
        const orderData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.newAddress.address_line1,
            detailed_address: formData.newAddress.address_line2 || '',
            country: formData.newAddress.country,
            city: formData.newAddress.city
          },
          order: {
            items: cartItems
              .filter(item => !item.type || item.type === 'product')
              .map(item => ({
                product_id: item.id,
                quantity: parseInt(item.quantity),
                unit_price: calculateItemPriceByCountry(item, countryCode),
                product: {
                  id: item.id,
                  name: item.name
                }
              })),
            packages: cartItems
              .filter(item => item.type === 'package')
              .map(item => ({
                package_id: item.id,
                quantity: parseInt(item.quantity),
                unit_price: calculateItemPriceByCountry(item, countryCode),
                package: {
                  id: item.id,
                  name: item.name
                }
              })),
            total_amount: getUpdatedTotalPrice(),
            shipping_cost: getShippingCost(),
            fees: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0,
            final_amount: getFinalTotal(),
            currency: currencyInfo?.currency || 'SAR'
          },
          payment_method: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? "cash" : formData.paymentMethod
        };

        // طباعة بيانات الطلب
        console.log('📦 === بيانات الطلب المحفوظة ===');
        console.log(JSON.stringify(orderData, null, 2));

        // حفظ بيانات الطلب في المخزن
        useOrderStore.getState().setCurrentOrder(result);

        // إغلاق موديل OTP
        setShowOtpModal(false);
        
        // تنظيف السلة وإظهار رسالة النجاح
        clearCart();
        toast.success('تم إنشاء الطلب بنجاح!', {
          position: "top-center",
          autoClose: 3000
        });

        // التوجيه إلى صفحة النجاح
        console.log('🔄 جاري التوجيه إلى صفحة نجاح الطلب...');
        window.location.href = '/order-success';
      } else {
        const errorMessage = result.message || 'رمز التحقق غير صحيح';
        console.error('❌ خطأ في التحقق:', errorMessage);
        setOtpError(errorMessage);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('❌ خطأ في التحقق من OTP:', error);
      const errorMessage = 'حدث خطأ أثناء التحقق من الرمز';
      setOtpError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Render order summary
  const renderOrderSummary = () => {
    const threshold = freeShippingThreshold !== null ? freeShippingThreshold : 200;
    const currentTotal = getUpdatedTotalPrice();
    const remainingForFreeShipping = Math.max(0, threshold - currentTotal);

    return (
      <div className={styles.orderSummary}>
        <h2>
          <FaShoppingCart /> ملخص الطلب
        </h2>
        <div className={styles.summaryContent}>
          <div className={styles.cartProducts}>
            {cartItems.map((item) => {
              const currentPrice = calculateItemPriceByCountry(item, countryCode);

              return (
                <div key={`checkout-${item.id}-${countryCode}`} className={styles.productItem}>
                  <div className={styles.productImage}>
                    <img loading="lazy" src={item.image} alt={item.name} />
                    {item.quantity > 1 && (
                      <span className={styles.quantityBadge}>{item.quantity} قطع</span>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <h4>{item.name}</h4>
                      {item.variant && <p className={styles.variant}>{item.variant}</p>}
                    </div>
                    <div className={styles.priceDetails}>
                      <div className={styles.quantityDisplay}>
                        <span className={styles.quantityText}>
                          الكمية: {item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className={styles.priceBreakdown}>
                            {formatPrice(currentPrice)} × {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className={styles.priceInfo}>
                        <span className={styles.itemTotal}>
                          {formatPrice(currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.divider}></div>
      
          {/* Free shipping message */}
          {remainingForFreeShipping > 0 ? (
            <div className={styles.freeShippingMessage}>
              <span>
                أضف منتجات بقيمة {formatPrice(Number(remainingForFreeShipping.toFixed(2)))} للحصول
                على شحن مجاني!
              </span>
            </div>
          ) : (
            <div className={styles.freeShippingAchieved}>
              <span>مبروك! أنت مؤهل للشحن المجاني</span>
            </div>
          )}

          <div className={styles.divider}></div>

          {/* Order details */}
          <div className={styles.summaryRow}>
            <span>إجمالي المنتجات</span>
            <span>{formatPrice(getUpdatedTotalPrice())}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>رسوم الشحن</span>
            <span>
              {getShippingCost() === 0
                ? "مجاناً"
                : formatPrice(getShippingCost())}
            </span>
          </div>

          {formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
            <div className={styles.summaryRow}>
              <span>رسوم الدفع عند الاستلام</span>
              <span>{formatPrice(cashOnDeliveryFee)}</span>
            </div>
          )}

          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>الإجمالي النهائي</span>
            <span>{formatPrice(getFinalTotal())}</span>
          </div>

          <button
            className={`${styles.checkoutButton} ${
              !isFormValid() ? styles.disabled : ""
            }`}
            onClick={handlePlaceOrder}
            disabled={!isFormValid() || isProcessingOrder}
          >
            {isProcessingOrder ? (
              <>
                <FaSpinner className={styles.spinner} />
                جاري المعالجة...
              </>
            ) : (
              <>
                <FaLock />
                {formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
                  ? "تأكيد الطلب"
                  : "الدفع الآن"}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render payment methods
  const renderPaymentMethods = () => {
    return (
      <div className={styles.paymentMethods}>
        <div className={styles.methodsGrid}>
          <div
            className={`${styles.methodCard} ${
              formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
                ? styles.selected
                : ""
            }`}
            onClick={() =>
              handlePaymentMethodSelect(PAYMENT_METHODS.CASH_ON_DELIVERY)
            }
          >
            <FaMoneyBillWave className={styles.methodIcon} />
            <span>الدفع عند الاستلام</span>
            {formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
              <div className={styles.codFee}>
                <FaMoneyBillWave
                  style={{ fontSize: "14px", marginLeft: "6px" }}
                />
                + {formatPrice(cashOnDeliveryFee)} رسوم الدفع عند الاستلام
              </div>
            )}
          </div>

          <div
            className={`${styles.methodCard} ${
              formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD
                ? styles.selected
                : ""
            }`}
            onClick={() =>
              handlePaymentMethodSelect(PAYMENT_METHODS.CREDIT_CARD)
            }
          >
            <FaCreditCard className={styles.methodIcon} />
            <span>بطاقة ائتمان</span>
            <div className={styles.cardLogos}>
              <FaCcVisa />
              <FaCcMastercard />
              <MadaLogo />
            </div>
          </div>

          <div
            className={`${styles.methodCard} ${
              formData.paymentMethod === PAYMENT_METHODS.TABBY
                ? styles.selected
                : ""
            }`}
            onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.TABBY)}
          >
            <TabbyLogo />
            <span>قسم فاتورتك على 4 دفعات بدون فوائد</span>
            <div className={styles.tabbyInfo}>
              <span>💳 ادفع ربع المبلغ الآن والباقي على 3 أشهر</span>
              <span>✨ بدون رسوم أو فوائد • متوافق مع الشريعة</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state during auth check
  if (isCheckingAuth) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <span>جاري التحقق من صحة الجلسة...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.checkoutHeader}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <FaArrowLeft />
            <span>العودة</span>
          </button>
                 
          <div className={styles.headerContent}>
            <h1>
              <FaShoppingCart />
              إتمام الطلب
            </h1>
            <p>{getCartCount()} منتج في السلة</p>
          </div>
        </div>

        <div className={styles.checkoutContent}>
          {/* Order Summary - Right Side */}
          {renderOrderSummary()}

          {/* Checkout Form - Left Side */}
          <div className={styles.checkoutForm}>
            {/* Personal Information for Guest Users */}
            {!token || !user ? (
              <div className={styles.formSection}>
                <h2>
                  <FaUserPlus />
                  بيانات العميل
                </h2>
                <p>يرجى إدخال بياناتك الشخصية</p>
                
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>الاسم الأول *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, firstName: e.target.value}));
                        // مسح الخطأ عند الكتابة
                        if (registrationErrors.first_name) {
                          setRegistrationErrors(prev => ({...prev, first_name: null}));
                        }
                      }}
                      placeholder="مثال: أحمد"
                      required
                      className={registrationErrors.first_name ? styles.inputError : ""}
                    />
                    {registrationErrors.first_name && (
                      <span className={styles.fieldError}>{registrationErrors.first_name[0]}</span>
                    )}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>الاسم الأخير *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, lastName: e.target.value}));
                        // مسح الخطأ عند الكتابة
                        if (registrationErrors.last_name) {
                          setRegistrationErrors(prev => ({...prev, last_name: null}));
                        }
                      }}
                      placeholder="مثال: محمد"
                      required
                      className={registrationErrors.last_name ? styles.inputError : ""}
                    />
                    {registrationErrors.last_name && (
                      <span className={styles.fieldError}>{registrationErrors.last_name[0]}</span>
                    )}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>البريد الإلكتروني *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, email: e.target.value}));
                        // مسح الخطأ عند الكتابة
                        if (registrationErrors.email) {
                          setRegistrationErrors(prev => ({...prev, email: null}));
                        }
                      }}
                      placeholder="مثال: ahmed@example.com"
                      required
                      className={registrationErrors.email ? styles.inputError : ""}
                    />
                    {registrationErrors.email && (
                      <span className={styles.fieldError}>
                        {registrationErrors.email[0].includes('already been taken') ? 'البريد الإلكتروني مستخدم بالفعل' : registrationErrors.email[0]}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>
                      <FaGlobeAmericas style={{ marginLeft: "8px", color: "#667eea" }} />
                      الدولة *
                    </label>
                    <select
                      name="selectedCountry"
                      value={formData.selectedCountry}
                      onChange={handleCustomerCountryChange}
                      required
                      className={styles.countrySelect}
                    >
                      {Object.keys(COUNTRY_CODES).map((countryName) => (
                        <option key={countryName} value={countryName}>
                          {countryName} (+{COUNTRY_CODES[countryName]})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>رقم الهاتف *</label>
                    <div className={styles.phoneInputContainer}>
                      <span className={styles.countryCodeDisplay}>
                        {getCountryCode(formData.selectedCountry)}
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone.replace(getCountryCode(formData.selectedCountry), '')}
                        onChange={(e) => {
                          const phoneWithoutCode = e.target.value.replace(/[^\d]/g, '');
                          const countryCodeValue = getCountryCode(formData.selectedCountry);
                          setFormData(prev => ({
                            ...prev, 
                            phone: `${countryCodeValue}${phoneWithoutCode}`
                          }));
                          // مسح الخطأ عند الكتابة
                          if (registrationErrors.phone) {
                            setRegistrationErrors(prev => ({...prev, phone: null}));
                          }
                        }}
                        placeholder="501234567"
                        required
                        style={{ direction: "ltr", textAlign: "left" }}
                        className={registrationErrors.phone ? styles.inputError : ""}
                      />
                    </div>
                    <small className={styles.phoneHint}>
                      سيتم إضافة كود الدولة {getCountryCode(formData.selectedCountry)} تلقائياً (بدون علامة +)
                    </small>
                    {registrationErrors.phone && (
                      <span className={styles.fieldError}>
                        {registrationErrors.phone[0].includes('already been taken') ? 'رقم الهاتف مستخدم بالفعل' : registrationErrors.phone[0]}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>الجنس *</label>
                    <div className={styles.genderOptions}>
                      <label className={`${styles.genderOption} ${formData.gender === "male" ? styles.selected : ""}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={(e) => {
                            handleInputChange(e);
                            // مسح الخطأ عند الاختيار
                            if (registrationErrors.gender) {
                              setRegistrationErrors(prev => ({...prev, gender: null}));
                            }
                          }}
                        />
                        <FaMars style={{ marginLeft: "6px", color: "#4299e1" }} />
                        <span>ذكر</span>
                      </label>
                      
                      <label className={`${styles.genderOption} ${formData.gender === "female" ? styles.selected : ""}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={(e) => {
                            handleInputChange(e);
                            // مسح الخطأ عند الاختيار
                            if (registrationErrors.gender) {
                              setRegistrationErrors(prev => ({...prev, gender: null}));
                            }
                          }}
                        />
                        <FaVenus style={{ marginLeft: "6px", color: "#ed64a6" }} />
                        <span>أنثى</span>
                      </label>
                    </div>
                    {registrationErrors.gender && (
                      <span className={styles.fieldError}>الجنس مطلوب</span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Shipping Information */}
            <div className={styles.formSection}>
              <h2>
                <FaTruck />
                معلومات الشحن
              </h2>
              <p>يرجى إدخال عنوان الشحن للطلب</p>
              
              <div className={styles.addressForm}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>
                      <FaMapMarkerAlt
                        style={{ marginLeft: "8px", color: "#667eea" }}
                      />
                      العنوان الرئيسي
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.newAddress.address_line1}
                      onChange={handleNewAddressChange}
                      placeholder="مثال: شارع التحرير"
                      className={addressError && !formData.newAddress.address_line1 ? styles.inputError : ""}
                    />
                    {addressError && !formData.newAddress.address_line1 && (
                      <span className={styles.fieldError}>العنوان الرئيسي مطلوب</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>العنوان التفصيلي (اختياري)</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.newAddress.address_line2}
                      onChange={handleNewAddressChange}
                      placeholder="مثال: بجوار المسجد"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <FaGlobeAmericas
                        style={{ marginLeft: "8px", color: "#667eea" }}
                      />
                      الدولة
                    </label>
                    <select
                      name="country"
                      value={formData.newAddress.country}
                      onChange={(e) => {
                        const selectedCountry = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          newAddress: {
                            ...prev.newAddress,
                            country: selectedCountry
                          }
                        }));
                      }}
                      className={addressError && !formData.newAddress.country ? styles.inputError : ""}
                    >
                      <option value="">اختر الدولة</option>
                      {countriesWithPostalCodes?.map((country) => (
                        <option
                          key={country.countryCode}
                          value={country.countryName}
                        >
                          {country.countryName} ({country.countryCode})
                        </option>
                      ))}
                    </select>
                    {addressError && !formData.newAddress.country && (
                      <span className={styles.fieldError}>الدولة مطلوبة</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>المنطقة/المحافظة</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.newAddress.state}
                      onChange={handleNewAddressChange}
                      placeholder="أدخل اسم المنطقة أو المحافظة"
                      className={addressError && !formData.newAddress.state ? styles.inputError : ""}
                    />
                    {addressError && !formData.newAddress.state && (
                      <span className={styles.fieldError}>المنطقة/المحافظة مطلوبة</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>
                      <FaHome style={{ marginLeft: "8px", color: "#667eea" }} />
                      المدينة
                    </label>
                    <select
                      name="city"
                      value={formData.newAddress.city}
                      onChange={handleNewAddressChange}
                      className={addressError && !formData.newAddress.city ? styles.inputError : ""}
                      disabled={citiesLoading}
                    >
                      <option value="">
                        {!selectedAddressCountry 
                          ? 'اختر الدولة أولاً'
                          : citiesLoading 
                            ? 'جاري تحميل المدن...' 
                            : cities.length > 0 
                              ? `اختر المدينة (${cities.length} مدينة متاحة)`
                              : 'اختر المدينة'
                        }
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.nameEn || city.name}>
                          {city.nameAr || city.name}
                        </option>
                      ))}
                    </select>
                    {addressError && !formData.newAddress.city && (
                      <span className={styles.fieldError}>المدينة مطلوبة</span>
                    )}
                    {citiesError && (
                      <span className={styles.fieldError}>خطأ في تحميل المدن: {citiesError}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>الرمز البريدي</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.newAddress.postal_code}
                      onChange={handleNewAddressChange}
                      placeholder="مثال: 12345"
                    />
                  </div>


                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>
                <FaLock className={styles.secureIcon} />
                اختر طريقة الدفع
              </h2>

              {renderPaymentMethods()}
            </div>


          </div>
        </div>
      </div>

      {/* Shipping Info Modal */}
      <ShippingInfoModal
        countriesWithPostalCodes={countriesWithPostalCodes}
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        orderDetails={orderDetails}
      />

      {/* Registration Modal */}
      {showRegistrationForm && (
        <RegisterModal
          isOpen={showRegistrationForm}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handlePlaceOrderAfterRegistration}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>التحقق من رقم الهاتف</h2>
            <p>تم إرسال رمز التحقق إلى رقم هاتفك</p>
            
            <div className={styles.otpInput}>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="أدخل رمز التحقق"
                maxLength={6}
              />
              {otpError && <span className={styles.error}>{otpError}</span>}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.verifyButton}
                onClick={handleVerifyOtp}
                disabled={isProcessingOrder || !otpValue}
              >
                {isProcessingOrder ? (
                  <>
                    <FaSpinner className={styles.spinner} />
                    جاري التحقق...
                  </>
                ) : (
                  'تحقق وأكمل الطلب'
                )}
              </button>
              
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowOtpModal(false);
                  setPendingOrderData(null);
                  setOtpValue('');
                  setOtpError('');
                }}
                disabled={isProcessingOrder}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Checkout;
