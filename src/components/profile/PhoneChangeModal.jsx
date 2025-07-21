import React, { useState, useEffect, useRef } from "react";
import { FaPhone, FaTimes, FaSpinner } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import { logPhoneUpdate, verifyPhoneSync } from "../../utils/phoneUpdateLogger";
import styles from "./Profile.module.css";

export default function PhoneChangeModal({ isOpen, onClose, onPhoneChanged }) {
  const [step, setStep] = useState(1); // 1: phone input, 2: OTP verification
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState({});
  const [phoneSuccessMessage, setPhoneSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpData, setOtpData] = useState(null); // Store OTP details

  // Create refs for OTP inputs
  const otpInputRefs = useRef([]);

  const { requestPhoneChange, confirmPhoneChange } = useAuthStore();

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus on first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0].focus();
      }, 100);
    }
  }, [step]);

  const handlePhoneModalClose = () => {
    onClose();
    setStep(1);
    setNewPhone("");
    setOtp(["", "", "", "", "", ""]);
    setPhoneErrors({});
    setPhoneSuccessMessage("");
    setResendCooldown(0);
    setPhoneLoading(false);
    setOtpData(null); // Clear OTP data
  };

  const handlePhoneChangeInput = (e) => {
    const value = e.target.value;
    setNewPhone(value);

    if (phoneErrors.phone) {
      setPhoneErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (phoneSuccessMessage) {
      setPhoneSuccessMessage("");
    }
  };

  const handleRequestPhoneChange = async (e) => {
    e.preventDefault();

    setPhoneLoading(true);

    setPhoneErrors({});
    setPhoneSuccessMessage("");

    // Basic validation
    if (!newPhone.trim()) {

      setPhoneErrors({ phone: "رقم الهاتف مطلوب" });
      setPhoneLoading(false);
      return;
    }

    // Phone format validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(newPhone.replace(/\s/g, ""))) {

      setPhoneErrors({ phone: "يرجى إدخال رقم هاتف صحيح" });
      setPhoneLoading(false);
      return;
    }



    try {

      const result = await requestPhoneChange(newPhone);
    

      // Store OTP data for display
      if (result.otp && result.expires_at) {
        setOtpData({
          otp: result.otp,
          expires_at: result.expires_at,
          new_phone: result.new_phone,
          note: result.note,
        });
        setPhoneSuccessMessage(result.message || "تم إرسال كود التحقق بنجاح");
      } else {
        setPhoneSuccessMessage(result.message);
      }

      setStep(2);
      setResendCooldown(60);
    } catch (error) {
  

      if (error.validationErrors) {
        const validationErrors = {};

        if (error.validationErrors.new_phone) {
          const errorMessage =
            error.validationErrors.new_phone[0].toLowerCase();

          if (
            errorMessage.includes("already been taken") ||
            errorMessage.includes("already exists")
          ) {
            validationErrors.phone = "هذا الرقم مستخدم بالفعل";
          } else if (
            errorMessage.includes("invalid") ||
            errorMessage.includes("format")
          ) {
            validationErrors.phone = "رقم الهاتف غير صحيح";
          } else if (errorMessage.includes("required")) {
            validationErrors.phone = "رقم الهاتف مطلوب";
          } else {
            validationErrors.phone = error.validationErrors.new_phone[0];
          }
        }

        setPhoneErrors(validationErrors);
      } else {
        setPhoneErrors({
          general: error.message || "حدث خطأ في طلب تغيير رقم الهاتف",
        });
      }
    } finally {
      setPhoneLoading(false);

    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (phoneErrors.otp) {
      setPhoneErrors((prev) => ({ ...prev, otp: "" }));
    }
    if (phoneSuccessMessage) {
      setPhoneSuccessMessage("");
    }

    // Auto-move to next input if value is entered
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace - move to previous input if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow key - move to previous input (LTR: left = previous)
    else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow key - move to next input (LTR: right = next)
    else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
    // Handle Enter key - submit form if all fields are filled
    else if (e.key === "Enter" && otp.join("").length === 6) {
      handleConfirmPhoneChange(e);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length && i < 6; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);

      // Focus on the next empty field or last field
      const nextIndex = Math.min(pasteData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  const handleConfirmPhoneChange = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setPhoneErrors({ otp: "يرجى إدخال رمز التحقق المكون من 6 أرقام" });
      return;
    }

    setPhoneLoading(true);
    setPhoneErrors({});
    setPhoneSuccessMessage("");

    try {
      const result = await confirmPhoneChange(otpCode);


      // Log the phone update
      logPhoneUpdate("PhoneChangeModal", newPhone, result.user.phone);

      setPhoneSuccessMessage(result.message);

      // Verify localStorage update and sync
      const syncStatus = verifyPhoneSync();
      if (syncStatus) {

      }

      // Call the parent callback to update phone data
      if (onPhoneChanged) {
        onPhoneChanged(result.user.phone);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        handlePhoneModalClose();
      }, 2000);
    } catch (error) {
 

      if (error.validationErrors) {
        const validationErrors = {};

        if (error.validationErrors.otp) {
          const errorMessage = error.validationErrors.otp[0].toLowerCase();

          if (
            errorMessage.includes("invalid") ||
            errorMessage.includes("incorrect")
          ) {
            validationErrors.otp = "رمز التحقق غير صحيح";
          } else if (errorMessage.includes("expired")) {
            validationErrors.otp = "رمز التحقق منتهي الصلاحية";
          } else if (errorMessage.includes("required")) {
            validationErrors.otp = "رمز التحقق مطلوب";
          } else {
            validationErrors.otp = error.validationErrors.otp[0];
          }
        }

        setPhoneErrors(validationErrors);
      } else {
        setPhoneErrors({
          general: error.message || "حدث خطأ في تأكيد تغيير رقم الهاتف",
        });
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setPhoneLoading(true);
    setPhoneErrors({});

    try {
      const result = await requestPhoneChange(newPhone);

      // Update OTP data for resend
      if (result.otp && result.expires_at) {
        setOtpData({
          otp: result.otp,
          expires_at: result.expires_at,
          new_phone: result.new_phone,
          note: result.note,
        });
      }

      setPhoneSuccessMessage("تم إعادة إرسال كود التحقق");
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setPhoneErrors({
        general: error.message || "حدث خطأ في إعادة إرسال كود التحقق",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.phoneChangeModal}>
        <button className={styles.closeButton} onClick={handlePhoneModalClose}>
          <FaTimes />
        </button>

        <h2>{step === 1 ? "تغيير رقم الهاتف" : "تأكيد رقم الهاتف"}</h2>

        {step === 1 ? (
          <form onSubmit={handleRequestPhoneChange}>
            <div className={styles.phoneInputGroup}>
              <FaPhone className={styles.phoneIcon} />
              <input
                type="tel"
                className={styles.phoneInput}
                placeholder="أدخل رقم الهاتف الجديد"
                value={newPhone}
                onChange={handlePhoneChangeInput}
                disabled={phoneLoading}
              />
            </div>

            {phoneErrors.phone && (
              <div className={styles.errorMessage}>{phoneErrors.phone}</div>
            )}

            {phoneSuccessMessage && (
              <div className={styles.successMessage}>{phoneSuccessMessage}</div>
            )}

            <button
              type="submit"
              className={styles.actionButton}
              disabled={phoneLoading}
            >
              {phoneLoading ? (
                <>
                  <FaSpinner className={styles.loadingSpinner} />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال رمز التحقق"
              )}
            </button>
          </form>
        ) : (
          <div>
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className={styles.otpInput}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  disabled={phoneLoading}
                />
              ))}
            </div>

            {phoneErrors.otp && (
              <div className={styles.errorMessage}>{phoneErrors.otp}</div>
            )}

            {phoneSuccessMessage && (
              <div className={styles.successMessage}>{phoneSuccessMessage}</div>
            )}

            <button
              className={styles.actionButton}
              onClick={handleConfirmPhoneChange}
              disabled={phoneLoading || otp.join("").length !== 6}
            >
              {phoneLoading ? (
                <>
                  <FaSpinner className={styles.loadingSpinner} />
                  جاري التحقق...
                </>
              ) : (
                "تأكيد"
              )}
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                className={styles.resendButton}
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || phoneLoading}
              >
                {resendCooldown > 0
                  ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
                  : "إعادة إرسال رمز التحقق"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
