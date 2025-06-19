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
    FaLock
} from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import useCartStore from '../../stores/cartStore';
import styles from './Checkout.module.css';
import { useCurrency } from '../../hooks';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, getCartCount } = useCartStore();
    const { formatPrice } = useCurrency();

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
        address: '',
        city: '',
        governorate: '',
        discountCode: '',
        paymentMethod: 'card'
    });

    // State للخصم والإشعارات
    const [discount, setDiscount] = useState(0);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');
    const [isProcessingDiscount, setIsProcessingDiscount] = useState(false);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

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
        { id: 'visa', name: 'Visa', icon: <SiVisa />, color: '#1A1F71' },
        { id: 'mastercard', name: 'Mastercard', icon: <SiMastercard />, color: '#EB001B' }
    ];

    // formatPrice is now provided by useCurrency hook

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

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>الاسم الأول *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>الاسم الأخير *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>رقم الهاتف *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>المحافظة *</label>
                                    <select
                                        name="governorate"
                                        value={formData.governorate}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">اختر المحافظة</option>
                                        <option value="cairo">القاهرة</option>
                                        <option value="giza">الجيزة</option>
                                        <option value="alexandria">الإسكندرية</option>
                                        <option value="dakahlia">الدقهلية</option>
                                        <option value="gharbia">الغربية</option>
                                        <option value="sharkia">الشرقية</option>
                                        <option value="qalyubia">القليوبية</option>
                                        <option value="beheira">البحيرة</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>المدينة *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>العنوان التفصيلي *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="الشارع، رقم البناية، الدور، رقم الشقة"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className={styles.formSection}>
                            <h2>
                                <FaCreditCard />
                                طريقة الدفع
                            </h2>

                            <div className={styles.paymentOptions}>
                                <label className={styles.paymentOption}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                                    />
                                    <div className={styles.paymentContent}>
                                        <FaTruck />
                                        <div>
                                            <strong>الدفع عند الاستلام</strong>
                                            <p>ادفع نقداً عند وصول الطلب</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={styles.paymentOption}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                                    />
                                    <div className={styles.paymentContent}>
                                        <FaCreditCard />
                                        <div>
                                            <strong>بطاقة ائتمانية</strong>
                                            <p>فيزا، ماستركارد</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={styles.paymentOption}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="gateway"
                                        checked={formData.paymentMethod === 'gateway'}
                                        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                                    />
                                    <div className={styles.paymentContent}>
                                        <FaMobile />
                                        <div>
                                            <strong>بوابات الدفع الإلكتروني</strong>
                                            <p>فوري، فودافون كاش، PayMob وأكثر</p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Payment Gateways */}
                            {showPaymentMethods && (
                                <div className={styles.paymentGateways}>
                                    <h3>اختر بوابة الدفع:</h3>
                                    <div className={styles.gatewaysGrid}>
                                        {paymentGateways.map((gateway) => (
                                            <button
                                                key={gateway.id}
                                                className={`${styles.gatewayBtn} ${selectedPaymentGateway === gateway.id ? styles.selected : ''}`}
                                                onClick={() => setSelectedPaymentGateway(gateway.id)}
                                                style={{ '--gateway-color': gateway.color }}
                                            >
                                                <span className={styles.gatewayIcon}>
                                                    {gateway.icon}
                                                </span>
                                                <span>{gateway.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
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
        </div>
    );
};

export default Checkout; 