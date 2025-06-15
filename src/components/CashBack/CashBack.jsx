import React from 'react';
import './CashBack.css';

const CashBack = () => {
  return (
    <div className="cashback-section">
      <div className="container">
        <div className="cashback-content">
          <div className="cashback-text">
            <h2>احصل على استرداد نقدي للأشياء التي تشتريها من أي مكان</h2>
            <p>التطبيق عبر لبان الغزال. <span className="terms-link">الشروط والأحكام.</span></p>
            <button className="view-more-btn">عرض المزيد</button>
          </div>
          
          <div className="cashback-visual">
            <div className="credit-card">
              <div className="card-chip"></div>
              <div className="card-number">**** **** **** 1234</div>
            </div>
            
            <div className="payment-methods">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="payment-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="payment-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="American Express" className="payment-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="payment-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashBack; 