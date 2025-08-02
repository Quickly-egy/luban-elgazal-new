import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import MobileMenu from './MobileMenu';
import SearchModal from './searchModal/SearchModal';
import CountrySelector from '../../CountrySelector';
import styles from './responsiveHeader.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'

export default function ResponseHeader({ setShowWishlistModal, setShowCartModal, setShowLoginModal, setShowRegisterModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setShowSearchModal(!showSearchModal);
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
          <div className={`${styles.leftSection} center`}>
            <div className={styles.countrySelector}>
              <CountrySelector />
            </div>
          </div>

          <div className={`center ${styles.logo_container}`}>

            <img loading="lazy" src={logo} width={"80px"} height={"80px"} alt="لبان الغزال" />

          </div>

          <div className={`${styles.rightSection} center`}>
            <div
              className={`${styles.searchIcon} center`}
              onClick={toggleSearch}
              title="البحث"
            >
              <IoSearchSharp />
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
