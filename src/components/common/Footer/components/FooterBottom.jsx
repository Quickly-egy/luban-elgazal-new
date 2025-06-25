import React from "react";
import { motion } from "framer-motion";

// Import payment method images
import visaImage from "../../../../assets/payment methods/فيزا .png";
import mastercardImage from "../../../../assets/payment methods/ماستر كارد.png";
import applePayImage from "../../../../assets/payment methods/Apple_Pay_logo.svg.png";
import tabbyImage from "../../../../assets/payment methods/تابي .png";
import samsungPayImage from "../../../../assets/payment methods/سامسونج باي.png";

const FooterBottom = () => {
  const paymentMethods = [
    { name: "فيزا", image: visaImage },
    { name: "ماستركارد", image: mastercardImage },
    { name: "أبل باي", image: applePayImage },
    { name: "تابي", image: tabbyImage },
    { name: "سامسونج باي", image: samsungPayImage },
  ];

  return (
    <div className="footer-bottom">
      <div className="container">
        <motion.div
          className="footer-bottom-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="copyright">
            <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لبان الغزال</p>
          </div>

          <div className="payment-methods">
            <span className="payment-text">طرق الدفع المتاحة:</span>
            <div className="payment-icons">
              {paymentMethods.map((method, index) => (
                <div key={index} className="payment-icon" title={method.name}>
                  <img
                    src={method.image}
                    alt={method.name}
                    className="payment-method-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FooterBottom;
