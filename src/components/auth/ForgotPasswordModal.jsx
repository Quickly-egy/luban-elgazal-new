import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaTimes, FaSpinner, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import useAuthStore from '../../stores/authStore';
import styles from './Auth.module.css';

export default function ForgotPasswordModal({ 
    isOpen, 
    onClose 
}) {
    const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
    const [formData, setFormData] = useState({
        email: '',
        otp: ['', '', '', '', '', ''],
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [resetData, setResetData] = useState(null);
    
    const { forgotPassword, resetPassword } = useAuthStore();
    const otpInputs = useRef([]);

    const handleModalClose = () => {
        setStep(1);
        setFormData({
            email: '',
            otp: ['', '', '', '', '', ''],
            newPassword: '',
            confirmPassword: ''
        });
        setShowPassword({
            newPassword: false,
            confirmPassword: false
        });
        setErrors({});
        setSuccessMessage('');
        setLoading(false);
        setResetData(null);
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData(prev => ({
            ...prev,
            otp: newOtp
        }));

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }

        // Clear OTP errors
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
        
        if (e.key === 'ArrowLeft' && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
        
        if (e.key === 'ArrowRight' && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setFormData(prev => ({
                ...prev,
                otp: newOtp
            }));
            
            // Focus last input
            otpInputs.current[5]?.focus();
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        console.log('📧 بدء عملية طلب إعادة تعيين كلمة المرور...');
        
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        // Basic validation
        if (!formData.email.trim()) {
            setErrors({ email: 'البريد الإلكتروني مطلوب' });
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrors({ email: 'البريد الإلكتروني غير صحيح' });
            setLoading(false);
            return;
        }

        try {
            console.log('🌐 استدعاء forgotPassword API...');
            
            const result = await forgotPassword(formData.email);
            console.log('✅ نجح طلب إعادة التعيين:', result);
            
            setResetData(result);
            setStep(2);
            
            // Focus first OTP input
            setTimeout(() => {
                otpInputs.current[0]?.focus();
            }, 100);
            
        } catch (error) {
            console.error('خطأ في طلب إعادة التعيين:', error);
            
            if (error.validationErrors) {
                const validationErrors = {};
                
                if (error.validationErrors.email) {
                    validationErrors.email = error.validationErrors.email[0];
                }
                
                setErrors(validationErrors);
            } else {
                setErrors({ general: error.message || 'حدث خطأ في طلب إعادة التعيين' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        console.log('🔐 بدء عملية إعادة تعيين كلمة المرور...');
        
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        // Basic validation
        const otpCode = formData.otp.join('');
        if (otpCode.length !== 6) {
            setErrors({ otp: 'كود التحقق يجب أن يكون 6 أرقام' });
            setLoading(false);
            return;
        }

        if (!formData.newPassword.trim()) {
            setErrors({ newPassword: 'كلمة المرور الجديدة مطلوبة' });
            setLoading(false);
            return;
        }

        if (!formData.confirmPassword.trim()) {
            setErrors({ confirmPassword: 'تأكيد كلمة المرور مطلوب' });
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'كلمات المرور غير متطابقة' });
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setErrors({ newPassword: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
            setLoading(false);
            return;
        }

        try {
            console.log('🌐 استدعاء resetPassword API...');
            
            const resetRequestData = {
                email: formData.email,
                reset_code: otpCode,
                new_password: formData.newPassword,
                new_password_confirmation: formData.confirmPassword
            };
            
            const result = await resetPassword(resetRequestData);
            console.log('✅ نجح إعادة تعيين كلمة المرور:', result);
            
            setSuccessMessage(result.message || 'تم إعادة تعيين كلمة المرور بنجاح');
            
            // Close modal after 2 seconds
            setTimeout(() => {
                handleModalClose();
            }, 2000);
            
        } catch (error) {
            console.error('خطأ في إعادة تعيين كلمة المرور:', error);
            
            if (error.validationErrors) {
                const validationErrors = {};
                
                if (error.validationErrors.email) {
                    validationErrors.email = error.validationErrors.email[0];
                }
                if (error.validationErrors.reset_code) {
                    validationErrors.otp = error.validationErrors.reset_code[0];
                }
                if (error.validationErrors.new_password) {
                    validationErrors.newPassword = error.validationErrors.new_password[0];
                }
                if (error.validationErrors.new_password_confirmation) {
                    validationErrors.confirmPassword = error.validationErrors.new_password_confirmation[0];
                }
                
                setErrors(validationErrors);
            } else {
                setErrors({ general: error.message || 'حدث خطأ في إعادة تعيين كلمة المرور' });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && handleModalClose()}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3>
                        {step === 1 ? 'نسيت كلمة المرور؟' : 'إعادة تعيين كلمة المرور'}
                    </h3>
                    <button className={styles.closeButton} onClick={handleModalClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    {successMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}

                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    {step === 1 ? (
                        // Step 1: Email Input
                        <form onSubmit={handleEmailSubmit}>
                            <p className={styles.modalDescription}>
                                أدخل بريدك الإلكتروني وسنرسل لك كود إعادة تعيين كلمة المرور
                            </p>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">البريد الإلكتروني</label>
                                <div className={styles.inputContainer}>
                                    <FaEnvelope className={styles.inputIcon} />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="أدخل بريدك الإلكتروني"
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && (
                                    <span className={styles.fieldError}>{errors.email}</span>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className={styles.spinner} />
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    'إرسال كود التحقق'
                                )}
                            </button>
                        </form>
                    ) : (
                        // Step 2: OTP + New Password
                        <form onSubmit={handleResetSubmit}>
                            <p className={styles.modalDescription}>
                                أدخل كود التحقق المرسل إلى هاتفك وكلمة المرور الجديدة
                            </p>

                            {/* OTP Input */}
                            <div className={styles.inputGroup}>
                                <label>كود التحقق (6 أرقام)</label>
                                <div className={styles.otpContainer}>
                                    <div className={styles.otpInputs}>
                                        {formData.otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => otpInputs.current[index] = el}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={handleOtpPaste}
                                                className={`${styles.otpInput} ${errors.otp ? styles.inputError : ''}`}
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>
                                    {errors.otp && (
                                        <span className={styles.fieldError}>{errors.otp}</span>
                                    )}
                                </div>
                            </div>

                            {/* New Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                                <div className={styles.passwordInputContainer}>
                                    <FaKey className={styles.inputIcon} />
                                    <input
                                        type={showPassword.newPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="أدخل كلمة المرور الجديدة"
                                        className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                        disabled={loading}
                                    >
                                        {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <span className={styles.fieldError}>{errors.newPassword}</span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                                <div className={styles.passwordInputContainer}>
                                    <FaKey className={styles.inputIcon} />
                                    <input
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="أكد كلمة المرور الجديدة"
                                        className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                        disabled={loading}
                                    >
                                        {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className={styles.fieldError}>{errors.confirmPassword}</span>
                                )}
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.backButton}
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                >
                                    رجوع
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className={styles.spinner} />
                                            جاري إعادة التعيين...
                                        </>
                                    ) : (
                                        'إعادة تعيين كلمة المرور'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
} 