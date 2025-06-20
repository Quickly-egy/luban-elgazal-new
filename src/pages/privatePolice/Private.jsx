import React from 'react';
import { FaShieldAlt, FaEye, FaLock, FaUserShield, FaDatabase, FaCookieBite, FaHeadset, FaGavel } from 'react-icons/fa';
import styles from './private.module.css';

const Private = () => {
    const privacySections = [
        {
            id: 'info-collection',
            title: '1. جمع المعلومات',
            icon: <FaDatabase />,
            content: [
                'نجمع المعلومات الشخصية التي تقدمها طوعياً عند التسجيل أو إجراء عملية شراء',
                'قد نجمع معلومات تقنية تلقائياً مثل عنوان IP ونوع المتصفح وبيانات الاستخدام',
                'نستخدم ملفات الكوكيز لتحسين تجربة التصفح وتخصيص المحتوى',
                'جميع المعلومات المجمعة محمية وفقاً لأعلى معايير الأمان'
            ]
        },
        {
            id: 'info-usage',
            title: '2. استخدام المعلومات',
            icon: <FaEye />,
            content: [
                'نستخدم معلوماتك لمعالجة الطلبات وتقديم خدمة العملاء',
                'إرسال إشعارات مهمة حول طلباتك والعروض الحصرية',
                'تحسين خدماتنا وتطوير منتجات جديدة تلبي احتياجاتك',
                'ضمان أمان الموقع ومنع الاحتيال والاستخدام غير المشروع'
            ]
        },
        {
            id: 'info-protection',
            title: '3. حماية المعلومات',
            icon: <FaLock />,
            content: [
                'نطبق تدابير أمنية متقدمة لحماية معلوماتك الشخصية',
                'استخدام تشفير SSL لضمان أمان نقل البيانات',
                'الوصول إلى المعلومات محدود للموظفين المخولين فقط',
                'نراجع ونحدث إجراءات الأمان بانتظام لضمان أقصى حماية'
            ]
        },
        {
            id: 'info-sharing',
            title: '4. مشاركة المعلومات',
            icon: <FaUserShield />,
            content: [
                'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة',
                'قد نشارك المعلومات مع شركاء الشحن لإتمام عملية التوصيل',
                'نكشف المعلومات فقط عند الطلب القانوني من السلطات المختصة',
                'في حالة دمج الشركة، ستنتقل البيانات بنفس شروط الحماية'
            ]
        },
        {
            id: 'cookies',
            title: '5. ملفات تعريف الارتباط',
            icon: <FaCookieBite />,
            content: [
                'نستخدم الكوكيز لتحسين تجربة التصفح وحفظ تفضيلاتك',
                'يمكنك تعطيل الكوكيز من إعدادات متصفحك إذا رغبت في ذلك',
                'بعض الكوكيز ضرورية لعمل الموقع وقد لا تعمل بعض الميزات بدونها',
                'نستخدم كوكيز تحليلية لفهم سلوك المستخدمين وتحسين الخدمة'
            ]
        },
        {
            id: 'user-rights',
            title: '6. حقوق المستخدم',
            icon: <FaGavel />,
            content: [
                'يحق لك الوصول إلى معلوماتك الشخصية وطلب تعديلها في أي وقت',
                'يمكنك طلب حذف بياناتك نهائياً من قاعدة بياناتنا',
                'لك الحق في منع استخدام معلوماتك لأغراض التسويق',
                'يحق لك تقديم شكوى لسلطة حماية البيانات في بلدك'
            ]
        }
    ];

    return (
        <div className={styles.privacyPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroIcon}>
                            <FaShieldAlt />
                        </div>
                        <h1 className={styles.heroTitle}>سياسة الخصوصية</h1>
                        <p className={styles.heroDescription}>
                            نحن في لبان الغزال نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. 
                            تعرف على كيفية جمع واستخدام وحماية بياناتك من خلال هذه السياسة.
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
                                <FaShieldAlt />
                            </div>
                            <h2 className={styles.sectionTitle}>التزامنا بخصوصيتك</h2>
                        </div>
                        <div className={styles.intro}>
                            <p>
                                في لبان الغزال، نفهم أهمية خصوصيتك ونعمل جاهدين لحماية معلوماتك الشخصية.
                                هذه السياسة توضح كيفية جمع واستخدام وحماية البيانات التي تشاركها معنا عند 
                                استخدام موقعنا أو خدماتنا.
                            </p>
                        </div>
                    </div>

                    {/* Privacy Sections */}
                    {privacySections.map((section, index) => (
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
                            <div className={styles.sectionContent}>
                                {section.content.map((paragraph, pIndex) => (
                                    <div
                                        key={pIndex}
                                        className={styles.contentItem}
                                    >
                                        <div className={styles.itemBullet}>•</div>
                                        <p>{paragraph}</p>
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
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الخصوصية؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز للإجابة على جميع استفساراتك حول سياسة الخصوصية وحماية البيانات
                        </p>
                        <div className={styles.contactMethods}>
                            <div className={styles.contactMethod}>
                                <span className={styles.contactMethodIcon}>📧</span>
                                <span>privacy@luban-alghazal.com</span>
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

export default Private;
