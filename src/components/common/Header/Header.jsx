import { useState, useEffect } from 'react';
import FirstHeader from './normalHeader/firstHeader/FirstHeader';
import styles from './Header.module.css';
import NavBar from './normalHeader/navBar/NavBar';
import SecHeader from './normalHeader/secHeader/SecHeader';
import ThirdHeader from './normalHeader/thirdHeader/ThirdHeader';
import ResponseHeader from './responsiveHeader/ResponseHeader';


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

  return (
    <header className={`${styles.header}`} style={{direction:"ltr"}}>
      {screenWidth > 1000 ? (
        <>
          <div className={`${styles.headerTop} ${isScrolled ? styles.hidden : ''}`}>
            <FirstHeader />
            <SecHeader />
            <ThirdHeader />
          </div>
          <div className={`${styles.navBarWrapper} ${isScrolled ? styles.fixed : ''}`}>
            <NavBar />
          </div>
          {isScrolled && <div className={styles.navBarSpacer}></div>}
        </>
      ) : (
        <>
          <ResponseHeader />
        </>
      )}
    </header>
  );
};

export default Header; 