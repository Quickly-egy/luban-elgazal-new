import { useState, useEffect } from "react";
import FirstHeader from "./normalHeader/firstHeader/FirstHeader";
import styles from "./Header.module.css";
import NavBar from "./normalHeader/navBar/NavBar";
import SecHeader from "./normalHeader/secHeader/SecHeader";
import ThirdHeader from "./normalHeader/thirdHeader/ThirdHeader";
import ResponseHeader from "./responsiveHeader/ResponseHeader";
import WishlistModal from "./wishlistModal/WishlistModal";
import CartModal from "./cartModal/CartModal";
import { LoginModal, RegisterModal, ForgotPasswordModal } from "./authModals";
import OTPModal from "./authModals/OTPModal";
import SuccessNotification from "../SuccessNotification/SuccessNotification";

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

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [globalNotification, setGlobalNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  return (
    <header className={`${styles.header}`} style={{ direction: "ltr" }}>
      {screenWidth > 1000 ? (
        <>
          <FirstHeader />
          <SecHeader />
          <ThirdHeader
            setShowWishlistModal={setShowWishlistModal}
            setShowCartModal={setShowCartModal}
            setShowLoginModal={setShowLoginModal}
            setShowRegisterModal={setShowRegisterModal}
          />
          <div
            className={`${styles.navBarWrapper} ${
              isScrolled ? styles.fixed : ""
            }`}
          >
            <NavBar isFixed={isScrolled} />
          </div>
        </>
      ) : (
        <>
          <ResponseHeader
            setShowWishlistModal={setShowWishlistModal}
            setShowCartModal={setShowCartModal}
            setShowLoginModal={setShowLoginModal}
            setShowRegisterModal={setShowRegisterModal}
          />
        </>
      )}
      <WishlistModal
        showWishlistModal={showWishlistModal}
        setShowWishlistModal={setShowWishlistModal}
      />
      <CartModal
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        setShowLoginModal={setShowLoginModal}
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
      <OTPModal
        showOTPModal={showOTPModal}
        setShowOTPModal={setShowOTPModal}
        setShowLoginModal={setShowLoginModal}
        setGlobalNotification={setGlobalNotification}
      />
      <ForgotPasswordModal
        showForgotPasswordModal={showForgotPasswordModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
        setShowLoginModal={setShowLoginModal}
      />

      {/* Global Success Notification */}
      <SuccessNotification
        isVisible={globalNotification.isVisible}
        message={globalNotification.message}
        type={globalNotification.type}
        onClose={() =>
          setGlobalNotification((prev) => ({ ...prev, isVisible: false }))
        }
        duration={4000}
      />
    </header>
  );
};

export default Header;
