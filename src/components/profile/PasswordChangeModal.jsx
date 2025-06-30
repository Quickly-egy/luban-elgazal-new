import React, { useState } from "react";
import {
  FaKey,
  FaTimes,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import styles from "./PasswordChangeModal.module.css";

export default function PasswordChangeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const { changePassword } = useAuthStore();

  const handleModalClose = () => {
    setFormData({
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword({
      newPassword: false,
      confirmPassword: false,
    });
    setErrors({});
    setSuccessMessage("");
    setLoading(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 بدء عملية تغيير كلمة المرور...");

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    // Basic validation
    if (!formData.newPassword.trim()) {
      setErrors({ newPassword: "كلمة المرور الجديدة مطلوبة" });
      setLoading(false);
      return;
    }

    if (!formData.confirmPassword.trim()) {
      setErrors({ confirmPassword: "تأكيد كلمة المرور مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "كلمات المرور غير متطابقة" });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      setLoading(false);
      return;
    }

    try {
      console.log("🌐 استدعاء changePassword API...");

      const passwordData = {
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      };

      const result = await changePassword(passwordData);
      console.log("✅ نجح تغيير كلمة المرور:", result);

      setSuccessMessage(result.message || "تم تغيير كلمة المرور بنجاح");

      // Clear form
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    } catch (error) {
      console.error("خطأ في تغيير كلمة المرور:", error);

      if (error.validationErrors) {
        const validationErrors = {};

        if (error.validationErrors.new_password) {
          validationErrors.newPassword = error.validationErrors.new_password[0];
        }
        if (error.validationErrors.new_password_confirmation) {
          validationErrors.confirmPassword =
            error.validationErrors.new_password_confirmation[0];
        }

        setErrors(validationErrors);
      } else {
        setErrors({ general: error.message || "حدث خطأ في تغيير كلمة المرور" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.passwordModalOverlay}
      onClick={(e) => e.target === e.currentTarget && handleModalClose()}
    >
      <div className={styles.passwordModalContainer}>
        <div className={styles.passwordModalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaShieldAlt />
            </div>
            <div className={styles.headerText}>
              <h3>تغيير كلمة المرور</h3>
              <p>تأمين حسابك بكلمة مرور قوية</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleModalClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.passwordModalContent}>
          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className={styles.successMessage}>
                <div className={styles.messageIcon}>✓</div>
                <span>{successMessage}</span>
              </div>
            )}

            {errors.general && (
              <div className={styles.errorMessage}>
                <div className={styles.messageIcon}>⚠</div>
                <span>{errors.general}</span>
              </div>
            )}

            {/* New Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">
                <FaLock className={styles.labelIcon} />
                كلمة المرور الجديدة
              </label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className={`${styles.passwordInput} ${
                    errors.newPassword ? styles.inputError : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility("newPassword")}
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
              <label htmlFor="confirmPassword">
                <FaLock className={styles.labelIcon} />
                تأكيد كلمة المرور
              </label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="أكد كلمة المرور الجديدة"
                  className={`${styles.passwordInput} ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  disabled={loading}
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.fieldError}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Security Tips */}
            <div className={styles.securityTips}>
              <div className={styles.tipsHeader}>
                <FaKey className={styles.tipsIcon} />
                <span>نصائح لكلمة مرور آمنة</span>
              </div>
              <ul className={styles.tipsList}>
                <li
                  className={
                    formData.newPassword.length >= 8 ? styles.tipValid : ""
                  }
                >
                  8 أحرف على الأقل
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.newPassword) ? styles.tipValid : ""
                  }
                >
                  حرف كبير واحد على الأقل
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.newPassword) ? styles.tipValid : ""
                  }
                >
                  رقم واحد على الأقل
                </li>
                <li
                  className={
                    /[!@#$%^&*]/.test(formData.newPassword)
                      ? styles.tipValid
                      : ""
                  }
                >
                  رمز خاص واحد على الأقل
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  جاري التغيير...
                </>
              ) : (
                <>
                  <FaShieldAlt className={styles.btnIcon} />
                  تغيير كلمة المرور
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
