import React, { useState, useEffect, useCallback } from "react";
import { data, useNavigate } from "react-router-dom";
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
  FaMapMarkerAlt,
  FaSpinner,
  FaMoneyBillWave,
  FaApple,
  FaCcMastercard,
  FaCcVisa,
} from "react-icons/fa";
import { SiSamsungpay } from "react-icons/si";
import useCartStore from "../../stores/cartStore";
import useLocationStore from "../../stores/locationStore";
import styles from "./Checkout.module.css";
import { useCurrency, useGeography } from "../../hooks";
import { useCurrencyRates } from "../../hooks/useCurrencyRates";
import { calculateItemPriceByCountry } from "../../utils/formatters";
import { useAddresses } from "../../hooks/useAddresses";
import { ADDRESSES_ENDPOINTS } from "../../services/endpoints";
import useAuthStore from "../../stores/authStore";
import ShippingInfoModal from "../../components/profile/ShippingInfoModal";
import tabbyLogo from "../../assets/payment methods/تابي .png";
import SuccessModal from "../../components/common/SuccessModal/SuccessModal";
import { processShippingOrder } from "../../services/shipping";
import { testShippingAPI } from "../../services/testShipping";
import { toast } from "react-toastify";
import { getFreeShippingThreshold, getShippingPrice } from '../../utils';

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
  const { cartItems, getTotalPrice, getCartCount, clearCart } = useCartStore();
  const { formatPrice, currency } = useCurrency();
  const {
    addresses,
    isLoading: isLoadingAddresses,
    refetchAddresses,
  } = useAddresses();

  const { user, token } = useAuthStore();
  const { countryCode } = useLocationStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedAddressId: 0,
    discountCode: "",
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

  // ربط خيارات الدول بالدولة المختارة من location store
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

  // العثور على الدولة الحالية من location store
  const getCurrentCountryOption = () => {
    const currentCountry = countryOptions.find(country => country.countryCode === countryCode);
    return currentCountry || countryOptions.find(country => country.countryCode === "OM"); // عمان كافتراضي
  };

  // جميع useState hooks للهاتف يجب أن تكون هنا
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [internationalPhone, setInternationalPhone] = useState("");
  const [country, setCountry] = useState(getCurrentCountryOption());
  
  // متغيرات أخرى للصفحة
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [isProcessingDiscount, setIsProcessingDiscount] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(null);
  useEffect(() => {
    async function fetchShipping() {
      const code = countryCode || 'other';
      const price = await getShippingPrice(code);
      setShippingPrice(price);
    }
    fetchShipping();
  }, [countryCode]);

  useEffect(() => {
    async function fetchThreshold() {
      const code = countryCode || 'other';
      const amount = await getFreeShippingThreshold(code);
      setFreeShippingThreshold(amount);
    }
    fetchThreshold();
  }, [countryCode]);

  // تحديث formData عند تغيير الرقم الدولي
  useEffect(() => {
    if (internationalPhone) {
      setFormData(prev => ({
        ...prev,
        phone: internationalPhone
      }));
    }
  }, [internationalPhone]);
  const { countries } = useGeography();
  const countriesWithPostalCodes = countries.map((country) => {
    let postalCode = "";
    let countryCallCode = "";

    switch (country.countryCode) {
      case "SA":
        postalCode = "12271"; // السعودية - الرياض
        countryCallCode = "+966";
        break;
      case "AE":
        postalCode = "00000"; // الإمارات
        countryCallCode = "+971";
        break;
      case "QA":
        postalCode = "00000"; // قطر
        countryCallCode = "+974";
        break;
      case "BH":
        postalCode = "199"; // البحرين
        countryCallCode = "+973";
        break;
      case "OM":
        postalCode = "121"; // عمان
        countryCallCode = "+968";
        break;
      default:
        postalCode = "00000";
        countryCallCode = "+000"; // باقي الدول
    }

    return {
      ...country,
      postalCode,
      countryCallCode,
    };
  });

  // متغيرات إضافية للصفحة (غير مكررة)
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
  const [Token, setToken] = useState("");
  // useEffect للتحقق من تسجيل الدخول
  useEffect(() => {
    // إعطاء وقت قصير للتحقق من الـ auth state
    const checkAuth = setTimeout(() => {
      if (!token || !user) {
        // إذا لم يكن المستخدم مسجل دخول، عرض رسالة وتوجيه للصفحة الرئيسية
        toast.error("يجب تسجيل الدخول أولاً للوصول إلى صفحة الدفع");
        navigate("/");
        return;
      }
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [token, user]);

  // إضافة اختبار الشحن للـ window للتجربة
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.testShippingAPI = testShippingAPI;
    }
  }, []);

  // useEffect للتحقق من السلة الفارغة
  useEffect(() => {
    if (cartItems.length === 0 && !isRedirecting && !showSuccessModal) {
      navigate("/products");
    }
  }, [cartItems, navigate, isRedirecting, showSuccessModal]);

  // أكواد خصم وهمية للتجربة
  const discountCodes = {
    WELCOME10: 10,
    SAVE20: 20,
    NEWUSER: 15,
    SUMMER25: 25,
  };

  // بوابات الدفع المتاحة
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyDiscount = async () => {
    const code = formData.discountCode.trim().toUpperCase();

    if (!code) {
      setDiscountMessage("يرجى إدخال كود الخصم");
      return;
    }

    setIsProcessingDiscount(true);

    // محاكاة API call
    setTimeout(() => {
      if (discountCodes[code]) {
        const discountAmount =
          (getUpdatedTotalPrice() * discountCodes[code]) / 100;
        setDiscount(discountAmount);
        setDiscountApplied(true);
        setDiscountMessage(`تم تطبيق خصم ${discountCodes[code]}% بنجاح! 🎉`);
      } else {
        setDiscountMessage("كود الخصم غير صحيح");
        setDiscount(0);
        setDiscountApplied(false);
      }
      setIsProcessingDiscount(false);
    }, 1000);
  };

  const removeDiscount = () => {
    setDiscount(0);
    setDiscountApplied(false);
    setDiscountMessage("");
    setFormData((prev) => ({ ...prev, discountCode: "" }));
  };
const { currencyInfo } = useCurrency();
// استخدام القيم من API مع fallback للقيم الافتراضية
const { rates } = useCurrencyRates();
const CURRENCY_TO_SAR_RATE = {
  SAR: 1,
  AED: rates.AED || 1.0,
  QAR: rates.QAR || 1.0,
  OMR: rates.OMR || 9.75,
  BHD: rates.BHD || 9.95,
  KWD: rates.KWD || 12.28,
  USD: rates.USD || 3.75
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

  const getShippingCost = () => {
    // إذا مؤهل للشحن المجاني، الشحن مجاني
    const threshold = freeShippingThreshold !== null ? freeShippingThreshold : 200;
    const currentTotal = getUpdatedTotalPrice() - discount;
    if (currentTotal >= threshold) return 0;
    return shippingPrice !== null ? shippingPrice : 0;
  };

  // تحديث حساب المجموع النهائي ليشمل رسوم الدفع عند الاستلام
  const getFinalTotal = () => {
    const subtotal = getUpdatedTotalPrice() - discount + getShippingCost();
    // إضافة رسوم الدفع عند الاستلام إذا تم اختيار هذه الطريقة
    const codFee =
      formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
        ? cashOnDeliveryFee
        : 0;
    return subtotal + codFee;
  };












  // إضافة دالة للتحقق من صحة النموذج
  const isFormValid = () => {
    return (
      formData.selectedAddressId &&
      // internationalPhone.toString().trim() !== "" &&
      (formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ||
        formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD ||
        formData.paymentMethod === PAYMENT_METHODS.TABBY)
    );
  };

  // تحديث دالة handlePlaceOrder
  const handlePlaceOrder = async () => {
    if (!token) {
      alert("الرجاء تسجيل الدخول أولاً");
      return;
    }

    // التحقق من رقم الهاتف الإجباري
    // if (!internationalPhone) {
    //   setError("يرجى إدخال رقم هاتف صحيح بالتنسيق المطلوب");
    //   toast.error("يرجى إدخال رقم هاتف صحيح");
    //   return;
    // }

    setIsProcessingOrder(true);

    try {
      // تجهيز بيانات الطلب
      const orderData = {
        client_id: user.id,
        client_address_id: formData.selectedAddressId,
        payment_method:
          formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
            ? "cash"
            : formData.paymentMethod,
        shipping_cost: parseFloat(getShippingCost()),
        fees: parseFloat(
          formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
            ? cashOnDeliveryFee
            : 0
        ),
        items: cartItems.map((item) => ({
          type: item.type || "product",
          id: parseInt(item.id),
          quantity: parseInt(item.quantity),
          // جرب الحقول المختلفة للسعر
          unit_price: parseFloat(
            item.selling_price || item.price || item.unit_price || 0
          ),
        })),
        notes: formData.notes || "",
        // إضافة رقم الهاتف الدولي للطلب
        customer_phone: internationalPhone || phone,
      };

      // تحقق من أن كل item له سعر صحيح
      const invalidItems = orderData.items.filter(
        (item) => !item.unit_price || item.unit_price <= 0
      );
      if (invalidItems.length > 0) {
        alert("يوجد منتجات بأسعار غير صحيحة في السلة");
        return;
      }

      // إرسال الطلب للـ API
      const response = await fetch(
        "https://app.quickly.codes/luban-elgazal/public/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "manual",
          body: JSON.stringify(orderData),
        }
      );

      // اطبع كل تفاصيل الاستجابة مهما كان الكود
      const responseText = await response.text();
      console.log("Order API Response:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { raw: responseText };
      }

      if (true) {
        const orderDetails = data.data.order;
        // await GetToken()
        // await sendOrderToAsyadAPI(data.data);
        try {
          // تحضير بيانات الشحن
          const shippingOrderData = {
            ...orderDetails,
            customer_name:
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              user.name ||
              "عميل لبان الغزال",
            customer_email: user.email || "customer@lubanelgazal.com",
            customer_phone: user.phone || "966500000000",
            shipping_address: selectedAddress,
            final_amount: getFinalTotal(),
            shipping_cost: getShippingCost(),
            items: cartItems.map((item) => ({
              ...item,
              sku: item.sku || `PRODUCT_${item.id}`,
            })),
            notes: formData.notes || "طلب من موقع لبان الغزال",
          };

          // إنشاء طلب الشحن
          const shippingResult = await processShippingOrder(
            shippingOrderData,
            token
          );

          if (shippingResult.success) {
            // إضافة معلومات الشحن للطلب
            orderDetails.shipping_info = {
              tracking_number: shippingResult.trackingNumber,
              shipping_reference: shippingResult.shippingReference,
              awb_number: shippingResult.order_awb_number,
              consignment_number: shippingResult.consignment_number,
            };
          }
        } catch (shippingError) {
        }

        // بعد انتهاء الشحن فقط يتم إعادة التوجيه
        navigate("/order-success", { state: { orderDetails } });

        // متابعة العملية بناءً على طريقة الدفع
        if (
          formData.paymentMethod === PAYMENT_METHODS.TABBY &&
          data.data.payment?.tabby_checkout_url
        ) {
          // في حالة الدفع عن طريق تابي، توجيه المستخدم إلى صفحة الدفع
          clearCart();
          window.location.href = data.data.payment.tabby_checkout_url;
        } else {
          // في حالة الدفع عند الاستلام أو طرق الدفع الأخرى
          setIsRedirecting(true);
          clearCart();
        }
        return;
      }

      // في حالة الفشل فقط
      //   throw new Error(data.message || "حدث خطأ أثناء إنشاء الطلب");
    } catch (error) {
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsRedirecting(false);
    navigate("/");
  };


  // function convertOrderToAsyadFormat(orderData) {
  //     const order = orderData.order;
      
  //     // التحقق من البيانات الأساسية
  //     if (!order || !order.client || !order.address) {
  //         throw new Error('Missing required order data');
  //     }
      
  //     // معالجة القيم المالية
  //     const totalValue = parseFloat(order.total_amount?.replace(/[^\d.]/g, "") || "0");
  //     // const codAmount = parseFloat(order.final_amount?.replace(/[^\d.]/g, "") || "0");
  //     const shippingCost = parseFloat(order.shipping_cost || "0");
  //     const codAmount =
  //   order.payment_method === "cash"
  //       ? (currencyInfo.currency === "BHD" && totalValue > 300 ? 5 : totalValue)
  //       : 0;

  //     // إنشاء تفاصيل الطرود
  //     const result = cartItems.map((item, index) => ({
  //         Package_AWB: item.sku && item.sku !== "undefined"
  //             ? item.sku
  //             : `AUTO-${index + 1}`,
  //         Weight: 0.1,
  //         Width: 10,
  //         Length: 15,
  //         Height:20,
  //       quantity: Math.max(1, parseInt(item.quantity || 1, 10) || 1),
  //     }));
      
  //     // التحقق من وجود طرود صالحة
  //     if (!result || result.length === 0) {
  //         throw new Error('No valid package details generated');
        
  //     }
      
  //       const performaInvoice = cartItems.map((item, index) => {
  //     const quantity = parseInt(item.quantity) || 1;
  //     const declaredValue = parseFloat(
  //       item.selling_price || item.price || item.unit_price || 1
  //     );

  //     return {
  //       HSCode: "13019032", // ثابت
  //       ProductDescription: transliterate(item.name || "Product"),
  //       ItemQuantity: quantity,
  //       ProductDeclaredValue: Math.max(0.1, declaredValue),
  //       ItemRef: item.sku || `ITEM-${index + 1}`,
  //       ShipmentTypeCode: "Parcel",
  //       PackageTypeCode: "BOX",
  //       CountryOfOrigin: "AE", // أو عدل حسب الدولة المناسبة
  //       NetWeight: 0.5,
  //     };
  //   });
  //     return {
  //         ClientOrderRef: order.order_number,
  //         Description: "3mo yousef",
  //         HandlingTypee: "Others",
  //         ShippingCost: shippingCost,
  //         PaymentType: order.payment_method === "cash" ? "COD" : "prepaid",
  //         CODAmount: order.payment_method === "cash" ? codAmount : 0,
  //         ShipmentProduct: "EXPRESS",
  //         ShipmentService: "ALL_DAY",
  //         OrderType: "DROPOFF",
  //         PickupType: "",
  //         PickupDate: "",
  //         TotalShipmentValue: 5,
  //         JourneyOptions: {
  //             AdditionalInfo: "",
  //             NOReturn: false,
  //             Extra: {},
  //         },
  //         Consignee: {
  //             Name: transliterate(order.client.name || ""),
  //             CompanyName: "ASYAD Express",
  //             AddressLine1: transliterate(order.address.address_line1 || ""),
  //             AddressLine2: transliterate(order.address.address_line2 || ""),
  //             Area: "Muscat International Airport",
  //             City: transliterate(order.address.state || ""),
  //             Region: transliterate(order.address.state || ""),
  //           Country: order.address.country || "",
  //             ZipCode: "121",
  //             MobileNo: internationalPhone || "",
  //             PhoneNo: internationalPhone || "",
  //             Email: order.client.email || "",
  //             Latitude: "23.588797597",
  //             Longitude: "58.284848184",
  //             Instruction: "Delivery Instructions",
  //             What3Words: "",
  //             NationalId: "",
  //             ReferenceNo: "",
  //             Vattaxcode: "",
  //             Eorinumber: "",
  //         },
  //         Shipper: {
  //             ReturnAsSame: true,
  //             ContactName: "ASYAD Express",
  //             CompanyName: "Senders Company",
  //             AddressLine1: transliterate(order.address.address_line1 || ""),
  //             AddressLine2: transliterate(order.address.address_line2 || ""),
  //             Area: "Muscat International Airport",
  //             City: transliterate(order.address.state || ""),
  //             Region: transliterate(order.address.state || ""),
  //             Country: order.address.country,
  //             ZipCode: order.address.postal_code,
  //             MobileNo: internationalPhone || "",
  //             TelephoneNo: "",
  //             Email: order.client.email || "",
  //             Latitude: "23.581069146",
  //             Longitude: "58.257017583",
  //             NationalId: "",
  //             What3Words: "",
  //             ReferenceOrderNo: "",
  //             Vattaxcode: "",
  //             Eorinumber: "",
  //         },
  //         Return: {
  //             ContactName: "",
  //             CompanyName: "",
  //             AddressLine1: "",
  //             AddressLine2: "",
  //               Area: "",
  //             City: "",
  //             Region: "",
  //             Country:  "",
  //             ZipCode: "",
  //             MobileNo:  "",
  //             TelephoneNo: "",
  //             Email: "",
  //             Latitude: "0.0",
  //             Longitude: "0.0",
  //             NationalId: "",
  //             What3Words: "",
  //             ReferenceOrderNo: "",
  //             Vattaxcode: "",
  //             Eorinumber: ""
  //         },
  //         PackageDetails: result,
  //       ShipmentPerformaInvoice: performaInvoice,
  //     };
  // }






// async function sendOrderToAsyadAPI(orderData) {
//   try {
//     const convertedOrder = convertOrderToAsyadFormat(orderData);

//     const baseUrl = import.meta.env.VITE_API_BASE;
//     const token = import.meta.env.VITE_ASYAD_TOKEN;

//     const response = await fetch(`https://apix.asyadexpress.com/v2/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(convertedOrder),
//     });
   

//     const data = await response.json();


//     if (data.success && data.status === 201) {
//       toast.success("تم تقديم الطلب بنجاح");
//     }

//     if (data.status === 302) {
//       toast.warning("تم تقديم الطلب من قبل وجارٍ العمل عليه");
//     }

//     if (data.status === 400) {
//       toast.warning("خطأ في بيانات شركة الشحن، إذا كان الشحن دوليًّا");
//       navigate("/checkout");
//     }

//   } catch (error) {

//     throw error;
//   }
// }

  // تحديث الدولة عند تغيير location
  useEffect(() => {
    const newCountry = getCurrentCountryOption();
    setCountry(newCountry);
    // إعادة validate الرقم مع الدولة الجديدة
    if (phone) {
      validatePhoneWithCountry(phone, newCountry);
    }
  }, [countryCode]);

  // دالة تنسيق رقم الهاتف تلقائياً
  const formatPhoneNumber = (value, selectedCountry) => {
    // إزالة كل شيء عدا الأرقام
    const cleaned = value.replace(/\D/g, "");
    
    // تطبيق التنسيق حسب الدولة
    let formatted = cleaned;
    
    if (selectedCountry.countryCode === "SA" && cleaned.length <= 9) {
      // السعودية: 5XX XXX XXX
      if (cleaned.length >= 3) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3);
      if (cleaned.length >= 6) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3, 6) + " " + cleaned.substring(6);
    } else if ((selectedCountry.countryCode === "AE" || selectedCountry.countryCode === "OM") && cleaned.length <= 8) {
      // الإمارات/عمان: 5XX XXX XXX أو 7X XXX XXX
      if (cleaned.length >= 2) formatted = cleaned.substring(0, 2) + " " + cleaned.substring(2);
      if (cleaned.length >= 5) formatted = cleaned.substring(0, 2) + " " + cleaned.substring(2, 5) + " " + cleaned.substring(5);
    } else if ((selectedCountry.countryCode === "QA" || selectedCountry.countryCode === "BH" || selectedCountry.countryCode === "KW") && cleaned.length <= 8) {
      // قطر/البحرين/الكويت: 3XX XXX XXX
      if (cleaned.length >= 3) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3);
      if (cleaned.length >= 6) formatted = cleaned.substring(0, 3) + " " + cleaned.substring(3, 6) + " " + cleaned.substring(6);
    }
    
    return formatted;
  };

  // دالة التحقق من صحة الرقم
  const validatePhoneWithCountry = (phoneValue, selectedCountry) => {
    const cleaned = phoneValue.replace(/\D/g, "");

    if (!cleaned) {
      setError("");
      setInternationalPhone("");
      return;
    }

    if (!selectedCountry.regex.test(cleaned)) {
      setError(
        `رقم غير صحيح، يجب أن يكون مثل: ${selectedCountry.code} ${selectedCountry.example} (بدون كود الدولة)`
      );
      setInternationalPhone("");
    } else {
      setError("");
      const fullPhone = `${selectedCountry.code} ${cleaned}`;
      setInternationalPhone(fullPhone);
    }
  };

  const validatePhone = () => {
    validatePhoneWithCountry(phone, country);
  };

  // دالة التعامل مع تغيير رقم الهاتف
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value, country);
    setPhone(formatted);
    setError(""); // مسح الخطأ أثناء الكتابة
    
    // التحقق الفوري أثناء الكتابة
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= (country.countryCode === "OM" ? 8 : country.countryCode === "SA" ? 9 : 8)) {
      validatePhoneWithCountry(formatted, country);
    }
  };

  const handleAddressSelect = (addressId) => {
    setFormData((prev) => ({
      ...prev,
      selectedAddressId: addressId,
    }));
    setShowNewAddressForm(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
    // مسح رسالة الخطأ عند الكتابة
    setAddressError("");
  };

  const validateNewAddress = () => {
    const required = ["address_line1", "city", "state"];
    const missing = required.filter(
      (field) => !formData.newAddress[field].trim()
    );

    if (missing.length > 0) {
      setAddressError("يرجى ملء جميع الحقول المطلوبة");
      return false;
    }
    return true;
  };

  const handleAddNewAddress = async () => {
    if (!validateNewAddress()) return;

    setIsAddingAddress(true);
    setAddressError("");

    try {
      const response = await fetch(ADDRESSES_ENDPOINTS.CREATE, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData.newAddress),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إضافة العنوان");
      }

      // تحديث قائمة العناوين
      await refetchAddresses();

      // اختيار العنوان الجديد
      setFormData((prev) => ({
        ...prev,
        selectedAddressId: data.id,
        newAddress: {
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "مصر",
          is_default: false,
        },
      }));

      // إغلاق نموذج العنوان الجديد
      setShowNewAddressForm(false);
    } catch (error) {
      setAddressError(error.message || "حدث خطأ أثناء إضافة العنوان");
    } finally {
      setIsAddingAddress(false);
    }
  };

  const selectedAddress = addresses?.find(
    (addr) => addr.id === formData.selectedAddressId
  );

  // Calculate total with current country prices using shared utility
  const getUpdatedTotalPrice = React.useCallback(() => {
    return cartItems.reduce((total, item) => {
      const currentPrice = calculateItemPriceByCountry(item, countryCode);
      return total + currentPrice * item.quantity;
    }, 0);
  }, [cartItems, countryCode]);

  // تحديث عرض تفاصيل الطلب
  const renderOrderSummary = () => {
    const threshold = freeShippingThreshold !== null ? freeShippingThreshold : 200;
    const currentTotal = getUpdatedTotalPrice() - discount;
    const remainingForFreeShipping = Math.max(0, threshold - currentTotal);
    return (
      <div className={styles.orderSummary}>
        <h2>
          <FaShoppingCart /> ملخص الطلب
        </h2>
        <div className={styles.summaryContent}>
          {/* إضافة قسم المنتجات */}
          <div className={styles.cartProducts}>
            {cartItems.map((item) => {
              const currentPrice = calculateItemPriceByCountry(
                item,
                countryCode
              );

              return (
                <div
                  key={`checkout-${item.id}-${countryCode}`}
                  className={styles.productItem}
                >
                  <div className={styles.productImage}>
                    <img loading="lazy" src={item.image} alt={item.name} />
                    {item.quantity > 1 && (
                      <span className={styles.quantityBadge}>
                        {item.quantity} قطع
                      </span>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <h4>{item.name}</h4>
                      {item.variant && (
                        <p className={styles.variant}>{item.variant}</p>
                      )}
                    </div>
                    <div className={styles.priceDetails}>
                      <div className={styles.quantityInfo}>
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
      
          {/* رسالة الشحن المجاني */}
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

          {/* باقي تفاصيل الطلب */}
          <div className={styles.summaryRow}>
            <span>إجمالي المنتجات</span>
            <span>{formatPrice(getUpdatedTotalPrice())}</span>
          </div>

          {discount > 0 && (
            <div className={styles.summaryRow}>
              <span>الخصم</span>
              <span className={styles.discountAmount}>
                - {formatPrice(discount)}
              </span>
            </div>
          )}

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

  // عرض loading أثناء التحقق من الـ authentication
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

  // إذا لم يكن المستخدم مسجل دخول، لا نعرض شيء (سيتم التوجيه)
  if (!token || !user) {
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }
  // const formatPhone = (country) => {
  //   const item = countriesWithPostalCodes.find(
  //     (el) => el.countryName === country
  //   );
  //   return item.countryCallCode;
  // };

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
            {/* Shipping Information */}
            <div className={styles.formSection}>
              <h2>
                <FaTruck />
                معلومات الشحن
              </h2>

              {isLoadingAddresses ? (
                <div className={styles.loading}>جاري تحميل العناوين...</div>
              ) : (
                <>
                  {/* Saved Addresses */}
                  {addresses?.length > 0 && (
                    <div className={styles.savedAddresses}>
                      <h3>العناوين المحفوظة</h3>
                      <div className={styles.addressesList}>
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`${styles.addressCard} ${
                              formData.selectedAddressId === address.id
                                ? styles.selectedAddress
                                : ""
                            }`}
                            onClick={() => handleAddressSelect(address.id)}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={
                                formData.selectedAddressId === address.id
                              }
                              onChange={() => handleAddressSelect(address.id)}
                            />
                            <div className={styles.addressContent}>
                              <div className={styles.addressHeader}>
                                <FaMapMarkerAlt />
                                <h4>{address.address_line1}</h4>
                                {address.is_default && (
                                  <span className={styles.defaultBadge}>
                                    العنوان الافتراضي
                                  </span>
                                )}
                              </div>
                              {address.address_line2 && (
                                <p>{address.address_line2}</p>
                              )}
                              <p>{`${address.city}، ${address.state}، ${address.country}`}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Address Button */}

                  <button
                    style={{ marginBottom: "15px" }}
                    className={styles.addAddressBtn}
                    onClick={() => setShowShippingModal(true)}
                  >
                    <FaPlus />
                    إضافة عنوان جديد
                  </button>
                </>
              )}
         
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

      {/* موديل إضافة/تعديل العنوان */}
      <ShippingInfoModal
        countriesWithPostalCodes={countriesWithPostalCodes}
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
      />

      {/* إضافة موديل النجاح */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        orderDetails={orderDetails}
      />
    </div>
  );
};

export default Checkout;
