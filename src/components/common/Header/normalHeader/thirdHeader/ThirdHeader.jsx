import { FaHeart, FaShoppingCart, FaUser, FaUserPlus } from "react-icons/fa";
import styles from "./thirdHeader.module.css";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useWishlistStore from "../../../../../stores/wishlistStore";
import useCartStore from "../../../../../stores/cartStore";
import useAuthStore from "../../../../../stores/authStore";
import Profile from "../../../../profile/Profile";
import SearchModal from "./SearchModal";
import CountrySelector from "../../../CountrySelector";
import logo from './imgs/logo-CkHS0Ygq.webp'

export default function ThirdHeader({ setShowWishlistModal, setShowCartModal, setShowLoginModal, setShowRegisterModal }) {
  const [searchValue, setSearchValue] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { getWishlistCount } = useWishlistStore();
  const { getCartCount } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  const handleSearchFocus = () => {
    setShowSearchModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSearchModal(true);
    }
  };

  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
  };

  return (
    <div className={`${styles.thirdHeader}`}>
      <div className={`${styles.container} between`}>
        {/* auth , cart and whishlist part */}
        <div className={`${styles.leftSide} center`}>
          {isAuthenticated ? (
            <button className={`center`} onClick={() => setShowProfile(true)}>
              <FaUser className={`${styles.icon}`} />
              <span>حسابي</span>
            </button>
          ) : (
            <>
              <button className={`center`} onClick={() => setShowRegisterModal(true)}>
                <FaUserPlus className={`${styles.icon}`} />
                <span>إنشاء حساب</span>
              </button>

              <button className={`center`} onClick={() => setShowLoginModal(true)}>
                <FaUser className={`${styles.icon}`} />
                <span>تسجيل الدخول</span>
              </button>
            </>
          )}

          <div className={`center ${styles.cartContainer}`} onClick={() => setShowCartModal(true)}>
            <FaShoppingCart className={`${styles.icon}`} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </div>
          <div className={`center ${styles.wishlistContainer}`} onClick={() => setShowWishlistModal(true)}>
            <FaHeart className={`${styles.icon}`} />
            {wishlistCount > 0 && (
              <span className={styles.wishlistBadge}>{wishlistCount}</span>
            )}
          </div>
        </div>
        <div className={`${styles.middlePart} center`}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="ابحث عن منتج"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={handleSearchFocus}
                readOnly
              />
              <span className={`center`} onClick={handleSearchFocus}>
                <IoSearchSharp className={`${styles.icon}`} />
              </span>
            </div>
          </form>
          <select>
            <option value="0" disabled selected>جميع الفئات</option>
            <option value="1">العربية</option>
            <option value="2">العربية</option>
            <option value="3">العربية</option>
          </select>
        </div>

        {/* logo right side */}
        <div className={`center ${styles.rightSide}`}>
          <img src={logo} alt="logo not found" />
          <CountrySelector />
        </div>
      </div>

      <Profile
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        onLogout={handleLogout}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={handleCloseSearchModal}
        searchQuery={searchValue}
        setSearchQuery={setSearchValue}
      />
    </div>
  );
}
