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

const PAYMENT_METHODS = {
    MY_FATOORAH: 'my_fatoorah',
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
        src="/images/tabby-logo.png" 
        alt="تابي" 
        className={styles.tabbyLogo}
        width="64"
        height="24"
    />
);

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, getCartCount } = useCartStore();
    const { formatPrice } = useCurrency();
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
        return total >= 500 ? 0 : 50; // شحن مجاني للطلبات أكثر من 500 وحدة عملة
    };

    const getFinalTotal = () => {
        return getTotalPrice() - discount + getShippingCost();
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
                    <div className={styles.orderSummary}>
                        <div className={styles.summaryHeader}>
                            <h2>ملخص الطلب</h2>
                        </div>

                        {/* Products List */}
                        <div className={styles.productsList}>
                            {cartItems.map((item) => (
                                <div key={item.id} className={styles.productItem}>
                                    <div className={styles.productImage}>
                                        <img src={item.image} alt={item.name} />
                                        <span className={styles.quantity}>{item.quantity}</span>
                                    </div>

                                    <div className={styles.productInfo}>
                                        <h4>{item.name}</h4>
                                        <p>{item.category}</p>
                                        <div className={styles.productPrice}>
                                            <span className={styles.unitPrice}>
                                                {formatPrice(item.discountedPrice || item.price)}
                                            </span>
                                            <span className={styles.totalPrice}>
                                                {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Discount Code Section */}
                        <div className={styles.discountSection}>
                            <h3>
                                <FaPercent />
                                كود الخصم
                            </h3>

                            {!discountApplied ? (
                                <div className={styles.discountInput}>
                                    <input
                                        type="text"
                                        name="discountCode"
                                        value={formData.discountCode}
                                        onChange={handleInputChange}
                                        placeholder="أدخل كود الخصم"
                                        className={styles.discountField}
                                    />
                                    <button
                                        onClick={handleApplyDiscount}
                                        disabled={isProcessingDiscount}
                                        className={styles.applyDiscountBtn}
                                    >
                                        {isProcessingDiscount ? 'جاري التحقق...' : 'تطبيق'}
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.discountApplied}>
                                    <div className={styles.discountInfo}>
                                        <FaCheck />
                                        <span>تم تطبيق الخصم</span>
                                        <span className={styles.discountAmount}>
                                            -{formatPrice(discount)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={removeDiscount}
                                        className={styles.removeDiscountBtn}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}

                            {discountMessage && (
                                <p className={`${styles.discountMessage} ${discountApplied ? styles.success : styles.error}`}>
                                    {discountMessage}
                                </p>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className={styles.priceBreakdown}>
                            <div className={styles.priceRow}>
                                <span>المجموع الفرعي:</span>
                                <span>{formatPrice(getTotalPrice())}</span>
                            </div>

                            {discount > 0 && (
                                <div className={styles.priceRow}>
                                    <span>الخصم:</span>
                                    <span className={styles.discountPrice}>-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div className={styles.priceRow}>
                                <span>
                                    <FaTruck />
                                    الشحن:
                                </span>
                                <span className={getShippingCost() === 0 ? styles.freeShipping : ''}>
                                    {getShippingCost() === 0 ? 'مجاني' : formatPrice(getShippingCost())}
                                </span>
                            </div>

                            <div className={styles.totalRow}>
                                <span>الإجمالي النهائي:</span>
                                <span>{formatPrice(getFinalTotal())}</span>
                            </div>
                        </div>
                    </div>

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

                            <div className={styles.paymentMethods}>
                                {/* ماي فاتورة */}
                                <div 
                                    className={`${styles.paymentMethod} ${formData.paymentMethod === PAYMENT_METHODS.MY_FATOORAH ? styles.selected : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: PAYMENT_METHODS.MY_FATOORAH }))}
                                >
                                    <div className={styles.paymentHeader}>
                                        <input 
                                            type="radio" 
                                            checked={formData.paymentMethod === PAYMENT_METHODS.MY_FATOORAH}
                                            onChange={() => {}}
                                        />
                                        <h3>ماي فاتورة</h3>
                                    </div>
                                    
                                    {formData.paymentMethod === PAYMENT_METHODS.MY_FATOORAH && (
                                        <div className={styles.myFatoorahOptions}>
                                            <div 
                                                className={`${styles.paymentOption} ${formData.myFatoorahOption === MY_FATOORAH_OPTIONS.VISA_MASTER ? styles.selectedOption : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, myFatoorahOption: MY_FATOORAH_OPTIONS.VISA_MASTER }));
                                                }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    checked={formData.myFatoorahOption === MY_FATOORAH_OPTIONS.VISA_MASTER}
                                                    onChange={() => {}}
                                                />
                                                <div className={styles.optionContent}>
                                                    <div className={styles.optionIcons}>
                                                        <FaCcVisa />
                                                        <FaCcMastercard />
                                                    </div>
                                                    <span>فيزا / ماستر كارد</span>
                                                </div>
                                            </div>

                                            <div 
                                                className={`${styles.paymentOption} ${formData.myFatoorahOption === MY_FATOORAH_OPTIONS.APPLE_PAY ? styles.selectedOption : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, myFatoorahOption: MY_FATOORAH_OPTIONS.APPLE_PAY }));
                                                }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    checked={formData.myFatoorahOption === MY_FATOORAH_OPTIONS.APPLE_PAY}
                                                    onChange={() => {}}
                                                />
                                                <div className={styles.optionContent}>
                                                    <FaApple className={styles.applePay} />
                                                    <span>Apple Pay</span>
                                                </div>
                                            </div>

                                            <div 
                                                className={`${styles.paymentOption} ${formData.myFatoorahOption === MY_FATOORAH_OPTIONS.SAMSUNG_PAY ? styles.selectedOption : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, myFatoorahOption: MY_FATOORAH_OPTIONS.SAMSUNG_PAY }));
                                                }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    checked={formData.myFatoorahOption === MY_FATOORAH_OPTIONS.SAMSUNG_PAY}
                                                    onChange={() => {}}
                                                />
                                                <div className={styles.optionContent}>
                                                    <SiSamsungpay className={styles.samsungPay} />
                                                    <span>Samsung Pay</span>
                                                </div>
                                            </div>

                                            <div 
                                                className={`${styles.paymentOption} ${formData.myFatoorahOption === MY_FATOORAH_OPTIONS.MADA ? styles.selectedOption : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, myFatoorahOption: MY_FATOORAH_OPTIONS.MADA }));
                                                }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    checked={formData.myFatoorahOption === MY_FATOORAH_OPTIONS.MADA}
                                                    onChange={() => {}}
                                                />
                                                <div className={styles.optionContent}>
                                                    <MadaLogo />
                                                    <span>مدى</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* تابي */}
                                <div 
                                    className={`${styles.paymentMethod} ${formData.paymentMethod === PAYMENT_METHODS.TABBY ? styles.selected : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: PAYMENT_METHODS.TABBY }))}
                                >
                                    <div className={styles.paymentHeader}>
                                        <input 
                                            type="radio" 
                                            checked={formData.paymentMethod === PAYMENT_METHODS.TABBY}
                                            onChange={() => {}}
                                        />
                                        <div className={styles.tabbyContent}>
                                            <TabbyLogo />
                                            <div className={styles.tabbyInfo}>
                                                <h3>قسم فاتورتك على 4 دفعات</h3>
                                                <p>ادفع ربع المبلغ الآن والباقي على 3 أشهر بدون فوائد</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* الدفع عند الاستلام */}
                                <div 
                                    className={`${styles.paymentMethod} ${formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? styles.selected : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: PAYMENT_METHODS.CASH_ON_DELIVERY }))}
                                >
                                    <div className={styles.paymentHeader}>
                                        <input 
                                            type="radio" 
                                            checked={formData.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY}
                                            onChange={() => {}}
                                        />
                                        <div className={styles.cashContent}>
                                            <FaMoneyBillWave className={styles.cashIcon} />
                                            <div className={styles.cashInfo}>
                                                <h3>الدفع عند الاستلام</h3>
                                                <p>ادفع نقداً عند استلام طلبك</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <div className={styles.placeOrderSection}>
                            <div className={styles.securityNote}>
                                <FaLock />
                                <span>معاملاتك محمية بأعلى معايير الأمان</span>
                            </div>

                            <button
                                className={styles.placeOrderBtn}
                                onClick={handlePlaceOrder}
                                disabled={isProcessingOrder}
                            >
                                {isProcessingOrder ? (
                                    'جاري معالجة الطلب...'
                                ) : (
                                    <>
                                        <FaCheck />
                                        تأكيد الطلب - {formatPrice(getFinalTotal())}
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