import React from 'react';
import { FaUndo, FaShieldAlt, FaExchangeAlt, FaMoneyBillWave, FaFileAlt, FaQuestionCircle, FaClock, FaCreditCard, FaWallet, FaBan, FaCheck, FaGift, FaBox, FaWhatsapp, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ReturnPolicy.module.css';

const ReturnPolicy = () => {
    const basicPolicies = [
        {
            id: 'return-intact',
            title: "استرجاع المنتج السليم",
            description: "في حال استرجاع منتج سليم وغير تالف، يتحمل العميل كامل رسوم الشحن، والتي يتم خصمها من قيمة المنتج المسترجع",
            icon: <FaUndo />
        },
        {
            id: 'return-defective',
            title: "استلام منتج تالف",
            description: "في حال استلام منتج بحالة تالفة أو معيبة، تتحمل Luban Alghazal جميع تكاليف الشحن والاستبدال",
            icon: <FaShieldAlt />
        },
        {
            id: 'exchange-option',
            title: "استبدال المنتج",
            description: "يحق للعميل طلب استبدال المنتج بمنتج آخر مع تحمل فرق السعر إن وجد، بالإضافة إلى تكلفة الشحن",
            icon: <FaExchangeAlt />
        },
        {
            id: 'refusal-right',
            title: "حق الرفض",
            description: "تحتفظ Luban Alghazal بالحق في رفض طلبات الاستبدال في بعض الحالات الخاصة وفقًا لتقدير الشركة",
            icon: <FaBan />
        }
    ];

    const returnConditions = [
        {
            id: 'original-state',
            title: "الحالة الأصلية",
            description: "يشترط أن تكون المنتجات بحالتها الأصلية، غير مفتوحة أو مستخدمة، وبغلافها الأصلي دون أي تلف أو تغيير في التغليف",
            icon: <FaBox />
        },
        {
            id: 'company-error',
            title: "خطأ من الشركة",
            description: "في حال كان سبب الاسترجاع خطأ في الطلب من جانبنا، سيتم استرداد المبلغ كاملاً، مع تحمل Luban Alghazal تكاليف الشحن",
            icon: <FaCheck />
        }
    ];

    const exchangeConditions = [
        {
            id: 'timeframe',
            title: "المدة الزمنية",
            description: "يمكن للعميل استبدال المنتج خلال 5 أيام من استلام الطلب، بشرط أن يكون المنتج غير مستخدم وفي عبوته الأصلية",
            icon: <FaClock />
        },
        {
            id: 'cost-difference',
            title: "فرق التكلفة",
            description: "يتحمل العميل فرق التكلفة إن وجد، بالإضافة إلى رسوم الشحن",
            icon: <FaMoneyBillWave />
        }
    ];

    const rejectionCases = [
        {
            id: 'used-product',
            title: "المنتج المستخدم",
            description: "إذا كان المنتج قد تم استخدامه أو فتحه",
            icon: <FaBan />
        },
        {
            id: 'excluded-products',
            title: "المنتجات المستثناة",
            description: "إذا كان المنتج غير مشمول بسياسة الاستبدال (مثل بعض المنتجات التي تتعلق بالاستخدام الشخصي)",
            icon: <FaExclamationTriangle />
        },
        {
            id: 'conditions-not-met',
            title: "عدم استيفاء الشروط",
            description: "إذا كان طلب الاستبدال لا يستوفي الشروط المذكورة",
            icon: <FaFileAlt />
        }
    ];

    const requestSteps = [
        {
            id: 'contact',
            step: "1",
            title: "تقديم الطلب",
            description: "يمكن تقديم الطلب من خلال مركز المساعدة أو عبر واتساب المتجر: 📱 (+96871511513)",
            icon: <FaWhatsapp />
        },
        {
            id: 'form',
            step: "2",
            title: "تعبئة النموذج",
            description: "تعبئة نموذج الطلب مع توضيح السبب، وإرفاق صور توضيحية عند الحاجة",
            icon: <FaFileAlt />
        },
        {
            id: 'response',
            step: "3",
            title: "الرد على الطلب",
            description: "سيتم الرد على الطلب خلال 3 أيام عمل",
            icon: <FaClock />
        }
    ];

    const specialOffers = [
        {
            id: 'defective-offers',
            title: "المنتجات التالفة في العروض",
            description: "في حال استلام منتج تالف أو معيب ضمن العروض، سيتم تعويض العميل بشحن منتج جديد مجانًا أو إضافة قيمة المنتج إلى رصيده في المحفظة",
            icon: <FaGift />
        },
        {
            id: 'no-cash-return',
            title: "عدم الاسترداد النقدي",
            description: "لا يمكن استرجاع قيمة الطلبية نقدًا للحساب البنكي في هذه الحالة",
            icon: <FaBan />
        }
    ];

    const refundMethods = [
        {
            id: 'credit-card',
            title: "الدفع بالبطاقة الائتمانية",
            description: "عند الدفع بالبطاقة الائتمانية، يتم استرجاع المبلغ إلى المحفظة أو الحساب البنكي خلال 7 أيام عمل",
            icon: <FaCreditCard />
        },
        {
            id: 'cash-on-delivery',
            title: "الدفع عند الاستلام",
            description: "عند الدفع عند الاستلام، يكون الاسترجاع كـ رصيد في المحفظة لاستخدامه في الطلبات القادمة",
            icon: <FaWallet />
        }
    ];

    const importantNotes = [
        {
            id: 'shipping-costs',
            title: "تكاليف الشحن",
            description: "تكاليف الشحن غير قابلة للاسترداد، إلا في حال كان الاسترجاع بسبب تلف أو خطأ من الشركة",
            icon: <FaMoneyBillWave />
        },
        {
            id: 'processing-fees',
            title: "رسوم المعالجة",
            description: "في بعض الحالات، قد يتم فرض رسوم معالجة إضافية وفقًا لطبيعة المنتج وحالته عند الإرجاع",
            icon: <FaExclamationTriangle />
        },
        {
            id: 'rejection-right',
            title: "حق الرفض",
            description: "تحتفظ Luban Alghazal بحق رفض أي طلب استرجاع أو استبدال لا يستوفي الشروط",
            icon: <FaBan />
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
                        <h1 className={styles.heroTitle}>سياسة الاستبدال والاسترجاع</h1>
                        <p className={styles.heroDescription}>
                            نحن ملتزمون برضاك التام عن منتجاتنا. يمكنك الاستبدال أو الاسترجاع وفقاً لشروطنا الواضحة والعادلة
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
                    {/* Basic Return and Exchange Policy */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaUndo />
                            </div>
                            <h2 className={styles.sectionTitle}>سياسة الاستبدال والاسترجاع</h2>
                        </div>
                        <div className={styles.reasonsGrid}>
                            {basicPolicies.map((policy, index) => (
                                <div
                                    key={policy.id}
                                    className={styles.reasonCard}
                                >
                                    <div className={styles.reasonIcon}>{policy.icon}</div>
                                    <h3>{policy.title}</h3>
                                    <p>{policy.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Return Conditions */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaShieldAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>شروط قبول الاسترجاع</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            {returnConditions.map((condition, index) => (
                                <div
                                    key={condition.id}
                                    className={styles.conditionItem}
                                >
                                    <div className={styles.conditionIcon}>{condition.icon}</div>
                                    <div>
                                        <h3>{condition.title}</h3>
                                        <p>{condition.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exchange Conditions */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaExchangeAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>شروط قبول الاستبدال</h2>
                        </div>
                        <div className={styles.optionsGrid}>
                            {exchangeConditions.map((condition, index) => (
                                <div
                                    key={condition.id}
                                    className={styles.optionCard}
                                >
                                    <div className={styles.optionIcon}>{condition.icon}</div>
                                    <h3>{condition.title}</h3>
                                    <p>{condition.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rejection Cases */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaBan />
                            </div>
                            <h2 className={styles.sectionTitle}>حالات رفض الاستبدال</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            {rejectionCases.map((rejectionCase, index) => (
                                <div
                                    key={rejectionCase.id}
                                    className={styles.conditionItem}
                                >
                                    <div className={styles.conditionIcon}>{rejectionCase.icon}</div>
                                    <div>
                                        <h3>{rejectionCase.title}</h3>
                                        <p>{rejectionCase.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Request Process */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaFileAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>آلية طلب الاسترجاع أو الاستبدال</h2>
                        </div>
                        <div className={styles.processTimeline}>
                            {requestSteps.map((step, index) => (
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
                                    {index < requestSteps.length - 1 && <div className={styles.stepConnector}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special Offers Returns */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaGift />
                            </div>
                            <h2 className={styles.sectionTitle}>🔹 استرجاع المنتجات التالفة في العروض والتخفيضات</h2>
                        </div>
                        <div className={styles.optionsGrid}>
                            {specialOffers.map((offer, index) => (
                                <div
                                    key={offer.id}
                                    className={styles.optionCard}
                                >
                                    <div className={styles.optionIcon}>{offer.icon}</div>
                                    <h3>{offer.title}</h3>
                                    <p>{offer.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time and Processing */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaClock />
                            </div>
                            <h2 className={styles.sectionTitle}>🔹 مدة الاسترجاع والاستبدال والمعالجة</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            <div className={styles.conditionItem}>
                                <div className={styles.conditionIcon}><FaClock /></div>
                                <div>
                                    <h3>مدة التقدم بالطلب</h3>
                                    <p>يمكنكم التقدم بطلب استرجاع أو استبدال المنتج خلال 5 أيام بعد استلام الشحنة</p>
                                </div>
                            </div>
                            <div className={styles.conditionItem}>
                                <div className={styles.conditionIcon}><FaFileAlt /></div>
                                <div>
                                    <h3>مدة المعالجة</h3>
                                    <p>تستغرق عملية الاسترجاع أو الاستبدال ومعالجتها حتى 10 أيام عمل</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Methods */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaMoneyBillWave />
                            </div>
                            <h2 className={styles.sectionTitle}>🔹 آلية استرداد المبلغ</h2>
                        </div>
                        <div className={styles.optionsGrid}>
                            {refundMethods.map((method, index) => (
                                <div
                                    key={method.id}
                                    className={styles.optionCard}
                                >
                                    <div className={styles.optionIcon}>{method.icon}</div>
                                    <h3>{method.title}</h3>
                                    <p>{method.description}</p>
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
                            <h2 className={styles.sectionTitle}>🔹 ملاحظات هامة</h2>
                        </div>
                        <div className={styles.conditionsList}>
                            {importantNotes.map((note, index) => (
                                <div
                                    key={note.id}
                                    className={styles.conditionItem}
                                >
                                    <div className={styles.conditionIcon}>{note.icon}</div>
                                    <div>
                                        <h3>{note.title}</h3>
                                        <p>{note.description}</p>
                                    </div>
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
                        <h3 className={styles.contactTitle}>✉️ لمزيد من المعلومات أو الاستفسارات</h3>
                        <p className={styles.contactDescription}>
                            تواصلوا معنا عبر خدمة العملاء
                        </p>
                        <div className={styles.contactMethods}>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📧</span>
                                <span>returns@luban-alghazal.com</span>
                            </div>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📱</span>
                                <span>+96871511513</span>
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