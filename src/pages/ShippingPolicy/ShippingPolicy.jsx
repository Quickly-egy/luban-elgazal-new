import React from 'react';
import { FaShippingFast, FaMapMarkerAlt, FaBox, FaShieldAlt, FaTruck, FaGlobe, FaQuestionCircle, FaPhoneAlt } from 'react-icons/fa';
import styles from './ShippingPolicy.module.css';

const ShippingPolicy = () => {
    const shippingZones = [
        {
            id: 'oman',
            region: "داخل سلطنة عُمان",
            cities: ["مسقط", "صلالة", "نزوى", "صحار", "البريمي", "مطرح"],
            deliveryTime: "1-2 أيام عمل",
            cost: "2 ريال عماني",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'gcc',
            region: "دول مجلس التعاون الخليجي",
            cities: ["الإمارات", "السعودية", "قطر", "الكويت", "البحرين"],
            deliveryTime: "3-5 أيام عمل",
            cost: "5-8 ريال عماني",
            icon: <FaGlobe />
        },
        {
            id: 'arab',
            region: "الدول العربية",
            cities: ["مصر", "الأردن", "لبنان", "المغرب", "تونس", "الجزائر"],
            deliveryTime: "7-10 أيام عمل",
            cost: "12-18 ريال عماني",
            icon: <FaGlobe />
        },
        {
            id: 'world',
            region: "باقي دول العالم",
            cities: ["أوروبا", "أمريكا", "آسيا", "أستراليا"],
            deliveryTime: "10-15 يوم عمل",
            cost: "20-35 ريال عماني",
            icon: <FaGlobe />
        }
    ];

    const shippingFeatures = [
        {
            id: 'tracking',
            title: "تتبع الشحنة",
            description: "تتبع مباشر لشحنتك من لحظة الإرسال حتى الوصول",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'packaging',
            title: "تغليف آمن",
            description: "تغليف احترافي يضمن وصول منتجاتك بأفضل حالة",
            icon: <FaBox />
        },
        {
            id: 'fast',
            title: "شحن سريع",
            description: "أوقات تسليم سريعة ومضمونة",
            icon: <FaShippingFast />
        },
        {
            id: 'guarantee',
            title: "ضمان الوصول",
            description: "نضمن وصول طلبك أو نعيد المبلغ كاملاً",
            icon: <FaShieldAlt />
        }
    ];

    const packagingSteps = [
        {
            id: 'check',
            step: "1",
            title: "فحص المنتج",
            description: "فحص دقيق للتأكد من جودة المنتج قبل التغليف",
            icon: <FaShieldAlt />
        },
        {
            id: 'pack',
            step: "2",
            title: "التغليف الآمن",
            description: "تغليف المنتج بمواد عالية الجودة لحمايته أثناء النقل",
            icon: <FaBox />
        },
        {
            id: 'label',
            step: "3",
            title: "إضافة بيانات الشحن",
            description: "طباعة وإرفاق جميع البيانات اللازمة للشحن",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'ship',
            step: "4",
            title: "الإرسال والتتبع",
            description: "إرسال الطلب مع رقم تتبع للمتابعة المستمرة",
            icon: <FaTruck />
        }
    ];

    const shippingNotes = [
        {
            id: 'security',
            title: "أمان الشحنة",
            description: "جميع الشحنات مؤمنة ومتتبعة لضمان الوصول الآمن",
            icon: <FaShieldAlt />
        },
        {
            id: 'tracking',
            title: "تتبع مستمر",
            description: "إمكانية تتبع الطلب في أي وقت عبر رقم التتبع",
            icon: <FaMapMarkerAlt />
        },
        {
            id: 'support',
            title: "دعم على مدار الساعة",
            description: "فريق الدعم متاح للمساعدة في أي استفسار عن الشحن",
            icon: <FaPhoneAlt />
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
                            نوفر لك خدمة شحن موثوقة وسريعة لجميع أنحاء العالم مع ضمان وصول منتجاتك بأفضل حالة
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
                    {/* Shipping Features */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShippingFast />
                            </div>
                            <h2 className={styles.sectionTitle}>مميزات الشحن لدينا</h2>
                        </div>
                        <div className={styles.featuresGrid}>
                            {shippingFeatures.map((feature, index) => (
                                <div
                                    key={feature.id}
                                    className={styles.featureCard}
                                >
                                    <div className={styles.featureIcon}>{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Zones */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaGlobe />
                            </div>
                            <h2 className={styles.sectionTitle}>مناطق الشحن والأسعار</h2>
                        </div>
                        <div className={styles.zonesGrid}>
                            {shippingZones.map((zone, index) => (
                                <div
                                    key={zone.id}
                                    className={styles.zoneCard}
                                >
                                    <div className={styles.zoneHeader}>
                                        <div className={styles.zoneIcon}>{zone.icon}</div>
                                        <h3>{zone.region}</h3>
                                    </div>
                                    <div className={styles.zoneCities}>
                                        {zone.cities.map((city, cityIndex) => (
                                            <span key={cityIndex} className={styles.cityTag}>{city}</span>
                                        ))}
                                    </div>
                                    <div className={styles.zoneInfo}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>مدة التوصيل:</span>
                                            <span className={styles.infoValue}>{zone.deliveryTime}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>تكلفة الشحن:</span>
                                            <span className={styles.infoCost}>{zone.cost}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Packaging Process */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaBox />
                            </div>
                            <h2 className={styles.sectionTitle}>عملية التغليف والإرسال</h2>
                        </div>
                        <div className={styles.processSteps}>
                            {packagingSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={styles.stepCard}
                                >
                                    <div className={styles.stepNumber}>{step.step}</div>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepContent}>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShieldAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>معلومات مهمة</h2>
                        </div>
                        <div className={styles.featuresGrid}>
                            {shippingNotes.map((note, index) => (
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