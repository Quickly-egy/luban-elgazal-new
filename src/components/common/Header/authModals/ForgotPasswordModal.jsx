import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { FaKey, FaArrowLeft } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import styles from './authModals.module.css';

export default function ForgotPasswordModal({ showForgotPasswordModal, setShowForgotPasswordModal, setShowLoginModal }) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (errors.email) {
            setErrors({});
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'البريد الإلكتروني غير صحيح';
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
            console.log('إرسال رابط إعادة تعيين كلمة المرور إلى:', email);
            
            setIsSuccess(true);
            
        } catch (error) {
            console.error('خطأ في إرسال رابط إعادة التعيين:', error);
            setErrors({ general: 'حدث خطأ في إرسال الرابط' });
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
        setEmail('');
        setErrors({});
        setIsSuccess(false);
    };

    const handleClose = () => {
        setShowForgotPasswordModal(false);
        // Reset state
        setEmail('');
        setErrors({});
        setIsSuccess(false);
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
                            <h3>نسيت كلمة المرور؟</h3>
                            <p>سنرسل لك رابط إعادة التعيين</p>
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

                            <div className={styles.forgotPasswordInfo}>
                                <p>أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className={styles.inputGroup}>
                                    <label htmlFor="resetEmail">البريد الإلكتروني</label>
                                    <div className={styles.inputContainer}>
                                        <IoMdMail className={styles.inputIcon} />
                                        <input
                                            type="email"
                                            id="resetEmail"
                                            name="resetEmail"
                                            value={email}
                                            onChange={handleInputChange}
                                            placeholder="أدخل بريدك الإلكتروني"
                                            className={errors.email ? styles.inputError : ''}
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
                                        <div className={styles.spinner}></div>
                                    ) : (
                                        'إرسال رابط إعادة التعيين'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.successMessage}>
                            <div className={styles.successIcon}>
                                <IoMdMail />
                            </div>
                            <h4>تم إرسال الرابط!</h4>
                            <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني</p>
                            <p className={styles.emailSent}>{email}</p>
                            <p className={styles.checkEmail}>تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها</p>
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