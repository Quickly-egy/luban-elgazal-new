import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaThLarge, 
  FaShoppingBag, 
  FaUser, 
  FaTags,
  FaListUl 
} from 'react-icons/fa';
import { 
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiOutlineHeart,
  HiHome,
  HiShoppingBag,
  HiUser,
  HiViewGrid,
  HiHeart
} from 'react-icons/hi';
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

  // Navigation items matching the image design (right to left)
  const navigationItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      outlineIcon: HiOutlineHome,
      filledIcon: HiHome,
      path: '/',
      isLink: true
    },
    {
      id: 'categories',
      label: 'جميع الأقسام',
      outlineIcon: HiOutlineViewGrid,
      filledIcon: HiViewGrid,
      path: '/products',
      isLink: true
    },
    {
      id: 'wishlist',
      label: 'المفضلة',
      outlineIcon: HiOutlineHeart,
      filledIcon: HiHeart,
      onClick: handleWishlistClick,
      badge: wishlistCount
    },
    {
      id: 'cart',
      label: 'سلة التسوق',
      outlineIcon: HiOutlineShoppingBag,
      filledIcon: HiShoppingBag,
      onClick: handleCartClick,
      badge: cartCount
    },
    {
      id: 'account',
      label: 'حسابي',
      outlineIcon: HiOutlineUser,
      filledIcon: HiUser,
      onClick: handleAccountClick
    }
  ];

  return (
    <>
      <nav className={styles.bottomNav}>
        <div className={styles.navContainer}>
          {navigationItems.map((item) => {
            const isActive = item.isLink && location.pathname === item.path;
            const OutlineIcon = item.outlineIcon;
            const FilledIcon = item.filledIcon;
            const IconComponent = isActive ? FilledIcon : OutlineIcon;
            
            if (item.isLink) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <div className={styles.iconContainer}>
                    <IconComponent className={styles.icon} />
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
                  <OutlineIcon className={styles.icon} />
                  {item.badge !== undefined && item.badge > 0 && (
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