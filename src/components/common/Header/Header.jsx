import { useState, useEffect } from 'react';
import FirstHeader from './normalHeader/firstHeader/FirstHeader';
import styles from './Header.module.css';
import NavBar from './normalHeader/navBar/NavBar';
import SecHeader from './normalHeader/secHeader/SecHeader';
import ThirdHeader from './normalHeader/thirdHeader/ThirdHeader';
import ResponseHeader from './responsiveHeader/ResponseHeader';


const Header = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`${styles.header}`} style={{direction:"ltr"}}>
      {screenWidth > 1000 ? (
        <>
          <FirstHeader />
          <SecHeader />
          <ThirdHeader />
          <NavBar />
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