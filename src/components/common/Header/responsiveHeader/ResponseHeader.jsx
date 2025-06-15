import { useState } from 'react';
import { FaHeart, FaSearch, FaShoppingCart } from 'react-icons/fa';
import styles from './responsiveHeader.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'
export default function ResponseHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.mobileHeader}>
      <div className={`container ${styles.container} between`}>
        <div className={`${styles.actions} center`}>
          <div className={`center`}> <FaHeart className={`${styles.icon}`} /></div>
          <div className={`center`}> <FaShoppingCart className={`${styles.icon}`} /></div>
          <div className={`center`}> <FaSearch className={`${styles.icon}`} /></div>
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
  )
}
