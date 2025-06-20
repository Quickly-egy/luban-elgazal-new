import React, { useState, useEffect } from 'react';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';
import useLocationStore from '../../../stores/locationStore';
import styles from './CountrySelector.module.css';

// Flag component using react-country-flag library
const FlagIcon = ({ countryCode }) => {
    return (
        <div className={styles.flagContainer}>
            <ReactCountryFlag
                countryCode={countryCode}
                svg
                style={{
                    width: '20px',
                    height: '15px',
                }}
                title={countryCode}
            />
        </div>
    );
};

const CountrySelector = () => {
    const { country, countryCode, setLocation, changeCountry } = useLocationStore();
    const [isOpen, setIsOpen] = useState(false);

    // If no country is set, set a default to Saudi Arabia
    useEffect(() => {
        if (!countryCode && !country) {
            setLocation('السعودية', 'SA');
        }
    }, [countryCode, country, setLocation]);

    // List of supported GCC countries only
    const countries = [
        { name: 'السعودية', code: 'SA', flag: '🇸🇦' },
        { name: 'الإمارات العربية المتحدة', code: 'AE', flag: '🇦🇪' },
        { name: 'قطر', code: 'QA', flag: '🇶🇦' },
        { name: 'الكويت', code: 'KW', flag: '🇰🇼' },
        { name: 'البحرين', code: 'BH', flag: '🇧🇭' },
        { name: 'سلطنة عمان', code: 'OM', flag: '🇴🇲' }
    ];

    // Find current country display info
    const currentCountry = countries.find(c => c.code === countryCode) || {
        name: country || 'اختر البلد',
        code: countryCode || '',
        flag: countryCode === 'USD' ? '💵' : '🌍'
    };

    const handleCountrySelect = (selectedCountry) => {
        changeCountry(selectedCountry.name, selectedCountry.code);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Debug: Log all countries and their flags for verification
    useEffect(() => {
        console.log('🏁 Available Countries and Flags:');
        countries.forEach(country => {
            console.log(`${country.flag} ${country.name} (${country.code})`);
        });
    }, []);

    return (
        <div className={styles.countrySelector}>
            <button
                className={styles.selectorButton}
                onClick={toggleDropdown}
                aria-label="اختيار البلد"
            >
                <div className={styles.currentCountry}>
                    <FaGlobe className={styles.globeIcon} />
                    <FlagIcon countryCode={currentCountry.code} />
                    <span className={styles.countryName}>{currentCountry.name}</span>
                </div>
                <FaChevronDown
                    className={`${styles.dropdownIcon} ${isOpen ? styles.open : ''}`}
                />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                        <div className={styles.dropdownHeader}>
                            <h4>اختر بلدك</h4>
                        </div>
                        <div className={styles.countriesList}>
                            {countries.map((countryItem) => (
                                <button
                                    key={countryItem.code}
                                    className={`${styles.countryOption} ${countryItem.code === countryCode ? styles.selected : ''
                                        }`}
                                    onClick={() => handleCountrySelect(countryItem)}
                                >
                                    <div className={styles.countryInfo}>
                                        <FlagIcon countryCode={countryItem.code} />
                                        <span className={styles.countryName}>{countryItem.name}</span>
                                        <span className={styles.countryCode}>({countryItem.code})</span>
                                    </div>
                                    {countryItem.code === countryCode && (
                                        <FaCheck className={styles.checkIcon} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default CountrySelector; 