import { useState, useEffect } from 'react';
import FirstHeader from './normalHeader/firstHeader/FirstHeader';
import styles from './Header.module.css';
import NavBar from './normalHeader/navBar/NavBar';
import SecHeader from './normalHeader/secHeader/SecHeader';
import ThirdHeader from './normalHeader/thirdHeader/ThirdHeader';
import ResponseHeader from './responsiveHeader/ResponseHeader';
import WishlistModal from './wishlistModal/WishlistModal';
import CartModal from './cartModal/CartModal';


const Header = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  return (
    <header className={`${styles.header}`} style={{ direction: "ltr" }}>

      {screenWidth > 1000 ? (
        <>
          <FirstHeader />
          <SecHeader />
          <ThirdHeader setShowWishlistModal={setShowWishlistModal} setShowCartModal={setShowCartModal}/>
          <div className={`${styles.navBarWrapper} ${isScrolled ? styles.fixed : ''}`}>
          <NavBar />
          </div>
        </>
      ) : (
        <>
          <ResponseHeader setShowWishlistModal={setShowWishlistModal} setShowCartModal={setShowCartModal} />
        </>
      )}
      <WishlistModal showWishlistModal={showWishlistModal} setShowWishlistModal={setShowWishlistModal}/>
      <CartModal showCartModal={showCartModal} setShowCartModal={setShowCartModal}/>
    </header>
  );
};

export default Header; 