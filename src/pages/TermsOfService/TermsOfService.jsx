import React from 'react';
import { FaFileContract, FaCrown, FaGlobe, FaShoppingCart, FaCreditCard, FaShieldAlt, FaExclamationTriangle, FaHeadset } from 'react-icons/fa';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
    const sections = [
        {
            id: 'acceptance',
            title: '1. قبول الشروط',
            icon: <FaFileContract />,
            content: [
                'باستخدام موقع لبان الغزال، فإنك توافق على الالتزام بهذه الشروط والأحكام',
                'إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام الموقع',
                'نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق',
                'استخدامك المستمر للموقع يعني موافقتك على أي تعديلات'
            ]
        },
        {
            id: 'company',
            title: '2. معلومات الشركة',
            icon: <FaCrown />,
            content: [
                'لبان الغزال هي شركة رائدة في مجال منتجات العناية والجمال',
                'مقرنا الرئيسي في سلطنة عُمان، ونخدم العملاء في جميع أنحاء المنطقة',
                'نلتزم بتقديم منتجات عالية الجودة وخدمة عملاء متميزة',
                'جميع منتجاتنا خاضعة لمعايير الجودة والسلامة الدولية'
            ]
        },
        {
            id: 'usage',
            title: '3. استخدام الموقع',
            icon: <FaGlobe />,
            content: [
                'يجب أن تكون بعمر 18 سنة أو أكثر لاستخدام هذا الموقع',
                'يجب تقديم معلومات صحيحة ودقيقة عند التسجيل',
                'أنت مسؤول عن الحفاظ على سرية بيانات حسابك',
                'لا يجوز استخدام الموقع لأي أغراض غير قانونية',
                'يُمنع نسخ أو توزيع محتوى الموقع دون إذن مسبق'
            ]
        },
        {
            id: 'products',
            title: '4. المنتجات والأسعار',
            icon: <FaShoppingCart />,
            content: [
                'جميع المنتجات معروضة بناءً على التوفر',
                'الأسعار قابلة للتغيير دون إشعار مسبق',
                'نحتفظ بالحق في رفض أي طلب شراء',
                'جميع المنتجات أصلية ومضمونة الجودة',
                'الصور المعروضة قد تختلف قليلاً عن المنتج الفعلي'
            ]
        },
        {
            id: 'payment',
            title: '5. الطلبات والدفع',
            icon: <FaCreditCard />,
            content: [
                'يُعتبر الطلب مؤكداً بعد تأكيد الدفع',
                'نقبل طرق الدفع المختلفة المعلنة على الموقع',
                'في حالة رفض الدفع، سيتم إلغاء الطلب تلقائياً',
                'أسعار الشحن تُحسب حسب الموقع الجغرافي'
            ]
        },
        {
            id: 'privacy',
            title: '6. الخصوصية',
            icon: <FaShieldAlt />,
            content: [
                'نحترم خصوصية المستخدمين ونحمي بياناتهم الشخصية',
                'لا نشارك المعلومات الشخصية مع أطراف ثالثة دون موافقة',
                'نستخدم البيانات لتحسين الخدمة والتواصل مع العملاء',
                'يمكن للمستخدم طلب حذف بياناته في أي وقت'
            ]
        },
        {
            id: 'liability',
            title: '7. المسؤولية',
            icon: <FaExclamationTriangle />,
            content: [
                'نسعى لتقديم أفضل الخدمات لكن لا نضمن عدم وجود أخطاء',
                'المستخدم مسؤول عن استخدام المنتجات بطريقة آمنة',
                'لا نتحمل مسؤولية الأضرار الناتجة عن سوء الاستخدام',
                'في حالة وجود مشاكل، يُرجى التواصل مع خدمة العملاء'
            ]
        },
        {
            id: 'support',
            title: '8. التواصل وخدمة العملاء',
            icon: <FaHeadset />,
            content: [
                'فريق خدمة العملاء متاح للإجابة على استفساراتكم',
                'يمكن التواصل عبر البريد الإلكتروني أو الهاتف',
                'نلتزم بالرد على الاستفسارات خلال 24 ساعة',
                'جميع الشكاوى تُعامل بسرية وأهمية'
            ]
        }
    ];

    return (
        <div className={styles.termsPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}>
                            <FaFileContract />
                        </div>
                        <h1 className={styles.heroTitle}>شروط الخدمة</h1>
                        <p className={styles.heroDescription}>
                            اقرأ بعناية شروط وأحكام استخدام موقع لبان الغزال للتسوق والخدمات
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
                    {/* Introduction */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaFileContract />
                            </div>
                            <h2 className={styles.sectionTitle}>مقدمة</h2>
                        </div>
                        <div className={styles.intro}>
                            <p>
                                مرحباً بك في موقع لبان الغزال. هذه الصفحة توضح الشروط والأحكام التي تحكم 
                                استخدامك لموقعنا الإلكتروني وخدماتنا. نرجو منك قراءة هذه الشروط بعناية 
                                قبل البدء في استخدام الموقع.
                            </p>
                        </div>
                    </div>

                    {/* Terms Sections */}
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={styles.section}
                        >
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    {section.icon}
                                </div>
                                <h2 className={styles.sectionTitle}>{section.title}</h2>
                            </div>
                            <div className={styles.contentList}>
                                {section.content.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className={styles.contentItem}
                                    >
                                        <div className={styles.itemIcon}>•</div>
                                        <p>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection}>
                <div className="container">
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <FaHeadset />
                        </div>
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الشروط؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا القانوني جاهز للإجابة على جميع استفساراتك حول شروط الخدمة
                        </p>
                        <div className={styles.contactMethods}>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📧</span>
                                <span>legal@luban-alghazal.com</span>
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

export default TermsOfService; 