import React, { useState, useEffect } from 'react';
import { validateCity, getSupportedCities } from '../../../services/shipping';
import styles from './CityValidator.module.css';

const CityValidator = ({ city, onValidationChange, showSuggestions = true }) => {
  const [isValid, setIsValid] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!city) {
      setIsValid(true);
      setError('');
      setSuggestions([]);
      onValidationChange?.(true, '');
      return;
    }

    const valid = validateCity(city);
    setIsValid(valid);

    if (!valid) {
      const errorMessage = `المدينة "${city}" غير مدعومة من خدمة الشحن`;
      setError(errorMessage);
      
      // Find similar cities for suggestions
      if (showSuggestions) {
        const supportedCities = getSupportedCities();
        const cityLower = city.toLowerCase();
        const similarCities = supportedCities.filter(supportedCity => 
          supportedCity.toLowerCase().includes(cityLower) || 
          cityLower.includes(supportedCity.toLowerCase())
        ).slice(0, 3);
        
        setSuggestions(similarCities);
      }
      
      onValidationChange?.(false, errorMessage);
    } else {
      setError('');
      setSuggestions([]);
      onValidationChange?.(true, '');
    }
  }, [city, onValidationChange, showSuggestions]);

  if (isValid) {
    return null;
  }

  return (
    <div className={styles.validator}>
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠️</span>
        <span className={styles.errorMessage}>{error}</span>
      </div>
      
      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <p className={styles.suggestionsTitle}>المدن المدعومة المشابهة:</p>
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li key={index} className={styles.suggestionItem}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.supportedCities}>
        <details className={styles.citiesDropdown}>
          <summary className={styles.citiesToggle}>
            عرض جميع المدن المدعومة
          </summary>
          <div className={styles.citiesGrid}>
            {getSupportedCities().map((city, index) => (
              <span key={index} className={styles.cityItem}>
                {city}
              </span>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default CityValidator; 