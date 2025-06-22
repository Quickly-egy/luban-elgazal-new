import {
  FaComments,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTiktok,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./contact.module.css";
import { FaClock } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useContactForm from "../../hooks/useContactForm";
import useAbout from "../../hooks/useAbout";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("الاسم مطلوب")
    .min(3, "يجب أن يكون الاسم 3 أحرف على الأقل")
    .max(50, "يجب أن لا يتجاوز الاسم 50 حرف"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "البريد الإلكتروني غير صالح"
    ),
  subject: yup
    .string()
    .required("الموضوع مطلوب")
    .min(5, "يجب أن يكون الموضوع 5 أحرف على الأقل")
    .max(100, "يجب أن لا يتجاوز الموضوع 100 حرف"),
  message: yup
    .string()
    .required("الرسالة مطلوبة")
    .min(10, "يجب أن تكون الرسالة 10 أحرف على الأقل")
    .max(1000, "يجب أن لا تتجاوز الرسالة 1000 حرف"),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const { data, isLoading: aboutLoading } = useAbout();
  const { mutate, isLoading: formLoading } = useContactForm();

  const contactMethods = [
    {
      icon: <FaPhone />,
      title: "خدمة العملاء",
      mainText: data?.phone || "Loading...",
      subText: "اتصل بنا من 8 صباحاً حتى 8 مساءً",
      iconBg: "#F11D2A",
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
    {
      icon: <FaComments />,
      title: "محادثة مباشرة",
      mainText: "تحدث معنا الآن",
      subText: "يومياً: 8 صباحاً حتى 11 مساءً",
      iconBg: "#2476FF",
      isLink: true,
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      icon: <FaEnvelope />,
      title: "البريد الإلكتروني",
      mainText: data?.email || "Loading...",
      subText: "نرد خلال 24 ساعة",
      iconBg: "#00BD4A",
      isLink: true,
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
  ];

  const socialLinks = [
    {
      name: "فيسبوك",
      icon: <FaFacebookF />,
      url: data?.facebook || "#",
      color: "#1877f2",
    },
    {
      name: "تيك توك",
      icon: <FaTiktok />,
      url: data?.tiktok || "#",
      color: "#000000",
    },
    {
      name: "يوتيوب",
      icon: <FaYoutube />,
      url: data?.youtube || "#",
      color: "#ff0000",
    },
    {
      name: "إنستغرام",
      icon: <FaInstagram />,
      url: data?.instagram || "#",
      color: "#e4405f",
    },
    {
      name: "تويتر",
      icon: <FaTwitter />,
      url: data?.twitter || "#",
      color: "#1da1f2",
    },
  ];

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // Reset form after successful submission
      },
    });
  };

  if (aboutLoading) {
    return (
      <div className={styles.contactPage}>
        <LoadingSpinner message="جاري التحميل..." />
      </div>
    );
  }

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>📞 تواصل معنا</h1>
            <p className={styles.heroDescription}>
              نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر أي من الطرق التالية
              وسنكون سعداء بالرد عليك
            </p>
          </div>
        </div>
      </motion.section>

      <div className="container">
        {/* Contact Methods */}
        <motion.section
          className={styles.contactMethods}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              className={styles.contactCard}
              style={{ backgroundColor: method.bgColor }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div
                className={styles.contactIcon}
                style={{
                  color: "white",
                  backgroundColor: method.iconBg,
                }}
              >
                {method.icon}
              </div>
              <h3>{method.title}</h3>
              <p
                className={`${styles.mainText} ${
                  method.mainText.startsWith("+") ? styles.phoneNumber : ""
                }`}
                style={{
                  fontWeight: method.mainText.startsWith("+") ? "bold" : "600",
                  color: method.mainText.startsWith("+")
                    ? "#ef4444"
                    : "#1f2937",
                }}
              >
                {method.mainText}
              </p>
              <p className={styles.subText}>{method.subText}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Contact Form */}
          <motion.div
            className={styles.contactForm}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.formHeader}>
              <div className={styles.formIcon}>
                <FaQuestion />
              </div>
              <h2>هل لديك أسئلة؟</h2>
              <p>نحن هنا للمساعدة. أرسل لنا رسالتك وسنرد عليك قريباً</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="الاسم بالكامل"
                  {...register("name")}
                  className={errors.name ? styles.inputError : ""}
                  disabled={formLoading}
                />
                {errors.name && (
                  <p className={styles.error}>{errors.name.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  {...register("email")}
                  className={errors.email ? styles.inputError : ""}
                  disabled={formLoading}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="موضوع الرسالة"
                  {...register("subject")}
                  className={errors.subject ? styles.inputError : ""}
                  disabled={formLoading}
                />
                {errors.subject && (
                  <p className={styles.error}>{errors.subject.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  placeholder="اكتب رسالتك هنا..."
                  rows="5"
                  {...register("message")}
                  className={errors.message ? styles.inputError : ""}
                  disabled={formLoading}
                />
                {errors.message && (
                  <p className={styles.error}>{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                disabled={formLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {formLoading ? (
                  <LoadingSpinner message="جاري الإرسال..." />
                ) : (
                  <>
                    <BsFillSendFill />
                    <span>إرسال الرسالة</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className={styles.socialSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.socialHeader}>
              <div className={styles.socialIcon}>
                <FaUsers />
              </div>
              <h2>تابعنا على</h2>
              <p>ابق على اطلاع بآخر الأخبار والعروض</p>
            </div>

            <div className={styles.socialGrid}>
              {socialLinks.map((platform, index) => (
                <motion.a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialCard}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 10px 25px ${platform.color}20`,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div
                    className={styles.socialCardIcon}
                    style={{ color: platform.color }}
                  >
                    {platform.icon}
                  </div>
                  <span>{platform.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
