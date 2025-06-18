import React from 'react';
import { motion } from 'framer-motion';
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
            <motion.section
                className={styles.hero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container">
                    <div className={styles.heroContent}>
                        <motion.div
                            className={styles.heroIcon}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <FaShippingFast />
                        </motion.div>
                        <h1 className={styles.heroTitle}>سياسة الشحن والتوصيل</h1>
                        <p className={styles.heroDescription}>
                            نوفر لك خدمة شحن موثوقة وسريعة لجميع أنحاء العالم مع ضمان وصول منتجاتك بأفضل حالة
                        </p>
                        <div className={styles.lastUpdated}>
                            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Content Section */}
            <section className={styles.content}>
                <div className="container">
                    {/* Shipping Features */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShippingFast />
                            </div>
                            <h2 className={styles.sectionTitle}>مميزات الشحن لدينا</h2>
                        </div>
                        <div className={styles.featuresGrid}>
                            {shippingFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.id}
                                    className={styles.featureCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.featureIcon}>{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Shipping Zones */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaGlobe />
                            </div>
                            <h2 className={styles.sectionTitle}>مناطق الشحن والأسعار</h2>
                        </div>
                        <div className={styles.zonesGrid}>
                            {shippingZones.map((zone, index) => (
                                <motion.div
                                    key={zone.id}
                                    className={styles.zoneCard}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Packaging Process */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaBox />
                            </div>
                            <h2 className={styles.sectionTitle}>عملية التغليف والإرسال</h2>
                        </div>
                        <div className={styles.processSteps}>
                            {packagingSteps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    className={styles.stepCard}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.stepNumber}>{step.step}</div>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepContent}>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Important Notes */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShieldAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>ملاحظات مهمة</h2>
                        </div>
                        <div className={styles.notesGrid}>
                            {shippingNotes.map((note, index) => (
                                <motion.div
                                    key={note.id}
                                    className={styles.noteCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.noteIcon}>{note.icon}</div>
                                    <div className={styles.noteContent}>
                                        <h4>{note.title}</h4>
                                        <p>{note.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <motion.section
                className={styles.contactSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
            >
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
            </motion.section>
        </div>
    );
};

export default ShippingPolicy; 