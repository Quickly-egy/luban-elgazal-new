import React, { useState, useEffect } from 'react';
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
import styles from './Checkout.module.css';
import { useCurrency } from '../../hooks';
import { useAddresses } from '../../hooks/useAddresses';
import { ADDRESSES_ENDPOINTS } from '../../services/endpoints';
import useAuthStore from '../../stores/authStore';
import ShippingInfoModal from '../../components/profile/ShippingInfoModal';
import tabbyLogo from '../../assets/payment methods/تابي .png';

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
    const { cartItems, getTotalPrice, getCartCount } = useCartStore();
    const { formatPrice, currency } = useCurrency();
    const { addresses, isLoading: isLoadingAddresses, refetchAddresses } = useAddresses();
    const { user } = useAuthStore();

    // إذا كانت السلة فارغة، توجيه للمنتجات
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/products');
        }
    }, [cartItems, navigate]);

    // State للنموذج
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        selectedAddressId: '',
        discountCode: '',
        paymentMethod: 'card',
        // حقول العنوان الجديد
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

    // State للخصم والإشعارات
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

    // إضافة state لرسوم الدفع عند الاستلام
    const [cashOnDeliveryFee, setCashOnDeliveryFee] = useState(15);

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
                const discountAmount = (getTotalPrice() * discountCodes[code]) / 100;
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
        const total = getTotalPrice() - discount;
        return total >= 200 ? 0 : 50; // شحن مجاني للطلبات أكثر من 200 وحدة عملة
    };

    // تحديث حساب المجموع النهائي ليشمل رسوم الدفع عند الاستلام
    const getFinalTotal = () => {
        const subtotal = getTotalPrice() - discount + getShippingCost();
        // إضافة رسوم الدفع عند الاستلام إذا تم اختيار هذه الطريقة
        const codFee = formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? cashOnDeliveryFee : 0;
        return subtotal + codFee;
    };

    const handlePlaceOrder = async () => {
        // التحقق من صحة البيانات
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'governorate'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            alert('يرجى ملء جميع البيانات المطلوبة');
            return;
        }

        if (formData.paymentMethod === 'gateway' && !selectedPaymentGateway) {
            alert('يرجى اختيار بوابة الدفع');
            return;
        }

        setIsProcessingOrder(true);

        // محاكاة معالجة الطلب
        setTimeout(() => {
            alert(`تم تأكيد طلبك بنجاح! 🎉\nرقم الطلب: #${Date.now()}\nسيتم التواصل معك قريباً`);
            navigate('/');
            setIsProcessingOrder(false);
        }, 2000);
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

    // تحديث عرض تفاصيل الطلب
    const renderOrderSummary = () => {
        const total = getTotalPrice() - discount;
        const remainingForFreeShipping = 200 - total;

        return (
            <div className={styles.orderSummary}>
                <h3>ملخص الطلب</h3>
                
                {/* إضافة قسم المنتجات */}
                <div className={styles.cartProducts}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.productItem}>
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
                                                {formatPrice(item.price)} × {item.quantity}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.itemTotal}>
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    <span>{formatPrice(getTotalPrice())}</span>
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
            </div>
        );
    };

    const renderPaymentMethods = () => {
        return (
            <div className={styles.paymentMethods}>
                <h3>طريقة الدفع</h3>
                <div className={styles.methodsGrid}>
                    {/* بطاقة الائتمان */}
                    <div
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? styles.selected : ''}`}
                        onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.CREDIT_CARD)}
                    >
                        <FaCreditCard />
                        <span>الدفع بالبطاقة الائتمانية / البنكية</span>
                    </div>

                    {/* تابي */}
                    <div
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.TABBY ? styles.selected : ''}`}
                        onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.TABBY)}
                    >
                        <TabbyLogo />
                        <span>قسم فاتورتك</span>
                    </div>

                    {/* الدفع عند الاستلام */}
                    <div
                        className={`${styles.methodCard} ${formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? styles.selected : ''}`}
                        onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.CASH_ON_DELIVERY)}
                    >
                        <div className={styles.codMethod}>
                            <FaMoneyBillWave />
                            <span>الدفع عند الاستلام</span>
                            <div className={styles.codFee}>
                                <small>رسوم إضافية: {formatPrice(cashOnDeliveryFee)}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* عرض خيارات الدفع الإضافية حسب الطريقة المختارة */}
                {formData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                    <div className={styles.paymentOptions}>
                        <div className={styles.optionsGrid}>
                            <button 
                                className={`${styles.optionButton} ${selectedPaymentGateway === MY_FATOORAH_OPTIONS.VISA_MASTER ? styles.selected : ''}`}
                                onClick={() => setSelectedPaymentGateway(MY_FATOORAH_OPTIONS.VISA_MASTER)}
                            >
                                <div className={styles.optionIcons}>
                                    <FaCcVisa />
                                    <FaCcMastercard />
                                </div>
                                <span>فيزا / ماستر كارد</span>
                            </button>

                            <button 
                                className={`${styles.optionButton} ${selectedPaymentGateway === MY_FATOORAH_OPTIONS.APPLE_PAY ? styles.selected : ''}`}
                                onClick={() => setSelectedPaymentGateway(MY_FATOORAH_OPTIONS.APPLE_PAY)}
                            >
                                <FaApple />
                                <span>Apple Pay</span>
                            </button>

                            <button 
                                className={`${styles.optionButton} ${selectedPaymentGateway === MY_FATOORAH_OPTIONS.SAMSUNG_PAY ? styles.selected : ''}`}
                                onClick={() => setSelectedPaymentGateway(MY_FATOORAH_OPTIONS.SAMSUNG_PAY)}
                            >
                                <SiSamsungpay />
                                <span>Samsung Pay</span>
                            </button>

                            <button 
                                className={`${styles.optionButton} ${selectedPaymentGateway === MY_FATOORAH_OPTIONS.MADA ? styles.selected : ''}`}
                                onClick={() => setSelectedPaymentGateway(MY_FATOORAH_OPTIONS.MADA)}
                            >
                                <MadaLogo />
                                <span>مدى</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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

                        {/* Place Order Button */}
                        <div className={styles.placeOrderSection}>
                            <div className={styles.securityNote}>
                                <FaLock />
                                <span>معاملاتك محمية بأعلى معايير الأمان</span>
                            </div>

                            <button
                                className={styles.confirmButton}
                                onClick={handlePlaceOrder}
                                disabled={isProcessingOrder}
                            >
                                {isProcessingOrder ? (
                                    <span className={styles.loadingText}>جاري تأكيد الطلب...</span>
                                ) : (
                                    <>
                                        <FaCheck />
                                        <span>تأكيد الطلب {formatPrice(getFinalTotal())} ر.س</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* موديل إضافة/تعديل العنوان */}
            <ShippingInfoModal
                isOpen={showShippingModal}
                onClose={() => setShowShippingModal(false)}
            />
        </div>
    );
};

export default Checkout; 