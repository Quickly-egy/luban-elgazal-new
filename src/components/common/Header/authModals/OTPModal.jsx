import { useState, useEffect, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaShieldAlt, FaMobile, FaRedo } from 'react-icons/fa';
import useAuthStore from '../../../../stores/authStore';

import styles from './authModals.module.css';

export default function OTPModal({ showOTPModal, setShowOTPModal, setShowLoginModal, setGlobalNotification }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    
    const inputRefs = useRef([]);
    const { verifyRegistration, resendVerification, pendingRegistration } = useAuthStore();

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
        
        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (numbers.length === 6) {
            const newOtp = numbers.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('يرجى إدخال كود التحقق كاملاً');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const result = await verifyRegistration(otpCode);
            
            // Reset form and close modal immediately
            setOtp(['', '', '', '', '', '']);
            setShowOTPModal(false);
            
            // Show global success notification
            if (setGlobalNotification) {
                setGlobalNotification({
                    isVisible: true,
                    message: result.message || 'تم تأكيد الحساب بنجاح! مرحباً بك',
                    type: 'success'
                });
            }
            
        } catch (error) {
            setError(error.message);
            // Clear OTP on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;
        
        setResendLoading(true);
        setError('');
        
        try {
            const result = await resendVerification();
            setResendCooldown(60); // 60 seconds cooldown
            
            // Show global success notification
            if (setGlobalNotification) {
                setGlobalNotification({
                    isVisible: true,
                    message: result.message || 'تم إعادة إرسال الكود بنجاح',
                    type: 'info'
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setResendLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowOTPModal(false);
        }
    };

    const switchToLogin = () => {
        setShowOTPModal(false);
        setShowLoginModal(true);
    };

    return (
        <aside className={`${styles.authModal} ${showOTPModal ? styles.show : ""}`} onClick={handleOverlayClick}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaShieldAlt />
                        </div>
                        <div className={styles.headerText}>
                            <h3>تأكيد رقم الهاتف</h3>
                            <p>أدخل الكود المرسل إلى واتساب</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setShowOTPModal(false)}>
                        <MdOutlineClose />
                    </button>
                </div>

                {/* OTP Form */}
                <form className={styles.authForm} onSubmit={handleSubmit}>
                    {/* Phone Display */}
                    <div className={styles.phoneDisplay}>
                        <FaMobile className={styles.phoneIcon} />
                        <span>تم إرسال كود التحقق إلى: {pendingRegistration?.phone}</span>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {/* OTP Input */}
                    <div className={styles.otpContainer}>
                        <label>كود التحقق (6 أرقام)</label>
                        <div className={styles.otpInputs}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`${styles.otpInput} ${error ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isLoading || otp.join('').length !== 6}
                    >
                        {isLoading ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            'تأكيد الكود'
                        )}
                    </button>

                    {/* Resend Code */}
                    <div className={styles.resendSection}>
                        <p>لم تستلم الكود؟</p>
                        <button 
                            type="button" 
                            onClick={handleResendCode}
                            disabled={resendLoading || resendCooldown > 0}
                            className={styles.resendBtn}
                        >
                            <FaRedo className={resendLoading ? styles.spinning : ''} />
                            {resendCooldown > 0 
                                ? `إعادة الإرسال خلال ${resendCooldown}ث`
                                : resendLoading 
                                    ? 'جاري الإرسال...'
                                    : 'إعادة إرسال الكود'
                            }
                        </button>
                    </div>

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