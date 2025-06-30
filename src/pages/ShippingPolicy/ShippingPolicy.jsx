import React from 'react';
import { FaShippingFast, FaMapMarkerAlt, FaBox, FaShieldAlt, FaTruck, FaGlobe, FaQuestionCircle, FaPhoneAlt, FaClock, FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ShippingPolicy.module.css';

const ShippingPolicy = () => {
    const preparationInfo = [
        {
            id: 'preparation',
            title: "تجهيز الطلبية",
            description: "يستغرق تجهيز الطلب من 1-3 أيام عمل",
            icon: <FaBox />
        },
        {
            id: 'delivery',
            title: "مدة التوصيل",
            description: "يتم التوصيل خلال 2 إلى 10 أيام عمل تقريباً وعلى حسب حركة النقل",
            icon: <FaTruck />
        },
        {
            id: 'global',
            title: "شحن عالمي",
            description: "نقدم خدمة الشحن والتوصيل إلى عموم عملائنا في جميع أنحاء العالم",
            icon: <FaGlobe />
        }
    ];

    const deliveryResponsibilities = [
        {
            id: 'address',
            title: "عنوان التوصيل والمتابعة",
            description: "يجب على العميل تقديم معلومات واضحة ودقيقة عن عنوان التوصيل كما يجب عليه تقديم بيانات اتصال ليتمكن مندوب شركة الشحن من التواصل معه",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'follow-up',
            title: "متابعة الطلبية",
            description: "يجب على العميل متابعة الطلبية الخاصة به مع شركة الشحن، ومتابعة مراحل عملية الشحن ليتمكن من تزويدهم بأي بيانات أو معلومات أو وسائل اتصال مطلوبة لتنفيذ عملية التسليم في الوقت المحدد",
            icon: <FaUserCheck />
        },
        {
            id: 'cooperation',
            title: "التعاون مع شركة الشحن",
            description: "قد تقوم شركة الشحن بتسليم المنتجات لعنوان العميل أو في أقرب مقر لعنوان العميل على حسب المتاح لدى شركة الشحن وذلك إذا كانت شركة الشحن لا تغطي المنطقة المطلوب الشحن إليها، ويجب على العميل التعاون مع شركة الشحن لاستلام المنتج",
            icon: <FaShieldAlt />
        }
    ];

    const importantNotes = [
        {
            id: 'delay-notice',
            title: "إشعار التأخير",
            description: "قد يحدث بعض التأخير في توصيل الطلب للعميل لأسباب ترجع إلى شركات الشحن، ويعلم العميل ويوافق على أن لبان الغزال لن يكون مسؤول بأي شكل من الأشكال عن تأخير الشحن والتوصيل",
            icon: <FaExclamationTriangle />
        },
        {
            id: 'accuracy',
            title: "دقة المعلومات",
            description: "قد يحدث تأخير أو عدم تمكن شركات الشحن من التوصيل في حال قدم العميل معلومات غير دقيقة أو عدم الرد على اتصالات مندوب شركة الشحن",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'responsibility',
            title: "مسؤولية العميل",
            description: "يتحمل العميل مسؤولية متابعة الطلبية والتعاون مع شركة الشحن لضمان التسليم في الوقت المحدد",
            icon: <FaUserCheck />
        }
    ];

    return (
        <div className={styles.shippingPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}>
                            <FaShippingFast />
                        </div>
                        <h1 className={styles.heroTitle}>سياسة الشحن والتوصيل</h1>
                        <p className={styles.heroDescription}>
                            يتم تقديم خدمة الشحن والتوصيل إلى عموم عملائنا في جميع أنحاء العالم
                        </p>
                        <div className={styles.lastUpdated}>
                            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.content}>
                <div className="container">
                    {/* Preparation and Delivery Info */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShippingFast />
                            </div>
                            <h2 className={styles.sectionTitle}>سياسة الشحن</h2>
                        </div>
                        <div className={styles.featuresGrid}>
                            {preparationInfo.map((info, index) => (
                                <div
                                    key={info.id}
                                    className={styles.featureCard}
                                >
                                    <div className={styles.featureIcon}>{info.icon}</div>
                                    <h3>{info.title}</h3>
                                    <p>{info.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Responsibilities */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaUserCheck />
                            </div>
                            <h2 className={styles.sectionTitle}>مسؤوليات العميل</h2>
                        </div>
                        <div className={styles.zonesGrid}>
                            {deliveryResponsibilities.map((responsibility, index) => (
                                <div
                                    key={responsibility.id}
                                    className={styles.zoneCard}
                                >
                                    <div className={styles.zoneHeader}>
                                        <div className={styles.zoneIcon}>{responsibility.icon}</div>
                                        <h3>{responsibility.title}</h3>
                                    </div>
                                    <div className={styles.zoneInfo}>
                                        <p>{responsibility.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaExclamationTriangle />
                            </div>
                            <h2 className={styles.sectionTitle}>ملاحظات مهمة</h2>
                        </div>
                        <div className={styles.featuresGrid}>
                            {importantNotes.map((note, index) => (
                                <div
                                    key={note.id}
                                    className={styles.featureCard}
                                >
                                    <div className={styles.featureIcon}>{note.icon}</div>
                                    <h3>{note.title}</h3>
                                    <p>{note.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection}>
                <div className="container">
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <FaQuestionCircle />
                        </div>
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الشحن؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز للإجابة على جميع استفساراتك حول الشحن والتوصيل
                        </p>
                        <div className={styles.contactMethods}>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📧</span>
                                <span>shipping@luban-alghazal.com</span>
                            </div>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📱</span>
                                <span>+968 1234 5678</span>
                            </div>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>🕐</span>
                                <span>9:00 صباحاً - 6:00 مساءً</span>
                            </div>
                        </div>
                        <a href="/contact" className={styles.contactButton}>
                            تواصل معنا الآن
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShippingPolicy; 