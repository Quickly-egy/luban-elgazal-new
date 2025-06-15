import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaUserPlus, FaTimes, FaHome, FaShoppingBag, FaBox, FaBlog, FaPhone, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import styles from './mobileMenu.module.css';

export default function MobileMenu({ 
  isMenuOpen, 
  setIsMenuOpen, 
  setShowLoginModal, 
  setShowRegisterModal 
}) {
  const location = useLocation();
  
  const navigationLinks = [
    { name: "الرئيسية", path: "/", icon: <FaHome /> },
    { name: "المنتجات", path: "/products", icon: <FaShoppingBag />, badge: "جديد" },
    { name: "تتبع الطلب", path: "/order-tracking", icon: <FaBox /> },
    { name: "المدونة", path: "/blog", icon: <FaBlog /> },
    { name: "تواصل معنا", path: "/contact", icon: <FaPhone /> },
    { name: "من نحن", path: "/whoweare", icon: <FaInfoCircle /> },
    { name: "الأسئلة الشائعة", path: "/faq", icon: <FaQuestionCircle /> },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setIsMenuOpen(false);
    setShowRegisterModal(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  // Close menu when clicking outside or pressing escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  // Add event listener for escape key
  React.useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <aside 
      className={`${styles.mobileMenu} ${isMenuOpen ? styles.show : ""}`} 
      onClick={handleOverlayClick}
    >
      <div className={styles.menuContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.menuHeader}>
          <div className={styles.headerContent}>
            <h3>القائمة الرئيسية</h3>
            <p>تصفح جميع الأقسام</p>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authSection}>
          <button className={styles.loginBtn} onClick={handleLoginClick}>
            <FaUser className={styles.btnIcon} />
            <span>تسجيل الدخول</span>
          </button>
          <button className={styles.registerBtn} onClick={handleRegisterClick}>
            <FaUserPlus className={styles.btnIcon} />
            <span>إنشاء حساب</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            {navigationLinks.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                  onClick={handleLinkClick}
                >
                  <div className={styles.linkContent}>
                    <div className={styles.linkIcon}>
                      {item.icon}
                    </div>
                    <span className={styles.linkText}>{item.name}</span>
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </div>
                  <div className={styles.linkArrow}>
                    <span>←</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={styles.menuFooter}>
          <p>© 2024 لبان الغزال</p>
          <p>جميع الحقوق محفوظة</p>
        </div>
      </div>
    </aside>
  );
} 