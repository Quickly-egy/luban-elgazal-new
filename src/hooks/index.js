// Export all hooks
export { default as useAbout } from './useAbout';
export { default as useAddresses } from './useAddresses';
export { default as useApi } from './useApi';
export { default as useBlog } from './useBlog';
export { useClientOrders, useOrder, useOrderStatistics } from './useClientOrders';
export { default as useContactForm } from './useContactForm';
export { useCurrency } from './useCurrency';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useProducts, useProductsWithAutoLoad, useProductSearch, useProduct, useProductCategories } from './useProducts';
export { useScrollToTop } from './useScrollToTop';
export { default as useGeography, useCountries, useCities } from './useGeography';

// Re-export defaults for backwards compatibility
export { default as useClientOrdersDefault } from './useClientOrders';
export { default as useCurrencyDefault } from './useCurrency';
export { default as useScrollToTopDefault } from './useScrollToTop';
