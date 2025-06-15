import {
  FaComments,
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTiktok,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from "react-icons/fa";
import styles from "./contact.module.css";
import { FaClock } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";

const contactMethods = [
  {
    icon: <FaPhone />,
    title: "خدمة العملاء",
    mainText: "+20 987654321",
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
    mainText: "updated@example.com",
    subText: "نرد خلال 24 ساعة",
    iconBg: "#00BD4A",
    isLink: true,
    color: "#22c55e",
    bgColor: "#f0fdf4",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "موقعنا",
    mainText: "Updated Address",
    subText: "زوروا متجرنا",
    iconBg: "#9F29FE",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
];
const socialLinks = [
  {
    name: "فيسبوك",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com", // عدل الرابط
  },
  {
    name: "تيك توك",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com",
  },
  {
    name: "يوتيوب",
    icon: <FaYoutube />,
    url: "https://www.youtube.com",
  },
  {
    name: "الموقع",
    icon: <FaGlobe />,
    url: "https://www.example.com", // رابط الموقع
  },
  {
    name: "إنستغرام",
    icon: <FaInstagram />,
    url: "https://www.instagram.com",
  },
  {
    name: "تويتر",
    icon: <FaTwitter />,
    url: "https://www.twitter.com",
  },
];
export default function Contact() {
  return (
    <section>
      <div className={`${styles.hero} flex-column`}>
        <div className={styles.message_icon}>
          <FaEnvelope className={styles.post_icon} />
        </div>
        <h2 className={styles.contact_address}>تواصل معنا</h2>
        <p className={styles.text}>
          نحن هنا لمساعدتك في اي وقت. تواصل معنا عبر اي من الطرق التاليه وسنكون
          سعداء بالرد عليك
        </p>
        <div className={styles.hero_btn}>
          <FaClock className={styles.clock} />
          <span>متاحون 24/7 لخدمتك</span>
        </div>
      </div>
      <div className={`${styles.contact_data} container`}>
        {contactMethods.map((method) => (
          <div
            className={styles.contact_card}
            style={{ backgroundColor: method.bgColor }}
          >
            <div
              className={`${styles.contact_icon} center`}
              style={{
                color: "white",
                backgroundColor: method.iconBg,
              }}
            >
              {method.icon}
            </div>
            <h6>{method.title}</h6>
            <p
              style={{
                fontWeight: method.mainText.startsWith("+") ? "bold" : "normal",
                color: method.mainText.startsWith("+") ? "#ef4444" : "#1f2937",
              }}
            >
              {method.mainText}
            </p>
            <p style={{ color: "#6b7280" }}>{method.subText}</p>
          </div>
        ))}
      </div>
      <div className={`${styles.middle_section} container`}>
        <div className={`${styles.contact_form}`}>
          <div className={`${styles.icon_question} center`}>
            <FaQuestion className={styles.faquestion}/>
          </div>
          <h2>هل لديك أسئلة؟</h2>
          <p>نحن هنا للمساعدة. أرسل لنا رسالتك وسنرد عليك قريباً</p>
          <form className={`${styles.form} flex-column`}>
            <input type="text" placeholder="الاسم بالكامل" />
            <input type="text" placeholder="البريد الالكتروني" />
            <input type="text" placeholder="موضوع الرساله" />
            <textarea placeholder="اكتب رسالتك هنا..."></textarea>
            <button className={`${styles.form_btn} center`}>
              <BsFillSendFill />
              <span> ارسال الرسالة</span>
            </button>
          </form>
        </div>
        <div className={`${styles.social_cards}`}>
          <div className={`${styles.social_icon} center`}>
            <FaUsers className={styles.fausers}/>
          </div>
          <h2>تابعنا علي</h2>
          <p>ابق علي اطلاع بأخر الأخبار والعروض </p>
          <div className={`${styles.media}`}>
            {socialLinks.map((app) => (
              <div className={`${styles.app} flex-column`}>
                <div className={`center-x ${styles.icons}`}>{app.icon}</div>
                <p>{app.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
