import React from 'react';
import { motion } from 'framer-motion';
import { FaGavel, FaUser, FaGlobe, FaShoppingCart, FaCreditCard, FaShieldAlt, FaExclamationTriangle, FaHeadset, FaQuestionCircle } from 'react-icons/fa';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
    const termsSections = [
        {
            id: 'definitions',
            title: '1. التعريفات',
            icon: <FaGavel />,
            content: [
                'الموقع: يشير إلى موقع لبان الغزال الإلكتروني والتطبيق المحمول',
                'المستخدم: أي شخص يستخدم خدمات الموقع',
                'الخدمات: جميع الخدمات المقدمة من خلال الموقع',
                'المنتجات: جميع منتجات اللبان الحوجري وما يتعلق بها'
            ]
        },
        {
            id: 'acceptance',
            title: '2. قبول الشروط',
            icon: <FaUser />,
            content: [
                'باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام',
                'إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع',
                'نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق',
                'استمرارك في استخدام الموقع يعني موافقتك على التحديثات'
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
                            <FaGavel />
                        </motion.div>
                        <h1 className={styles.heroTitle}>شروط وأحكام الاستخدام</h1>
                        <p className={styles.heroDescription}>
                            يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام موقع لبان الغزال. نحن ملتزمون بتقديم أفضل تجربة تسوق مع ضمان الشفافية والوضوح
                        </p>
                        <div className={styles.lastUpdated}>
                            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Terms Content */}
            <section className={styles.content}>
                <div className="container">
                    <motion.div
                        className={styles.introSection}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <p>
                            مرحباً بكم في موقع لبان الغزال. هذه الشروط والأحكام تحكم استخدامكم لموقعنا الإلكتروني
                            وخدماتنا. نحن ملتزمون بتقديم أفضل تجربة تسوق لعملائنا الكرام مع ضمان الشفافية والوضوح
                            في جميع التعاملات.
                        </p>
                    </motion.div>

                    {termsSections.map((section, index) => (
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
                        <h3 className={styles.contactTitle}>لديك أسئلة حول الشروط والأحكام؟</h3>
                        <p className={styles.contactDescription}>
                            فريقنا جاهز للإجابة على جميع استفساراتك حول شروط الاستخدام وأحكام الخدمة
                        </p>
                        <div className={styles.contactDetails}>
                            <p>📧 البريد الإلكتروني: info@luban-alghazal.com</p>
                            <p>📱 الهاتف: +968 1234 5678</p>
                            <p>🕐 ساعات العمل: من الأحد إلى الخميس، 9:00 صباحاً - 6:00 مساءً</p>
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

export default TermsOfService; 