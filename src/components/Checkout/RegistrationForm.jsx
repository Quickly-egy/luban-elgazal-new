import { useState } from "react";
import { FaUser, FaLock, FaMars, FaVenus, FaGlobeAmericas, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import useAuthStore from "../../stores/authStore";

import { getCountryCode, formatPhoneWithCountryCode, validatePhoneNumber } from '../../utils/countryCodes';

import styles from "./RegistrationForm.module.css";

export default function RegistrationForm({ onRegistrationSuccess, onCheckoutRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    country: "السعودية", // Default country
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("السعودية");
  const [phoneInput, setPhoneInput] = useState("");

  const { register } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle country selection change
  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
    }));

    // Update phone number with new country code if phone input exists
    if (phoneInput) {
      const formattedPhone = formatPhoneWithCountryCode(phoneInput, countryName);
      setFormData((prev) => ({
        ...prev,
        phone: formattedPhone,
      }));
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneInput(value);

    // Format phone with country code
    const formattedPhone = formatPhoneWithCountryCode(value, selectedCountry);
    setFormData((prev) => ({
      ...prev,
      phone: formattedPhone,
    }));

    // Clear phone error when user types
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "الاسم الأول قصير جداً (حرفين على الأقل)";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "الاسم الأخير مطلوب";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "الاسم الأخير قصير جداً (حرفين على الأقل)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!phoneInput.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!validatePhoneNumber(phoneInput, selectedCountry)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.gender) {
      newErrors.gender = "يرجى اختيار الجنس";
    }

    if (!formData.country) {
      newErrors.country = "يرجى اختيار الدولة";
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
      const result = await register(formData);
      
      // Log the registration result for debugging
      
      // Call the appropriate success callback
      if (onCheckoutRegistrationSuccess) {
        // For checkout flow, we chain registration with order placement
        onCheckoutRegistrationSuccess(result);
      } else if (onRegistrationSuccess) {
        // For regular registration flow
        onRegistrationSuccess(result);
      }
    } catch (error) {
      // Handle validation errors (422)
      if (error.validationErrors) {
        const validationErrors = {};

        // Map API field names to form field names
        const fieldMapping = {
          first_name: "firstName",
          last_name: "lastName",
          email: "email",
          phone: "phone",
          password: "password",
          gender: "gender",
          country: "country",
        };

        Object.keys(error.validationErrors).forEach((apiField) => {
          const formField = fieldMapping[apiField] || apiField;
          const errorMessages = error.validationErrors[apiField];

          // Translate common error messages to Arabic
          let arabicMessage = errorMessages[0];
          const errorMessage = errorMessages[0].toLowerCase();

          if (
            errorMessage.includes("already been taken") ||
            errorMessage.includes("already exists")
          ) {
            if (apiField === "email") {
              arabicMessage = "هذا البريد الإلكتروني مستخدم بالفعل";
            } else if (apiField === "phone") {
              arabicMessage = "رقم الهاتف هذا مستخدم بالفعل";
            } else {
              arabicMessage = "هذه البيانات مستخدمة بالفعل";
            }
          } else if (
            errorMessage.includes("invalid") ||
            errorMessage.includes("format")
          ) {
            if (apiField === "email") {
              arabicMessage = "البريد الإلكتروني غير صحيح";
            } else if (apiField === "phone") {
              arabicMessage = "رقم الهاتف غير صحيح";
            } else {
              arabicMessage = "التنسيق غير صحيح";
            }
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("field is required")
          ) {
            if (apiField === "first_name") {
              arabicMessage = "الاسم الأول مطلوب";
            } else if (apiField === "last_name") {
              arabicMessage = "الاسم الأخير مطلوب";
            } else if (apiField === "email") {
              arabicMessage = "البريد الإلكتروني مطلوب";
            } else if (apiField === "phone") {
              arabicMessage = "رقم الهاتف مطلوب";
            } else if (apiField === "password") {
              arabicMessage = "كلمة المرور مطلوبة";
            } else if (apiField === "gender") {
              arabicMessage = "يرجى اختيار الجنس";
            } else if (apiField === "country") {
              arabicMessage = "يرجى اختيار الدولة";
            } else {
              arabicMessage = "هذا الحقل مطلوب";
            }
          } else if (
            errorMessage.includes("too short") ||
            errorMessage.includes("minimum") ||
            errorMessage.includes("at least")
          ) {
            if (apiField === "password") {
              arabicMessage = "كلمة المرور قصيرة جداً (8 أحرف على الأقل)";
            } else if (apiField === "first_name" || apiField === "last_name") {
              arabicMessage = "الاسم قصير جداً (حرفين على الأقل)";
            } else {
              arabicMessage = "القيمة قصيرة جداً";
            }
          } else if (
            errorMessage.includes("too long") ||
            errorMessage.includes("maximum") ||
            errorMessage.includes("may not be greater than")
          ) {
            arabicMessage = "القيمة طويلة جداً";
          } else if (errorMessage.includes("must be a valid email")) {
            arabicMessage = "البريد الإلكتروني غير صحيح";
          } else if (
            errorMessage.includes("numeric") ||
            errorMessage.includes("digits")
          ) {
            arabicMessage = "يجب أن يحتوي على أرقام فقط";
          } else if (errorMessage.includes("unique")) {
            arabicMessage = "هذه البيانات مستخدمة بالفعل";
          }

          validationErrors[formField] = arabicMessage;
        });

        setErrors(validationErrors);
      } else {
        // Handle general errors
        setErrors({ general: error.message || "حدث خطأ في إنشاء الحساب" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If OTP form is shown, render it instead of registration form


  return (
    <div className={styles.registrationForm}>
      <h2 className={styles.formTitle}>
        إنشاء حساب جديد
      </h2>
      
      <p className={styles.formSubtitle}>
        يرجى ملء المعلومات التالية لإنشاء حسابك وإتمام عملية الدفع
      </p>

      {errors.general && (
        <div className={styles.errorGeneral}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">الاسم الأول *</label>
          <div className={styles.inputWithoutIcon}>
            <input
              type="text"
              id="checkout-firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? styles.inputError : ""}
              placeholder="أدخل اسمك الأول"
            />
          </div>
          {errors.firstName && (
            <span className={styles.errorMessage}>{errors.firstName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">الاسم الأخير *</label>
          <div className={styles.inputWithoutIcon}>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? styles.inputError : ""}
              placeholder="أدخل اسمك الأخير"
            />
          </div>
          {errors.lastName && (
            <span className={styles.errorMessage}>{errors.lastName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">البريد الإلكتروني *</label>
          <div className={styles.inputWithoutIcon}>
            <input
              type="email"
              id="checkout-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? styles.inputError : ""}
              placeholder="example@email.com"
            />
          </div>
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">رقم الهاتف *</label>
          <div className={styles.inputWithIcon} style={{gap: 8, display: "flex", alignItems: "center"}}>
            <span className={styles.countryCode}>
              {getCountryCode(selectedCountry)}
            </span>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phoneInput}
              onChange={handlePhoneChange}
              className={errors.phone ? styles.inputError : ""}
              placeholder="رقم الهاتف"
              style={{ direction: "ltr", flex: 1 }}
            />
          </div>
          {errors.phone && (
            <span className={styles.errorMessage}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">الدولة *</label>
          <div className={styles.inputWithoutIcon}>
            <select
              id="country"
              name="country"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={errors.country ? styles.inputError : ""}
            >
              <option value="مصر">مصر</option>
              <option value="السعودية">السعودية</option>
              <option value="الإمارات">الإمارات العربية المتحدة</option>
              <option value="الكويت">الكويت</option>
              <option value="قطر">قطر</option>
              <option value="البحرين">البحرين</option>
              <option value="عمان">عمان</option>
              <option value="الأردن">الأردن</option>
              <option value="لبنان">لبنان</option>
              <option value="سوريا">سوريا</option>
              <option value="العراق">العراق</option>
              <option value="اليمن">اليمن</option>
              <option value="ليبيا">ليبيا</option>
              <option value="تونس">تونس</option>
              <option value="الجزائر">الجزائر</option>
              <option value="المغرب">المغرب</option>
              <option value="السودان">السودان</option>
              <option value="فلسطين">فلسطين</option>
            </select>
          </div>
          {errors.country && (
            <span className={styles.errorMessage}>{errors.country}</span>
          )}
        </div>



        <div className={styles.formGroup}>
          <label>الجنس *</label>
          <div className={styles.genderOptions}>
            <label className={`${styles.genderOption} ${formData.gender === "male" ? styles.selected : ""}`}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleInputChange}
              />
              <span>ذكر</span>
            </label>
            
            <label className={`${styles.genderOption} ${formData.gender === "female" ? styles.selected : ""}`}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleInputChange}
              />
              <span>أنثى</span>
            </label>
          </div>
          {errors.gender && (
            <span className={styles.errorMessage}>{errors.gender}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              جاري التسجيل...
            </>
          ) : (
            "إنشاء الحساب"
          )}
        </button>
      </form>
    </div>
  );
}
