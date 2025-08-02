import React from "react";
import { FaShieldAlt, FaLock } from "react-icons/fa";

// Import payment method images
import visaImage from "../../../../assets/payment methods/فيزا .png";
import mastercardImage from "../../../../assets/payment methods/ماستر كارد.png";
import applePayImage from "../../../../assets/payment methods/Apple_Pay_logo.svg.png";
import tabbyImage from "../../../../assets/payment methods/تابي .png";
import samsungPayImage from "../../../../assets/payment methods/سامسونج باي.png";
import madaImage from "../../../../assets/payment methods/مدى.png";

const CheckoutFooter = () => {
  const paymentMethods = [
    { name: "فيزا", image: visaImage },
    { name: "ماستركارد", image: mastercardImage },
    { name: "مدى", image: madaImage },
    { name: "أبل باي", image: applePayImage },
    { name: "تابي", image: tabbyImage },
    { name: "سامسونج باي", image: samsungPayImage },
  ];

  return (
    <div className="checkout-footer">
      <div className="container">
        <div className="checkout-footer-content">
          {/* Security Badge */}
          <div className="security-section">
            <div className="security-badge">
              <FaShieldAlt className="security-icon" />
              <div className="security-text">
                <span className="security-title">دفع آمن</span>
                <span className="security-subtitle">محمي بتشفير SSL</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-section">
            <div className="payment-header">
              <FaLock className="payment-lock-icon" />
              <span className="payment-text">طرق الدفع المتاحة</span>
            </div>
            <div className="payment-icons">
              {paymentMethods.map((method, index) => (
                <div key={index} className="payment-icon" title={method.name}>
                  <img
                  loading="lazy"
                    src={method.image}
                    alt={method.name}
                    className="payment-method-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="copyright-section">
            <p className="copyright-text">
              © {new Date().getFullYear()} جميع الحقوق محفوظة لبان الغزال
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFooter;
