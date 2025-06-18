import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaDatabase, FaCookie, FaEnvelope, FaLock, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import styles from './private.module.css';

export default function Private() {
    const privacySections = [
        {
            
            id: 'introduction',
            title: 'مقدمة',
            icon: <FaShieldAlt />,
            content: [
                'نحن في لبان الغزال نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي المعلومات التي تقدمها لنا.',
                'تنطبق هذه السياسة على جميع الخدمات المقدمة من خلال موقعنا الإلكتروني وتطبيقاتنا المحمولة.'
            ]
        },
        {
            id: 'data-collection',
            title: 'جمع المعلومات',
            icon: <FaDatabase />,
            content: [
                'نقوم بجمع المعلومات التالية:',
                '• المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان',
                '• معلومات الطلب: تفاصيل المنتجات، تاريخ الطلب، طريقة الدفع',
                '• المعلومات التقنية: عنوان IP، نوع المتصفح، الجهاز المستخدم',
                '• ملفات تعريف الارتباط: لتحسين تجربة التصفح'
            ]
        },
        {
            id: 'data-usage',
            title: 'استخدام المعلومات',
            icon: <FaUserShield />,
            content: [
                'نستخدم معلوماتك للأغراض التالية:',
                '• معالجة الطلبات وتقديم الخدمات',
                '• التواصل معك بخصوص طلباتك',
                '• تحسين منتجاتنا وخدماتنا',
                '• إرسال العروض والتحديثات (بموافقتك)',
                '• ضمان أمان الموقع ومنع الاحتيال'
            ]
        },
        {
            id: 'data-protection',
            title: 'حماية البيانات',
            icon: <FaLock />,
            content: [
                'نتخذ إجراءات أمنية صارمة لحماية معلوماتك:',
                '• تشفير البيانات الحساسة',
                '• استخدام خوادم آمنة محمية بكلمات مرور قوية',
                '• التحديث المستمر لأنظمة الأمان',
                '• تقييد الوصول للمعلومات للموظفين المخولين فقط'
            ]
        },
        {
            id: 'cookies',
            title: 'ملفات تعريف الارتباط',
            icon: <FaCookie />,
            content: [
                'نستخدم ملفات تعريف الارتباط لـ:',
                '• تذكر تفضيلاتك وإعداداتك',
                '• تحليل حركة المرور على الموقع',
                '• تخصيص المحتوى والإعلانات',
                '• تحسين أداء الموقع',
                'يمكنك إدارة إعدادات ملفات تعريف الارتباط من خلال متصفحك.'
            ]
        },
        {
            id: 'third-party',
            title: 'مشاركة المعلومات',
            icon: <FaExclamationTriangle />,
            content: [
                'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.',
                'قد نشارك معلوماتك في الحالات التالية:',
                '• مع شركاء الشحن لتوصيل طلباتك',
                '• مع معالجات الدفع لإتمام المعاملات',
                '• عند الحاجة للامتثال للقوانين',
                '• لحماية حقوقنا أو حقوق المستخدمين الآخرين'
            ]
        },
        {
            id: 'user-rights',
            title: 'حقوقك',
            icon: <FaUserShield />,
            content: [
                'لديك الحقوق التالية فيما يتعلق بمعلوماتك:',
                '• الوصول إلى معلوماتك الشخصية',
                '• تصحيح أو تحديث معلوماتك',
                '• طلب حذف معلوماتك',
                '• الاعتراض على معالجة معلوماتك',
                '• نقل معلوماتك إلى خدمة أخرى',
                'للممارسة أي من هذه الحقوق، يرجى التواصل معنا.'
            ]
        },
        {
            id: 'contact',
            title: 'التواصل معنا',
            icon: <FaEnvelope />,
            content: [
                'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا:',
                '• البريد الإلكتروني: privacy@luban-elgazal.com',
                '• الهاتف: +966 XX XXX XXXX',
                '• العنوان: المملكة العربية السعودية'
            ]
        }
    ];

    return (
        <div className={styles.privacyPage}>
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
                            <FaShieldAlt />
                        </motion.div>
                        <h1 className={styles.heroTitle}>سياسة الخصوصية</h1>
                        <p className={styles.heroDescription}>
                            نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. تعرف على كيف نجمع ونستخدم ونحمي بياناتك
                        </p>
                        <div className={styles.lastUpdated}>
                            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Privacy Content */}
            <section className={styles.content}>
                <div className="container">
                    {privacySections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            className={styles.section}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                        >
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    {section.icon}
                                </div>
                                <h2 className={styles.sectionTitle}>{section.title}</h2>
                            </div>
                            <div className={styles.sectionContent}>
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className={styles.paragraph}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <motion.section
                className={styles.contactSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <div className="container">
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <FaQuestionCircle />
                        </div>
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الخصوصية؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز للإجابة على جميع استفساراتك حول سياسة الخصوصية وحماية البيانات
                        </p>
                        <a href="/contact" className={styles.contactButton}>
                            تواصل معنا الآن
                        </a>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
