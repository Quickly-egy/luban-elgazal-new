import React from 'react';
import { motion } from 'framer-motion';

const FooterBottom = () => {
  const paymentMethods = [
    { name: 'فيزا', icon: 'visa' },
    { name: 'ماستركارد', icon: 'mastercard' },
    { name: 'أبل باي', icon: 'apple-pay' },
    { name: 'جوجل باي', icon: 'google-pay' },
    { name: 'أمريكان إكسبريس', icon: 'amex' }
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
            <p>
              © {new Date().getFullYear()} جميع الحقوق محفوظة لبان الغزال
            </p>
          </div>

          <div className="payment-methods">
            <span className="payment-text">طرق الدفع المتاحة:</span>
            <div className="payment-icons">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className={`payment-icon payment-${method.icon}`}
                  title={method.name}
                >
                  {method.icon === 'visa' && (
                    <div className="visa-card">VISA</div>
                  )}
                  {method.icon === 'mastercard' && (
                    <div className="mastercard-logo">
                      <div className="mc-circle mc-red"></div>
                      <div className="mc-circle mc-yellow"></div>
                    </div>
                  )}
                  {method.icon === 'apple-pay' && (
                    <div className="apple-pay">
                      <span>🍎</span>
                      <span>Pay</span>
                    </div>
                  )}
                  {method.icon === 'google-pay' && (
                    <div className="google-pay">
                      <span>G</span>
                      <span>Pay</span>
                    </div>
                  )}
                  {method.icon === 'amex' && (
                    <div className="amex-card">AMEX</div>
                  )}
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