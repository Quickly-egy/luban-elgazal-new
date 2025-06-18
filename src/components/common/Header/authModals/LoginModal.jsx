import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import useAuthStore from '../../../../stores/authStore';
import styles from './authModals.module.css';

export default function LoginModal({ showLoginModal, setShowLoginModal, setShowRegisterModal, setShowForgotPasswordModal }) {
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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

        if (!formData.email) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح';
        }

        if (!formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة';
        } else if (formData.password.length < 6) {
            newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            console.log('🔐 LoginModal: بدء تسجيل الدخول...');
            
            const result = await login({
                email: formData.email,
                password: formData.password
            });
            
            console.log('✅ LoginModal: نجح تسجيل الدخول:', result);

            // Reset form and close modal
            setFormData({ email: '', password: '' });
            setShowLoginModal(false);

        } catch (error) {
            console.error('❌ LoginModal: خطأ في تسجيل الدخول:', error);
            
            if (error.validationErrors) {
                const validationErrors = {};
                
                if (error.validationErrors.email) {
                    validationErrors.email = error.validationErrors.email[0];
                }
                if (error.validationErrors.password) {
                    validationErrors.password = error.validationErrors.password[0];
                }
                
                setErrors(validationErrors);
            } else {
                setErrors({ general: error.message || 'حدث خطأ في تسجيل الدخول' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowLoginModal(false);
        }
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const openForgotPassword = () => {
        setShowLoginModal(false);
        setShowForgotPasswordModal(true);
    };

    return (
        <aside className={`${styles.authModal} ${showLoginModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaUser />
                        </div>
                        <div className={styles.headerText}>
                            <h3>تسجيل الدخول</h3>
                            <p>مرحباً بك مرة أخرى</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setShowLoginModal(false)}>
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

                    {/* Forgot Password Link */}
                    <div className={styles.forgotPassword}>
                        <button type="button" onClick={openForgotPassword}>
                            نسيت كلمة المرور؟
                        </button>
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
                            'تسجيل الدخول'
                        )}
                    </button>

                    {/* Switch to Register */}
                    <div className={styles.switchAuth}>
                        <p>ليس لديك حساب؟</p>
                        <button type="button" onClick={switchToRegister}>
                            إنشاء حساب جديد
                        </button>
                    </div>
                </form>
            </div>
        </aside>
    );
} 