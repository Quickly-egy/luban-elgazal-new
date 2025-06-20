import React from 'react';
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
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}>
                            <FaUndo />
                        </div>
                        <h1 className={styles.heroTitle}>سياسة الاسترداد والاستبدال</h1>
                        <p className={styles.heroDescription}>
                            نحن ملتزمون برضاك التام عن منتجاتنا. إذا لم تكن راضياً لأي سبب، يمكنك إرجاع أو استبدال منتجك بسهولة
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
                    {/* Return Reasons */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaUndo />
                            </div>
                            <h2 className={styles.sectionTitle}>أسباب الإرجاع والاستبدال</h2>
                        </div>
                        <div className={styles.reasonsGrid}>
                            {returnReasons.map((reason, index) => (
                                <div
                                    key={reason.id}
                                    className={styles.reasonCard}
                                >
                                    <div className={styles.reasonIcon}>{reason.icon}</div>
                                    <h3>{reason.title}</h3>
                                    <p>{reason.description}</p>
                                    <div className={styles.timeframe}>{reason.timeframe}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Return Process */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaFileAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>خطوات الإرجاع والاستبدال</h2>
                        </div>
                        <div className={styles.processTimeline}>
                            {returnSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={styles.timelineStep}
                                >
                                    <div className={styles.stepNumber}>{step.step}</div>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepContent}>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                    {index < returnSteps.length - 1 && <div className={styles.stepConnector}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exchange Options */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaExchangeAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>خيارات الإرجاع والاستبدال</h2>
                        </div>
                        <div className={styles.optionsGrid}>
                            {exchangeOptions.map((option, index) => (
                                <div
                                    key={option.id}
                                    className={styles.optionCard}
                                >
                                    <div className={styles.optionIcon}>{option.icon}</div>
                                    <h3>{option.title}</h3>
                                    <p>{option.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShieldAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>شروط الإرجاع والاستبدال</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            {conditions.map((condition, index) => (
                                <div
                                    key={condition.id}
                                    className={styles.conditionItem}
                                >
                                    <div className={styles.conditionIcon}>{condition.icon}</div>
                                    <p>{condition.text}</p>
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
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الإرجاع؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز لمساعدتك في عملية الإرجاع والاستبدال
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
            </section>
        </div>
    );
};

export default ReturnPolicy; 