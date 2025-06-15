import { useState, useEffect } from 'react';
import FirstHeader from './normalHeader/firstHeader/FirstHeader';
import styles from './Header.module.css';
import NavBar from './normalHeader/navBar/NavBar';
import SecHeader from './normalHeader/secHeader/SecHeader';
import ThirdHeader from './normalHeader/thirdHeader/ThirdHeader';
import ResponseHeader from './responsiveHeader/ResponseHeader';
import WishlistModal from './wishlistModal/WishlistModal';


const Header = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  return (
    <header className={`${styles.header}`} style={{ direction: "ltr" }}>

      {screenWidth > 1000 ? (
        <>
          <FirstHeader />
          <SecHeader />
          <ThirdHeader setShowWishlistModal={setShowWishlistModal}/>
          <NavBar />
        </>
      ) : (
        <>
          <ResponseHeader  />
        </>
      )}
      <WishlistModal showWishlistModal={showWishlistModal} setShowWishlistModal={setShowWishlistModal}/>
    </header>
  );
};

export default Header; 