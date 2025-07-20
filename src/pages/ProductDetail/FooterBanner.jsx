import React, { useState } from "react";
import "./FooterBanner.css";
import bannerImg from "../../assets/images/banner.png"; // غيّر المسار حسب مكان الصورة

const FooterAdBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="footer-banner-wrapper">
      <div
        className="footer-banner"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="banner-overlay">
          <div className="banner-text">
            {/* <h2>هل لديك منتج أو خدمة؟</h2>
            <p>أعلن الآن على منصتنا واجذب آلاف العملاء</p> */}
            <button
              className="banner-button"
              onClick={() => window.location.href = "/products"}
            >
              اكتشف المزيد
            </button>
          </div>
          <span className="banner-close" onClick={() => setVisible(false)}>
            &times;
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterAdBanner;
