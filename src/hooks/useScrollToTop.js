import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (options = {}) => {
  const { pathname } = useLocation();
  const { 
    behavior = 'instant', 
    delay = 0, 
    excludePaths = [],
    onlyOnRouteChange = true 
  } = options;

  useEffect(() => {
    // تحقق من أن المسار ليس في قائمة الاستثناءات
    if (excludePaths.includes(pathname)) {
      return;
    }

    const scrollToTop = () => {
      // التأكد من أن النافذة موجودة (للـ SSR)
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: behavior
        });
      }
    };

    if (delay > 0) {
      const timer = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timer);
    } else {
      scrollToTop();
    }
  }, onlyOnRouteChange ? [pathname] : [pathname, behavior, delay]);
};

export default useScrollToTop; 