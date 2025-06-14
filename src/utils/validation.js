export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^01[0-2,5][0-9]{8}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const value = formData[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.message || `${field} مطلوب`;
        break;
      }
      
      if (rule.email && value && !validateEmail(value)) {
        errors[field] = rule.message || 'البريد الإلكتروني غير صحيح';
        break;
      }
      
      if (rule.phone && value && !validatePhone(value)) {
        errors[field] = rule.message || 'رقم الهاتف غير صحيح';
        break;
      }
      
      if (rule.minLength && value && !validateMinLength(value, rule.minLength)) {
        errors[field] = rule.message || `يجب أن يكون ${field} ${rule.minLength} أحرف على الأقل`;
        break;
      }
      
      if (rule.maxLength && value && !validateMaxLength(value, rule.maxLength)) {
        errors[field] = rule.message || `يجب أن يكون ${field} ${rule.maxLength} أحرف على الأكثر`;
        break;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 