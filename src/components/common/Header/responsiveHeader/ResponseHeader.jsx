import { useState } from 'react';
import { FaHeart, FaSearch, FaShoppingCart, FaUser, FaUserPlus } from 'react-icons/fa';
import useWishlistStore from '../../../../stores/wishlistStore';
import useCartStore from '../../../../stores/cartStore';
import MobileMenu from './MobileMenu';
import SearchModal from './searchModal/SearchModal';
import styles from './responsiveHeader.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'
export default function ResponseHeader({ setShowWishlistModal, setShowCartModal, setShowLoginModal, setShowRegisterModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { getWishlistCount } = useWishlistStore();
  const { getCartCount } = useCartStore();
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={styles.mobileHeader}>
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
            <div className={`center`} onClick={() => setShowSearchModal(true)}> <FaSearch className={`${styles.icon}`} /></div>
          </div>

          <div className={`center ${styles.logo_container}`}>
            <img src={logo} alt="logo not found" style={{ width: "150px" }} />
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
    </>
  )
}
