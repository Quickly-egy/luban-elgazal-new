import React from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaTools, FaFileAlt, FaFrown, FaTimes, FaExchangeAlt, FaRandom, FaMoneyBillWave, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import styles from './ReturnPolicy.module.css';

const ReturnPolicy = () => {
    const returnReasons = [
        {
            id: 'defect',
            title: "عيب في المنتج",
            description: "إذا وصل المنتج معيباً أو تالفاً",
            icon: <FaTools />,
            timeframe: "30 يوم"
        },
        {
            id: 'mismatch',
            title: "عدم مطابقة الوصف",
            description: "إذا كان المنتج لا يطابق الوصف المذكور",
            icon: <FaFileAlt />,
            timeframe: "15 يوم"
        },
        {
            id: 'satisfaction',
            title: "عدم الرضا",
            description: "إذا لم يعجبك المنتج لأي سبب كان",
            icon: <FaFrown />,
            timeframe: "7 أيام"
        },
        {
            id: 'wrong-product',
            title: "منتج خاطئ",
            description: "إذا تم إرسال منتج مختلف عن المطلوب",
            icon: <FaTimes />,
            timeframe: "30 يوم"
        }
    ];

    const returnSteps = [
        {
            id: 'contact',
            step: "1",
            title: "التواصل معنا",
            description: "تواصل مع خدمة العملاء خلال المدة المحددة للإرجاع",
            icon: <FaQuestionCircle />
        },
        {
            id: 'request',
            step: "2",
            title: "طلب الإرجاع",
            description: "احصل على رقم طلب الإرجاع وتعليمات التعبئة",
            icon: <FaFileAlt />
        },
        {
            id: 'package',
            step: "3",
            title: "تعبئة المنتج",
            description: "قم بتعبئة المنتج في عبوته الأصلية مع جميع الإكسسوارات",
            icon: <FaShieldAlt />
        },
        {
            id: 'send',
            step: "4",
            title: "الإرسال",
            description: "أرسل المنتج باستخدام خدمة الشحن المحددة",
            icon: <FaUndo />
        },
        {
            id: 'refund',
            step: "5",
            title: "المراجعة والاسترداد",
            description: "سنراجع المنتج ونعيد المبلغ خلال 3-5 أيام عمل",
            icon: <FaMoneyBillWave />
        }
    ];

    const conditions = [
        {
            id: 'original-condition',
            text: "يجب أن يكون المنتج في حالته الأصلية",
            icon: <FaShieldAlt />
        },
        {
            id: 'packaging',
            text: "يجب أن تكون العبوة الأصلية والملصقات سليمة",
            icon: <FaFileAlt />
        },
        {
            id: 'usage',
            text: "يجب عدم استخدام المنتج بشكل يؤثر على جودته",
            icon: <FaTools />
        },
        {
            id: 'receipt',
            text: "يجب إرفاق فاتورة الشراء الأصلية",
            icon: <FaFileAlt />
        },
        {
            id: 'timeframe',
            text: "يجب التواصل معنا خلال المدة المحددة للإرجاع",
            icon: <FaQuestionCircle />
        }
    ];

    const exchangeOptions = [
        {
            id: 'same-product',
            title: "استبدال بمنتج مماثل",
            description: "استبدال المنتج بنفس النوع والحجم",
            icon: <FaExchangeAlt />
        },
        {
            id: 'different-product',
            title: "استبدال بمنتج مختلف",
            description: "استبدال بمنتج آخر بنفس القيمة أو دفع الفرق",
            icon: <FaRandom />
        },
        {
            id: 'full-refund',
            title: "استرداد كامل",
            description: "استرداد المبلغ كاملاً إلى نفس طريقة الدفع",
            icon: <FaMoneyBillWave />
        }
    ];

    return (
        <div className={styles.returnPage}>
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
                            <FaUndo />
                        </motion.div>
                        <h1 className={styles.heroTitle}>سياسة الاسترداد والاستبدال</h1>
                        <p className={styles.heroDescription}>
                            نحن ملتزمون برضاك التام عن منتجاتنا. إذا لم تكن راضياً لأي سبب، يمكنك إرجاع أو استبدال منتجك بسهولة
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

                    {/* Return Reasons */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaUndo />
                            </div>
                            <h2 className={styles.sectionTitle}>أسباب الإرجاع المقبولة</h2>
                        </div>
                        <div className={styles.reasonsGrid}>
                            {returnReasons.map((reason, index) => (
                                <motion.div
                                    key={reason.id}
                                    className={styles.reasonCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.reasonIcon}>{reason.icon}</div>
                                    <h3>{reason.title}</h3>
                                    <p>{reason.description}</p>
                                    <div className={styles.timeframe}>
                                        <span>مدة الإرجاع: {reason.timeframe}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Return Process */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaFileAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>خطوات الإرجاع</h2>
                        </div>
                        <div className={styles.processTimeline}>
                            {returnSteps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    className={styles.timelineStep}
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
                                    {index < returnSteps.length - 1 && <div className={styles.stepConnector}></div>}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Exchange Options */}
                    <motion.div
                        className={styles.section}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaExchangeAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>خيارات الاستبدال</h2>
                        </div>
                        <div className={styles.optionsGrid}>
                            {exchangeOptions.map((option, index) => (
                                <motion.div
                                    key={option.id}
                                    className={styles.optionCard}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.optionIcon}>{option.icon}</div>
                                    <h3>{option.title}</h3>
                                    <p>{option.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Conditions */}
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
                            <h2 className={styles.sectionTitle}>شروط الإرجاع والاستبدال</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            {conditions.map((condition, index) => (
                                <motion.div
                                    key={condition.id}
                                    className={styles.conditionItem}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.conditionIcon}>{condition.icon}</div>
                                    <p>{condition.text}</p>
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
                        <h3 className={styles.contactTitle}>لديك أسئلة حول سياسة الإرجاع؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز للإجابة على جميع استفساراتك حول عمليات الإرجاع والاستبدال
                        </p>
                        <div className={styles.contactMethods}>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📧</span>
                                <span>returns@luban-alghazal.com</span>
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

export default ReturnPolicy; 