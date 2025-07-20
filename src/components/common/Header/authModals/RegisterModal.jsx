import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import {
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaLock,
  FaUser,
  FaMars,
  FaVenus,
  FaGlobeAmericas,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import useAuthStore from "../../../../stores/authStore";

import styles from "./authModals.module.css";

export default function RegisterModal({
  showRegisterModal,
  setShowRegisterModal,
  setShowLoginModal,
  setShowOTPModal,
  setGlobalNotification,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };
 

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "الاسم الأول مطلوب";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "الاسم الأول يجب أن يكون حرفين على الأقل";
    }

    if (!formData.lastName) {
      newErrors.lastName = "الاسم الأخير مطلوب";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "الاسم الأخير يجب أن يكون حرفين على الأقل";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (!formData.gender) {
      newErrors.gender = "يرجى اختيار الجنس";
    }

    if (!formData.country || formData.country === "") {
      newErrors.country = "يرجى اختيار الدولة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  validatePhone();

    if (!validateForm()) return;

    console.log("🔥 RegisterModal: بدء عملية التسجيل");
    console.log("📋 Form Data:", formData);
    console.log("👤 User authenticated?", !!localStorage.getItem("auth_token"));

    setIsLoading(true);
    setErrors({});
  if (error) {
    return;
  }

    try {
      console.log("🌐 RegisterModal: استدعاء دالة register...");
      const result = await register(formData);
      console.log("✅ RegisterModal: نجح التسجيل، النتيجة:", result);

      // Close register modal and show OTP modal immediately
      setShowRegisterModal(false);
      setShowOTPModal(true);

      // Show global success notification (verification code not displayed for security)
      if (setGlobalNotification) {
        const successMessage =
          result.note ||
          result.message ||
          "تم إنشاء الحساب بنجاح! تم إرسال كود التحقق إلى واتساب";

        setGlobalNotification({
          isVisible: true,
          message: successMessage,
          type: "success",
        });
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "male",
        country: "",
      });
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowRegisterModal(false);
    }
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

const countryOptions = [
  { name: "السعودية", code: "966", regex: /^5\d{8}$/ },
  { name: "الإمارات", code: "971", regex: /^5\d{8}$/ },
  { name: "عمان", code: "968", regex: /^7\d{7}$/ },
  { name: "قطر", code: "974", regex: /^3\d{7}$/ },
  { name: "البحرين", code: "973", regex: /^3\d{7}$/ },
  { name: "مصر", code: "20", regex: /^1\d{9}$/ },
];

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [country, setCountry] = useState(countryOptions[0]);
  const [internationalPhone, setInternationalPhone] = useState("");
const validatePhone = () => {
  const cleaned = phone.replace(/\D/g, "");

  if (!country.regex.test(cleaned)) {
    setError(
      `رقم غير صحيح، تأكد من إدخال رقم ${country.name} بدون كود الدولة وبالصيغة الصحيحة`
    );
    setInternationalPhone("");
    setFormData((prev) => ({ ...prev, phone: "" })); // نفضي الرقم بالفورم
  } else {
    setError("");
    const fullPhone = `00${country.code}${cleaned}`;
    setInternationalPhone(fullPhone);
    setFormData((prev) => ({ ...prev, phone: fullPhone })); // نحدث الرقم داخل الفورم
  }
};


  return (
    <aside
      className={`${styles.authModal} ${showRegisterModal ? styles.show : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
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
          <button
            className={styles.closeBtn}
            onClick={() => setShowRegisterModal(false)}
          >
            <MdOutlineClose />
          </button>
        </div>

        {/* Form */}
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
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
                  className={errors.firstName ? styles.inputError : ""}
                />
              </div>
              {errors.firstName && (
                <span className={styles.fieldError}>{errors.firstName}</span>
              )}
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
                  className={errors.lastName ? styles.inputError : ""}
                />
              </div>
              {errors.lastName && (
                <span className={styles.fieldError}>{errors.lastName}</span>
              )}
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
                className={errors.email ? styles.inputError : ""}
              />
            </div>
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          {/* Phone Field */}
          {/* <div className={styles.inputGroup}>
            <label htmlFor="phone"> رقم الهاتف بكود الدوله </label>
            <div className={styles.inputContainer}>
              <FiPhone className={styles.inputIcon} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="021236697111"
                className={errors.phone ? styles.inputError : ""}
              />
            </div>
            {errors.phone && (
              <span className={styles.fieldError}>{errors.phone}</span>
            )}
          </div> */}
           <div
                className="flex flex-col gap-1 w-full max-w-sm h-24"
                dir="rtl"
              >
                <label className="text-sm text-gray-700 font-medium text-right  mb-1">
                  رقم الهاتف
                </label>

                <div className="flex items-center bg-white border border-gray-300 rounded m-3 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                  {/* الدولة */}
                  <select
                    className="bg-transparent h-12 text-sm text-gray-800 outline-none cursor-pointer pr-1"
                    value={country.code}
                    onChange={(e) => {
                      const selected = countryOptions.find(
                        (c) => c.code === e.target.value
                      );
                      setCountry(selected);
                      setError("");
                    }}
                  >
                    {countryOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  {/* فاصل */}
                  <div className="w-px h-5 bg-gray-300 mx-2"></div>

                  {/* رقم الهاتف */}
                  <input
                    type="text"
                    placeholder="مثال: 512345678"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                  onBlur={validatePhone}

                  />
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <p className="text-xs text-red-600 mt-1 text-right">
                    {error}
                  </p>
                )}
              </div>

          {/* Gender and Country Fields */}
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="gender">الجنس</label>
              <div className={styles.inputContainer}>
                {formData.gender === "male" ? (
                  <FaMars className={styles.inputIcon} />
                ) : (
                  <FaVenus className={styles.inputIcon} />
                )}
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? styles.inputError : ""}
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              {errors.gender && (
                <span className={styles.fieldError}>{errors.gender}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="country">الدولة</label>
              <div className={styles.inputContainer}>
                <FaGlobeAmericas className={styles.inputIcon} />
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={errors.country ? styles.inputError : ""}
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
                <span className={styles.fieldError}>{errors.country}</span>
              )}
            </div>
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
                className={errors.password ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
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
                className={errors.confirmPassword ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.fieldError}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.spinner}></div> : "إنشاء حساب"}
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
