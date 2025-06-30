import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    FaCcVisa
} from 'react-icons/fa';
import { SiSamsungpay } from 'react-icons/si';
import useCartStore from '../../stores/cartStore';
import useLocationStore from '../../stores/locationStore';
import styles from './Checkout.module.css';
import { useCurrency } from '../../hooks';
import { calculateItemPriceByCountry } from '../../utils/formatters';
import { useAddresses } from '../../hooks/useAddresses';
import { ADDRESSES_ENDPOINTS } from '../../services/endpoints';
import useAuthStore from '../../stores/authStore';
import ShippingInfoModal from '../../components/profile/ShippingInfoModal';
import tabbyLogo from '../../assets/payment methods/تابي .png';
import SuccessModal from '../../components/common/SuccessModal/SuccessModal';

const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    TABBY: 'tabby',
    CASH_ON_DELIVERY: 'cash_on_delivery'
};

const MY_FATOORAH_OPTIONS = {
    VISA_MASTER: 'visa_master',
    APPLE_PAY: 'apple_pay',
    SAMSUNG_PAY: 'samsung_pay',
    MADA: 'mada'
};

const MadaLogo = () => (
    <img 
        src="/images/mada-logo.png" 
        alt="مدى" 
        className={styles.madaLogo}
        width="48"
        height="24"
    />
);

const TabbyLogo = () => (
    <img 
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
    const { addresses, isLoading: isLoadingAddresses, refetchAddresses } = useAddresses();
    const { user, token } = useAuthStore();
    const { countryCode } = useLocationStore();

    // تعريف جميع حالات المكون في البداية
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        selectedAddressId: '',
        discountCode: '',
        paymentMethod: 'card',
        newAddress: {
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'مصر',
            is_default: false
        }
    });

    const [discount, setDiscount] = useState(0);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');
    const [isProcessingDiscount, setIsProcessingDiscount] = useState(false);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [cashOnDeliveryFee, setCashOnDeliveryFee] = useState(15);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // useEffect للتحقق من تسجيل الدخول
    useEffect(() => {
        // إعطاء وقت قصير للتحقق من الـ auth state
        const checkAuth = setTimeout(() => {
            if (!token || !user) {
                // إذا لم يكن المستخدم مسجل دخول، عرض رسالة وتوجيه للصفحة الرئيسية
                alert('يجب تسجيل الدخول أولاً للوصول إلى صفحة الدفع');
                navigate('/');
                return;
            }
            setIsCheckingAuth(false);
        }, 100);

        return () => clearTimeout(checkAuth);
    }, [token, user, navigate]);

    // useEffect للتحقق من السلة الفارغة
    useEffect(() => {
        if (cartItems.length === 0 && !isRedirecting && !showSuccessModal) {
            navigate('/products');
        }
    }, [cartItems, navigate, isRedirecting, showSuccessModal]);

    // أكواد خصم وهمية للتجربة
    const discountCodes = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'NEWUSER': 15,
        'SUMMER25': 25
    };

    // بوابات الدفع المتاحة
    const paymentGateways = [
        { id: 'fawry', name: 'فوري', icon: '💳', color: '#FF6B35' },
        { id: 'vodafone', name: 'فودافون كاش', icon: '📱', color: '#E60000' },
        { id: 'paymob', name: 'PayMob', icon: '💰', color: '#2E86AB' },
        { id: 'paypal', name: 'PayPal', icon: <FaPaypal />, color: '#0070BA' },
        { id: 'visa', name: 'Visa', icon: <FaCcVisa />, color: '#1A1F71' },
        { id: 'mastercard', name: 'Mastercard', icon: <FaCcMastercard />, color: '#EB001B' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyDiscount = async () => {
        const code = formData.discountCode.trim().toUpperCase();

        if (!code) {
            setDiscountMessage('يرجى إدخال كود الخصم');
            return;
        }

        setIsProcessingDiscount(true);

        // محاكاة API call
        setTimeout(() => {
            if (discountCodes[code]) {
                const discountAmount = (getUpdatedTotalPrice() * discountCodes[code]) / 100;
                setDiscount(discountAmount);
                setDiscountApplied(true);
                setDiscountMessage(`تم تطبيق خصم ${discountCodes[code]}% بنجاح! 🎉`);
            } else {
                setDiscountMessage('كود الخصم غير صحيح');
                setDiscount(0);
                setDiscountApplied(false);
            }
            setIsProcessingDiscount(false);
        }, 1000);
    };

    const removeDiscount = () => {
        setDiscount(0);
        setDiscountApplied(false);
        setDiscountMessage('');
        setFormData(prev => ({ ...prev, discountCode: '' }));
    };

    const handlePaymentMethodSelect = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
        if (method === 'gateway') {
            setShowPaymentMethods(true);
        } else {
            setShowPaymentMethods(false);
            setSelectedPaymentGateway('');
        }
    };

    const getShippingCost = () => {
        const total = getUpdatedTotalPrice() - discount;
        return total >= 200 ? 0 : 50; // شحن مجاني للطلبات أكثر من 200 وحدة عملة
    };

    // تحديث حساب المجموع النهائي ليشمل رسوم الدفع عند الاستلام
    const getFinalTotal = () => {
        const subtotal = getUpdatedTotalPrice() - discount + getShippingCost();
        // إضافة رسوم الدفع عند الاستلام إذا تم اختيار هذه الطريقة
        const codFee = formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0;
        return subtotal + codFee;
    };

    // إضافة دالة للتحقق من صحة النموذج
    const isFormValid = () => {
        return formData.selectedAddressId && 
               (formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY || 
                formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD || 
                formData.paymentMethod === PAYMENT_METHODS.TABBY);
    };

    // تحديث دالة handlePlaceOrder
    const handlePlaceOrder = async () => {
        if (!isFormValid()) {
            alert('الرجاء اختيار عنوان التوصيل وطريقة الدفع');
            return;
        }

        if (!token) {
            alert('الرجاء تسجيل الدخول أولاً');
            return;
        }

        setIsProcessingOrder(true);

        try {
            // تجهيز بيانات الطلب
            const orderData = {
                client_id: user.id,
                client_address_id: formData.selectedAddressId,
                payment_method: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 'cash' : formData.paymentMethod,
                shipping_cost: getShippingCost(),
                fees: formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0,
                items: [
                    ...cartItems.map(item => ({
                        type: item.type || 'product',
                        id: item.id,
                        quantity: item.quantity,
                        unit_price: item.selling_price
                    }))
                ],
                notes: formData.notes || ''
            };

            console.log('Sending order data:', orderData);

            // إرسال الطلب للـ API
            const response = await fetch('https://app.quickly.codes/luban-elgazal/public/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                if (formData.paymentMethod === PAYMENT_METHODS.TABBY && data.data.payment?.tabby_checkout_url) {
                    // في حالة الدفع عن طريق تابي، توجيه المستخدم إلى صفحة الدفع
                    clearCart();
                    window.location.href = data.data.payment.tabby_checkout_url;
                } else {
                    // في حالة الدفع عند الاستلام أو طرق الدفع الأخرى
                    setIsRedirecting(true);
                    const orderDetails = data.data.order;
                    clearCart();
                    navigate('/order-success', { state: { orderDetails } });
                }
                return; // إضافة return هنا لمنع تنفيذ الكود التالي في حالة النجاح
            }
            
            // في حالة الفشل فقط
            throw new Error(data.message || 'حدث خطأ أثناء إنشاء الطلب');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('حدث خطأ أثناء إنشاء الطلب');
        } finally {
            setIsProcessingOrder(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setIsRedirecting(false);
        navigate('/');
    };

    // تحديث معالج تغيير العنوان
    const handleAddressSelect = (addressId) => {
        setFormData(prev => ({
            ...prev,
            selectedAddressId: addressId
        }));
        setShowNewAddressForm(false);
    };

    const handleNewAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            newAddress: {
                ...prev.newAddress,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
        // مسح رسالة الخطأ عند الكتابة
        setAddressError('');
    };

    const validateNewAddress = () => {
        const required = ['address_line1', 'city', 'state'];
        const missing = required.filter(field => !formData.newAddress[field].trim());
        
        if (missing.length > 0) {
            setAddressError('يرجى ملء جميع الحقول المطلوبة');
            return false;
        }
        return true;
    };

    const handleAddNewAddress = async () => {
        if (!validateNewAddress()) return;

        setIsAddingAddress(true);
        setAddressError('');

        try {
            const response = await fetch(ADDRESSES_ENDPOINTS.CREATE, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(formData.newAddress)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'حدث خطأ أثناء إضافة العنوان');
            }

            // تحديث قائمة العناوين
            await refetchAddresses();
            
            // اختيار العنوان الجديد
            setFormData(prev => ({
                ...prev,
                selectedAddressId: data.id,
                newAddress: {
                    address_line1: '',
                    address_line2: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    country: 'مصر',
                    is_default: false
                }
            }));

            // إغلاق نموذج العنوان الجديد
            setShowNewAddressForm(false);

        } catch (error) {
            setAddressError(error.message || 'حدث خطأ أثناء إضافة العنوان');
        } finally {
            setIsAddingAddress(false);
        }
    };

    const selectedAddress = addresses?.find(addr => addr.id === formData.selectedAddressId);

    // Calculate total with current country prices using shared utility
    const getUpdatedTotalPrice = React.useCallback(() => {
        return cartItems.reduce((total, item) => {
            const currentPrice = calculateItemPriceByCountry(item, countryCode);
            return total + (currentPrice * item.quantity);
        }, 0);
    }, [cartItems, countryCode]);

    // تحديث عرض تفاصيل الطلب
    const renderOrderSummary = () => {
        const total = getUpdatedTotalPrice() - discount;
        const remainingForFreeShipping = 200 - total;

        return (
            <div className={styles.orderSummary}>
                <h2>
                    <FaShoppingCart /> ملخص الطلب
                </h2>
                <div className={styles.summaryContent}>
                    {/* إضافة قسم المنتجات */}
                    <div className={styles.cartProducts}>
                        {cartItems.map((item) => {
                            const currentPrice = calculateItemPriceByCountry(item, countryCode);
                            return (
                                <div key={`checkout-${item.id}-${countryCode}`} className={styles.productItem}>
                                    <div className={styles.productImage}>
                                        <img src={item.image} alt={item.name} />
                                        {item.quantity > 1 && (
                                            <span className={styles.quantityBadge}>
                                                {item.quantity} قطع
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.productInfo}>
                                        <div className={styles.productHeader}>
                                            <h4>{item.name}</h4>
                                            {item.variant && <p className={styles.variant}>{item.variant}</p>}
                                        </div>
                                        <div className={styles.priceDetails}>
                                            <div className={styles.quantityInfo}>
                                                <span className={styles.quantityText}>الكمية: {item.quantity}</span>
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
                            <span>أضف منتجات بقيمة {formatPrice(remainingForFreeShipping)} للحصول على شحن مجاني!</span>
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
                        <span>{getShippingCost() === 0 ? 'مجاناً' : formatPrice(getShippingCost())}</span>
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
                        className={`${styles.checkoutButton} ${!isFormValid() ? styles.disabled : ''}`}
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
                                    ? 'تأكيد الطلب'
                                    : 'الدفع الآن'}
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
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? styles.selected : ''}`}
                        onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.CASH_ON_DELIVERY)}
                    >
                        <FaMoneyBillWave className={styles.methodIcon} />
                        <span>الدفع عند الاستلام</span>
                        {formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
                            <div className={styles.codFee}>
                                <FaMoneyBillWave style={{ fontSize: '14px', marginLeft: '6px' }} />
                                + {formatPrice(cashOnDeliveryFee)} رسوم الدفع عند الاستلام
                            </div>
                        )}
                    </div>

                    <div
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? styles.selected : ''}`}
                        onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.CREDIT_CARD)}
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
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.TABBY ? styles.selected : ''}`}
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

    return (
        <div className={styles.checkoutPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.checkoutHeader}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                    >
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
                                <div className={styles.loading}>
                                    جاري تحميل العناوين...
                                </div>
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
                                                        className={`${styles.addressCard} ${formData.selectedAddressId === address.id ? styles.selectedAddress : ''}`}
                                                        onClick={() => handleAddressSelect(address.id)}
                                                    >
                                    <input
                                                            type="radio"
                                                            name="selectedAddress"
                                                            checked={formData.selectedAddressId === address.id}
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