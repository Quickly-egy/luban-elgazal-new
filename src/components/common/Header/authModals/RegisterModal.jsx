import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaUserPlus, FaLock, FaUser } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FiPhone } from 'react-icons/fi';
import styles from './authModals.module.css';

export default function RegisterModal({ showRegisterModal, setShowRegisterModal, setShowLoginModal }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName) {
            newErrors.firstName = 'الاسم الأول مطلوب';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
        }
        
        if (!formData.lastName) {
            newErrors.lastName = 'الاسم الأخير مطلوب';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'الاسم الأخير يجب أن يكون حرفين على الأقل';
        }
        
        if (!formData.email) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح';
        }
        
        if (!formData.phone) {
            newErrors.phone = 'رقم الهاتف مطلوب';
        } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'رقم الهاتف غير صحيح';
        }
        
        if (!formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة';
        } else if (formData.password.length < 8) {
            newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('إنشاء حساب:', formData);
            
            // Reset form and close modal
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            setShowRegisterModal(false);
            
            // Show success message
            alert('تم إنشاء الحساب بنجاح!');
            
        } catch (error) {
            console.error('خطأ في إنشاء الحساب:', error);
            setErrors({ general: 'حدث خطأ في إنشاء الحساب' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowRegisterModal(false);
        }
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return (
        <aside className={`${styles.authModal} ${showRegisterModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaUserPlus />
                        </div>
                        <div className={styles.headerText}>
                            <h3>إنشاء حساب جديد</h3>
                            <p>انضم إلينا اليوم</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setShowRegisterModal(false)}>
                        <MdOutlineClose />
                    </button>
                </div>

                {/* Form */}
                <form className={styles.authForm} onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    {/* Name Fields */}
                    <div className={styles.nameRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="firstName">الاسم الأول</label>
                            <div className={styles.inputContainer}>
                                <FaUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="الاسم الأول"
                                    className={errors.firstName ? styles.inputError : ''}
                                />
                            </div>
                            {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="lastName">الاسم الأخير</label>
                            <div className={styles.inputContainer}>
                                <FaUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="الاسم الأخير"
                                    className={errors.lastName ? styles.inputError : ''}
                                />
                            </div>
                            {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <div className={styles.inputContainer}>
                            <IoMdMail className={styles.inputIcon} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="أدخل بريدك الإلكتروني"
                                className={errors.email ? styles.inputError : ''}
                            />
                        </div>
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>

                    {/* Phone Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="phone">رقم الهاتف</label>
                        <div className={styles.inputContainer}>
                            <FiPhone className={styles.inputIcon} />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="أدخل رقم الهاتف"
                                className={errors.phone ? styles.inputError : ''}
                            />
                        </div>
                        {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                    </div>

                    {/* Password Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">كلمة المرور</label>
                        <div className={styles.inputContainer}>
                            <FaLock className={styles.inputIcon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="أدخل كلمة المرور"
                                className={errors.password ? styles.inputError : ''}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                        <div className={styles.inputContainer}>
                            <FaLock className={styles.inputIcon} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="أعد إدخال كلمة المرور"
                                className={errors.confirmPassword ? styles.inputError : ''}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            'إنشاء حساب'
                        )}
                    </button>

                    {/* Switch to Login */}
                    <div className={styles.switchAuth}>
                        <p>لديك حساب بالفعل؟</p>
                        <button type="button" onClick={switchToLogin}>
                            تسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </aside>
    );
} 