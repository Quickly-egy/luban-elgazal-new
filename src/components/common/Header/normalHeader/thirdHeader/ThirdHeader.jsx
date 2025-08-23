import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import styles from "./thirdHeader.module.css";
import { useState, useRef, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useWishlistStore from "../../../../../stores/wishlistStore";
import useCartStore from "../../../../../stores/cartStore";
import useAuthStore from "../../../../../stores/authStore";
import Profile from "../../../../profile/Profile";
import SearchModal from "./SearchModal";
import CountrySelector from "../../../CountrySelector";
import logo from "./imgs/logo-CkHS0Ygq.webp";
import { Link } from "react-router-dom";

export default function ThirdHeader({
  setShowWishlistModal,
  setShowCartModal,
  setShowLoginModal,
  setShowRegisterModal,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchWrapperRef = useRef(null);
  const { getWishlistCount } = useWishlistStore();
  const { getCartCount } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  // Close search modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setShowSearchModal(false);
      }
    };

    if (showSearchModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchModal]);

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  const handleSearchFocus = () => {
    setShowSearchModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (!showSearchModal) {
      setShowSearchModal(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSearchModal(true);
    }
  };

  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
    setSearchValue("")
  };

  return (
    <div className={`${styles.thirdHeader}`}>
      <div className={`${styles.container} container between`}>
        {/* auth , cart and whishlist part */}
        <div className={`${styles.leftSide} center`}>
          {isAuthenticated ? (
            <button className={`center`} onClick={() => setShowProfile(true)}>
              <FaUser className={`${styles.icon}`} />
            </button>
          ) : (
            <button
                className={`center`}
                onClick={() => setShowLoginModal(true)}
              >
                <FaUser className={`${styles.icon}`} />
              </button>
          )}

          <div
            className={`center ${styles.cartContainer}`}
            onClick={() => setShowCartModal(true)}
          >
            <FaShoppingCart className={`${styles.icon}`} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </div>
          <div
            className={`center ${styles.wishlistContainer}`}
            onClick={() => setShowWishlistModal(true)}
          >
            <FaHeart className={`${styles.icon}`} />
            {wishlistCount > 0 && (
              <span className={styles.wishlistBadge}>{wishlistCount}</span>
            )}
          </div>
        </div>
        <div className={`${styles.middlePart} center`}>
          <div className={styles.searchWrapper} ref={searchWrapperRef}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="ابحث عن منتج"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                />
                <span className={`center`} onClick={handleSearchFocus}>
                  <IoSearchSharp className={`${styles.icon}`} />
                </span>
              </div>
            </form>

            {/* Search Modal positioned under the input */}
            {showSearchModal && (
              <SearchModal
                isOpen={showSearchModal}
                onClose={handleCloseSearchModal}
                searchQuery={searchValue}
                setSearchQuery={setSearchValue}
              />
            )}
          </div>
        </div>

        {/* logo right side */}
        <div className={`center ${styles.rightSide}`}>
         <CountrySelector />
      <Link to="/">
            <img loading="lazy" src={logo} alt="logo not found" />
      </Link>

 
        </div>
      </div>

      <Profile
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}
