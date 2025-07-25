import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaThLarge, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import useCartStore from '../../../stores/cartStore';
import useAuthStore from '../../../stores/authStore';
import useWishlistStore from '../../../stores/wishlistStore';
import CartModal from '../Header/cartModal/CartModal';
import WishlistModal from '../Header/wishlistModal/WishlistModal';
import Profile from '../../profile/Profile';
import { LoginModal, RegisterModal, ForgotPasswordModal } from '../Header/authModals';
import OTPModal from '../Header/authModals/OTPModal';
import SuccessNotification from '../SuccessNotification/SuccessNotification';
import styles from './BottomNavigation.module.css';

const BottomNavigation = () => {
  const location = useLocation();

  // Pages where bottom navigation should be hidden
  const hiddenRoutes = ['/checkout', '/payment-failed'];
  const shouldHideNavigation = hiddenRoutes.includes(location.pathname);

  if (shouldHideNavigation) {
    return null;
  }
  const { getCartCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const { isAuthenticated, logout } = useAuthStore();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // State for modals
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [globalNotification, setGlobalNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const handleCartClick = () => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setShowCartModal(true);
  };

  const handleWishlistClick = () => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setShowWishlistModal(true);
  };

  const handleAccountClick = () => {
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    if (isAuthenticated) {
      setShowProfile(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  const navigationItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: FaHome,
      path: '/',
      isLink: true
    },
    {
      id: 'products',
      label: 'جميع الأقسام',
      icon: FaThLarge,
      path: '/products',
      isLink: true
    },
    {
      id: 'wishlist',
      label: 'المفضلة',
      icon: FaHeart,
      onClick: handleWishlistClick,
      badge: wishlistCount
    },
    {
      id: 'cart',
      label: 'السلة',
      icon: FaShoppingCart,
      onClick: handleCartClick,
      badge: cartCount
    },
    {
      id: 'account',
      label: 'حسابي',
      icon: FaUser,
      onClick: handleAccountClick
    }
  ];

  return (
    <>
      <nav className={styles.bottomNav}>
        <div className={styles.navContainer}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isLink) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                >
                  <div className={styles.iconContainer}>
                    <Icon className={styles.icon} />
                    <span className={styles.label}>{item.label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`${styles.navItem} ${item.badge > 0 ? styles.hasItems : ''}`}
                data-type={item.id}
              >
                <div className={styles.iconContainer}>
                  <Icon className={styles.icon} />
                  {item.badge > 0 && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                  <span className={styles.label}>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <CartModal
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        setShowLoginModal={setShowLoginModal}
      />

      <WishlistModal
        showWishlistModal={showWishlistModal}
        setShowWishlistModal={setShowWishlistModal}
      />
      
      <Profile
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        onLogout={handleLogout}
      />

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />

      <RegisterModal
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowLoginModal={setShowLoginModal}
        setShowOTPModal={setShowOTPModal}
        setGlobalNotification={setGlobalNotification}
      />

      <ForgotPasswordModal
        showForgotPasswordModal={showForgotPasswordModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
        setShowLoginModal={setShowLoginModal}
      />

      <OTPModal
        showOTPModal={showOTPModal}
        setShowOTPModal={setShowOTPModal}
        setShowLoginModal={setShowLoginModal}
        setGlobalNotification={setGlobalNotification}
      />

      <SuccessNotification 
        notification={globalNotification}
        setNotification={setGlobalNotification}
      />
    </>
  );
};

export default BottomNavigation; 