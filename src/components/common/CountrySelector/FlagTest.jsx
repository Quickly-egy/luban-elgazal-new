import React from 'react';
import styles from './CountrySelector.module.css';

const FlagTest = () => {
    const countries = [
        { name: 'مصر', code: 'EG', flag: '🇪🇬' },
        { name: 'السعودية', code: 'SA', flag: '🇸🇦' },
        { name: 'الإمارات العربية المتحدة', code: 'AE', flag: '🇦🇪' },
        { name: 'الكويت', code: 'KW', flag: '🇰🇼' },
        { name: 'قطر', code: 'QA', flag: '🇶🇦' },
        { name: 'البحرين', code: 'BH', flag: '🇧🇭' },
        { name: 'سلطنة عمان', code: 'OM', flag: '🇴🇲' },
        { name: 'الأردن', code: 'JO', flag: '🇯🇴' },
        { name: 'لبنان', code: 'LB', flag: '🇱🇧' },
        { name: 'العراق', code: 'IQ', flag: '🇮🇶' },
        { name: 'المغرب', code: 'MA', flag: '🇲🇦' },
        { name: 'الجزائر', code: 'DZ', flag: '🇩🇿' },
        { name: 'تونس', code: 'TN', flag: '🇹🇳' },
        { name: 'ليبيا', code: 'LY', flag: '🇱🇾' },
        { name: 'السودان', code: 'SD', flag: '🇸🇩' },
        { name: 'فلسطين', code: 'PS', flag: '🇵🇸' },
        { name: 'سوريا', code: 'SY', flag: '🇸🇾' },
        { name: 'اليمن', code: 'YE', flag: '🇾🇪' },
    ];

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            margin: '20px',
            direction: 'rtl'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Cairo' }}>
                🏁 اختبار عرض أعلام البلدان
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px'
            }}>
                {countries.map((country) => (
                    <div
                        key={country.code}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            fontFamily: 'Cairo'
                        }}
                    >
                        <span
                            className={`${styles.flagIcon} ${styles[`flag-${country.code.toLowerCase()}`]}`}
                            style={{ width: '32px', height: '24px', fontSize: '20px' }}
                            title={`${country.code} Flag`}
                            role="img"
                            aria-label={`${country.code} flag`}
                            data-country={country.code}
                        >
                            <span className={styles.flagEmoji}>{country.flag}</span>
                            <span className={styles.flagText}>{country.code}</span>
                        </span>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{country.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>({country.code})</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <p style={{ margin: 0, fontFamily: 'Cairo', fontSize: '14px' }}>
                    ✅ جميع الأعلام يجب أن تظهر بوضوح أعلاه. إذا رأيت مربعات فارغة أو رموز غير واضحة، فقد تحتاج لتحديث نظام التشغيل أو المتصفح.
                </p>
            </div>
        </div>
    );
};

export default FlagTest; 