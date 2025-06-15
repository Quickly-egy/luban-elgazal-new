import { FaHeart, FaShoppingCart, FaUser, FaUserPlus } from "react-icons/fa";
import styles from "./thirdHeader.module.css";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import logo from './imgs/logo-CkHS0Ygq.webp'
export default function ThirdHeader() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className={`${styles.thirdHeader}`}>
      <div className={`${styles.container} container between`}>
        {/* auth , cart and whishlist part */}
        <div className={`${styles.leftSide} center`}>
          <button className={`center`}>
            <FaUserPlus className={`${styles.icon}`} />
            <span>إنشاء حساب</span>
          </button>

          <button className={`center`}>
            <FaUser className={`${styles.icon}`} />
            <span>تسجيل الدخول</span>
          </button>

          <div className={`center`}>
            <FaShoppingCart className={`${styles.icon}`} />
          </div>
          <div className={`center`}>
            <FaHeart className={`${styles.icon}`} />
          </div>
        </div>
        <div className={`${styles.middlePart} center`}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="ابحث عن منتج"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <span className={`center`}>
              <IoSearchSharp className={`${styles.icon}`} />
            </span>
          </div>
          <select>
            <option value="0" disabled selected>جميع الفئات</option>
            <option value="1">العربية</option>
            <option value="2">العربية</option>
            <option value="3">العربية</option>
          </select>
        </div>

        {/* logo and country right side */}
        <div className={`center ${styles.rightSide}`}>
          <img src={logo} alt="logo not found" />
        </div>
      </div>
    </div>
  );
}
