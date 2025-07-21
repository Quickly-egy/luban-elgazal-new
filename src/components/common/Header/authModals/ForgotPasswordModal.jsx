import { useState, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaKey, FaArrowLeft, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import useAuthStore from '../../../../stores/authStore';
import styles from './authModals.module.css';

export default function ForgotPasswordModal({ showForgotPasswordModal, setShowForgotPasswordModal, setShowLoginModal }) {
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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resetData, setResetData] = useState(null);
    
    const { forgotPassword, resetPassword } = useAuthStore();
    const otpInputs = useRef([]);

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
        
        setIsLoading(true);
        setErrors({});

        // Basic validation
        if (!formData.email.trim()) {
            setErrors({ email: 'البريد الإلكتروني مطلوب' });
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrors({ email: 'البريد الإلكتروني غير صحيح' });
            setIsLoading(false);
            return;
        }

        try {
     
            
            const result = await forgotPassword(formData.email);
       
            
            setResetData(result);
            setStep(2);
            
            // Focus first OTP input
            setTimeout(() => {
                otpInputs.current[0]?.focus();
            }, 100);
            
        } catch (error) {
      
            
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
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();

        
        setIsLoading(true);
        setErrors({});

        // Basic validation
        const otpCode = formData.otp.join('');
        if (otpCode.length !== 6) {
            setErrors({ otp: 'كود التحقق يجب أن يكون 6 أرقام' });
            setIsLoading(false);
            return;
        }

        if (!formData.newPassword.trim()) {
            setErrors({ newPassword: 'كلمة المرور الجديدة مطلوبة' });
            setIsLoading(false);
            return;
        }

        if (!formData.confirmPassword.trim()) {
            setErrors({ confirmPassword: 'تأكيد كلمة المرور مطلوب' });
            setIsLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'كلمات المرور غير متطابقة' });
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setErrors({ newPassword: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
            setIsLoading(false);
            return;
        }

        try {
          
            
            const resetRequestData = {
                email: formData.email,
                reset_code: otpCode,
                new_password: formData.newPassword,
                new_password_confirmation: formData.confirmPassword
            };
            
            const result = await resetPassword(resetRequestData);
          
            
            setIsSuccess(true);
            
            // Close modal after 3 seconds
            setTimeout(() => {
                handleClose();
                setShowLoginModal(true);
            }, 3000);
            
        } catch (error) {
          
            
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
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowForgotPasswordModal(false);
        }
    };

    const backToLogin = () => {
        setShowForgotPasswordModal(false);
        setShowLoginModal(true);
        // Reset state
        resetState();
    };

    const resetState = () => {
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
        setIsSuccess(false);
        setIsLoading(false);
        setResetData(null);
    };

    const handleClose = () => {
        setShowForgotPasswordModal(false);
        resetState();
    };

    return (
        <aside className={`${styles.authModal} ${showForgotPasswordModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaKey />
                        </div>
                        <div className={styles.headerText}>
                            <h3>
                                {step === 1 ? 'نسيت كلمة المرور؟' : 'إعادة تعيين كلمة المرور'}
                            </h3>
                            <p>
                                {step === 1 ? 'سنرسل لك كود إعادة التعيين' : 'أدخل كود التحقق وكلمة المرور الجديدة'}
                            </p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <MdOutlineClose />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.authForm}>
                    {!isSuccess ? (
                        <>
                            {errors.general && (
                                <div className={styles.errorMessage}>
                                    {errors.general}
                                </div>
                            )}

                            {step === 1 ? (
                                // Step 1: Email Input
                                <>
                                    <div className={styles.forgotPasswordInfo}>
                                       <p>
                                         أدخل بريدك الإلكتروني وسنرسل لك كود إعادة تعيين كلمة المرور علي الرقم المسجل لدينا
                                       </p>
                                    </div>

                                    <form onSubmit={handleEmailSubmit}>
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
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                                        </div>

                                        {/* Submit Button */}
                                        <button 
                                            type="submit" 
                                            className={styles.submitBtn}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FaSpinner className={styles.spinner} />
                                                    جاري الإرسال...
                                                </>
                                            ) : (
                                                'إرسال كود التحقق'
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                // Step 2: OTP + New Password
                                <form onSubmit={handleResetSubmit}>
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
                                                        disabled={isLoading}
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
                                        <div className={styles.inputContainer}>
                                            <FaKey className={styles.inputIcon} />
                                            <input
                                                type={showPassword.newPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="أدخل كلمة المرور الجديدة"
                                                className={errors.newPassword ? styles.inputError : ''}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className={styles.passwordToggle}
                                                onClick={() => togglePasswordVisibility('newPassword')}
                                                disabled={isLoading}
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
                                        <div className={styles.inputContainer}>
                                            <FaKey className={styles.inputIcon} />
                                            <input
                                                type={showPassword.confirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="أكد كلمة المرور الجديدة"
                                                className={errors.confirmPassword ? styles.inputError : ''}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className={styles.passwordToggle}
                                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                                disabled={isLoading}
                                            >
                                                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <span className={styles.fieldError}>{errors.confirmPassword}</span>
                                        )}
                                    </div>

                                    {/* Form Actions */}
                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.backButton}
                                            onClick={() => setStep(1)}
                                            disabled={isLoading}
                                        >
                                            رجوع
                                        </button>
                                        
                                        <button 
                                            type="submit" 
                                            className={styles.submitBtn}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
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
                        </>
                    ) : (
                        <div className={styles.successMessage}>
                            <div className={styles.successIcon}>
                                <FaKey />
                            </div>
                            <h4>تم إعادة تعيين كلمة المرور بنجاح!</h4>
                            <p>تم إعادة تعيين كلمة المرور الخاصة بك بنجاح</p>
                            <p className={styles.emailSent}>سيتم توجيهك لتسجيل الدخول خلال ثوانٍ...</p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className={styles.backToLogin}>
                        <button type="button" onClick={backToLogin}>
                            <FaArrowLeft />
                            <span>العودة لتسجيل الدخول</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
} 