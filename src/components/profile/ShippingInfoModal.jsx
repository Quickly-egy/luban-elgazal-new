import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaSave, FaShippingFast, FaUser, FaEnvelope, FaPhone, FaGlobeAmericas, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import styles from './Profile.module.css';

const countriesWithRegions = {
    'مصر': [
        'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 
        'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 
        'الوادي الجديد', 'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد', 
        'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر', 
        'قنا', 'شمال سيناء', 'سوهاج'
    ],
    'السعودية': [
        'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية',
        'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 
        'الباحة', 'الجوف'
    ],
    'الإمارات': [
        'أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'
    ],
    'الكويت': [
        'العاصمة', 'حولي', 'الفروانية', 'مبارك الكبير', 'الأحمدي', 'الجهراء'
    ],
    'قطر': [
        'الدوحة', 'الريان', 'الوكرة', 'أم صلال', 'الخور', 'الضعاين', 'الشمال', 'الشحانية'
    ],
    'البحرين': [
        'المنامة', 'المحرق', 'الشمالية', 'الجنوبية'
    ],
    'عمان': [
        'مسقط', 'ظفار', 'الداخلية', 'الشرقية', 'الباطنة الشمالية', 
        'الباطنة الجنوبية', 'مسندم', 'الظاهرة', 'الوسطى', 'البريمي'
    ],
    'الأردن': [
        'عمان', 'إربد', 'الزرقاء', 'البلقاء', 'الكرك', 'معان', 'الطفيلة',
        'مادبا', 'جرش', 'عجلون', 'العقبة', 'المفرق'
    ],
    'لبنان': [
        'بيروت', 'جبل لبنان', 'الشمال', 'البقاع', 'الجنوب', 'النبطية'
    ],
    'العراق': [
        'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'الأنبار',
        'دهوك', 'كركوك', 'بابل', 'ديالى', 'واسط', 'صلاح الدين', 'القادسية',
        'ذي قار', 'ميسان', 'المثنى', 'السليمانية'
    ]
};

export default function ShippingInfoModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});

    const [shippingData, setShippingData] = useState({
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        country: 'مصر',
        region: 'القاهرة',
        address: 'شارع التحرير، عمارة 15، الطابق الثالث، شقة 12'
    });

    const [editData, setEditData] = useState({ ...shippingData });

    useEffect(() => {
        if (isOpen) {
            setEditData({ ...shippingData });
            setIsEditing(false);
            setErrors({});
            setSuccessMessage('');
        }
    }, [isOpen, shippingData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value,
            // Reset region when country changes
            ...(name === 'country' ? { region: '' } : {})
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear success message
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update shipping data
            setShippingData({ ...editData });
            setIsEditing(false);
            setSuccessMessage('تم تحديث معلومات الشحن بنجاح');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (error) {
            setErrors({ general: 'حدث خطأ في تحديث معلومات الشحن' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...shippingData });
        setIsEditing(false);
        setErrors({});
        setSuccessMessage('');
    };

    const handleModalClose = () => {
        if (!isLoading) {
            setIsEditing(false);
            setErrors({});
            setSuccessMessage('');
            onClose();
        }
    };

    if (!isOpen) return null;

    const availableRegions = editData.country ? countriesWithRegions[editData.country] || [] : [];

    return (
        <div className={styles.phoneChangeModal} onClick={(e) => e.target === e.currentTarget && handleModalClose()}>
            <div className={styles.phoneModalContainer} style={{ maxWidth: '650px' }}>
                <div className={styles.phoneModalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaShippingFast style={{ fontSize: '1.2rem' }} />
                        <h3>معلومات الشحن</h3>
                    </div>
                    <button className={styles.phoneCloseBtn} onClick={handleModalClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.phoneModalContent}>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#2d3748' }}>
                                بيانات التوصيل
                            </h4>
                            <button
                                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                                disabled={isLoading}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'Cairo, sans-serif'
                                }}
                            >
                                {isEditing ? 'إلغاء' : 'تعديل'}
                            </button>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className={styles.successMessage} style={{ marginBottom: '20px' }}>
                            {successMessage}
                        </div>
                    )}

                    {/* General Error Message */}
                    {errors.general && (
                        <div className={styles.errorMessage} style={{ marginBottom: '20px' }}>
                            {errors.general}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* First Name */}
                        <div className={styles.inputGroup}>
                            <label>الاسم الأول</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editData.firstName}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.firstName ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    placeholder="أدخل الاسم الأول"
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}>
                                    <FaUser style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.firstName}</span>
                                </div>
                            )}
                            {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
                        </div>

                        {/* Last Name */}
                        <div className={styles.inputGroup}>
                            <label>الاسم الأخير</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editData.lastName}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.lastName ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    placeholder="أدخل الاسم الأخير"
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}>
                                    <FaUser style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.lastName}</span>
                                </div>
                            )}
                            {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
                        </div>

                        {/* Email */}
                        <div className={styles.inputGroup}>
                            <label>البريد الإلكتروني</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.email ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    placeholder="أدخل البريد الإلكتروني"
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}>
                                    <FaEnvelope style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.email}</span>
                                </div>
                            )}
                            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                        </div>

                        {/* Phone */}
                        <div className={styles.inputGroup}>
                            <label>رقم الهاتف</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    placeholder="+201234567890"
                                    style={{ direction: 'ltr', textAlign: 'left' }}
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748',
                                    direction: 'ltr'
                                }}>
                                    <FaPhone style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.phone}</span>
                                </div>
                            )}
                            {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                        </div>

                        {/* Country */}
                        <div className={styles.inputGroup}>
                            <label>الدولة</label>
                            {isEditing ? (
                                <select
                                    name="country"
                                    value={editData.country}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.country ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                >
                                    <option value="">اختر الدولة</option>
                                    <option value="مصر">مصر</option>
                                    <option value="السعودية">السعودية</option>
                                    <option value="الإمارات">الإمارات العربية المتحدة</option>
                                    <option value="الكويت">الكويت</option>
                                    <option value="قطر">قطر</option>
                                    <option value="البحرين">البحرين</option>
                                    <option value="عمان">عمان</option>
                                    <option value="الأردن">الأردن</option>
                                    <option value="لبنان">لبنان</option>
                                    <option value="العراق">العراق</option>
                                </select>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}>
                                    <FaGlobeAmericas style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.country || 'لم يتم تحديدها'}</span>
                                </div>
                            )}
                            {errors.country && <span className={styles.fieldError}>{errors.country}</span>}
                        </div>

                        {/* Region */}
                        <div className={styles.inputGroup}>
                            <label>المنطقة/المحافظة</label>
                            {isEditing ? (
                                <select
                                    name="region"
                                    value={editData.region}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.region ? styles.inputError : ''}`}
                                    disabled={isLoading || !editData.country}
                                >
                                    <option value="">اختر المنطقة</option>
                                    {availableRegions.map((region, index) => (
                                        <option key={index} value={region}>{region}</option>
                                    ))}
                                </select>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}>
                                    <FaMapMarkerAlt style={{ color: '#667eea', fontSize: '1rem' }} />
                                    <span>{shippingData.region || 'لم يتم تحديدها'}</span>
                                </div>
                            )}
                            {errors.region && <span className={styles.fieldError}>{errors.region}</span>}
                        </div>
                    </div>

                    {/* Address - Full Width */}
                    <div style={{ marginTop: '20px' }}>
                        <div className={styles.inputGroup}>
                            <label>العنوان التفصيلي</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={editData.address}
                                    onChange={handleInputChange}
                                    className={`${styles.phoneInput} ${errors.address ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    placeholder="أدخل العنوان التفصيلي (الشارع، رقم البناية، الطابق، رقم الشقة، علامات مميزة...)"
                                    rows="3"
                                    style={{ 
                                        resize: 'vertical',
                                        minHeight: '80px',
                                        fontFamily: 'Cairo, sans-serif'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '15px 20px',
                                    background: '#f8fafc',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    color: '#2d3748',
                                    minHeight: '60px'
                                }}>
                                    <FaHome style={{ color: '#667eea', fontSize: '1rem', marginTop: '2px' }} />
                                    <span style={{ lineHeight: '1.5' }}>{shippingData.address || 'لم يتم إدخال العنوان'}</span>
                                </div>
                            )}
                            {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{ marginTop: '25px', textAlign: 'center' }}>
                            <button 
                                onClick={handleSave}
                                disabled={isLoading}
                                style={{
                                    background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'Cairo, sans-serif',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isLoading ? (
                                    <FaSpinner className={styles.spinner} />
                                ) : (
                                    <FaSave />
                                )}
                                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 