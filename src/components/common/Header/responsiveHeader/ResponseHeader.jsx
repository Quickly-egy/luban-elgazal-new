import { useState, useEffect } from 'react';
import { FaHeart, FaSearch, FaShoppingCart, FaUser, FaUserPlus } from 'react-icons/fa';
import useWishlistStore from '../../../../stores/wishlistStore';
import useCartStore from '../../../../stores/cartStore';
import useAuthStore from '../../../../stores/authStore';
import MobileMenu from './MobileMenu';
import Profile from '../../../profile/Profile';
import SearchModal from './searchModal/SearchModal';
import CountrySelector from '../../CountrySelector';
import styles from './responsiveHeader.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'

export default function ResponseHeader({ setShowWishlistModal, setShowCartModal, setShowLoginModal, setShowRegisterModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const { getWishlistCount } = useWishlistStore();
  const { getCartCount } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
    setIsMenuOpen(false);
  };

  // Handle scroll to make header fixed with throttling for smoother performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setIsHeaderFixed(scrollTop > 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`${styles.mobileHeader} ${isHeaderFixed ? styles.fixed : ''}`}>
        <div className={`container ${styles.container} between`}>
          <div className={`${styles.actions} center`}>
            <div className={`center ${styles.wishlistContainer}`} onClick={() => setShowWishlistModal(true)}>
              <FaHeart className={`${styles.icon}`} />
              {wishlistCount > 0 && (
                <span className={styles.wishlistBadge}>{wishlistCount}</span>
              )}
            </div>
            <div className={`center ${styles.cartContainer}`} onClick={() => setShowCartModal(true)}>
              <FaShoppingCart className={`${styles.icon}`} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </div>
            {isAuthenticated && (
              <div className={`center ${styles.profileContainer}`} onClick={() => setShowProfile(true)}>
                <FaUser className={`${styles.icon}`} />
              </div>
            )}
          </div>

          <div className={`center ${styles.logo_container}`}>
            <img src={logo} alt="لبان الغزال" />
            <CountrySelector />
          </div>

          <div
            className={`${styles.menuIcon} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
      />

      <SearchModal
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      <Profile
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        onLogout={handleLogout}
      />
    </>
  )
}
