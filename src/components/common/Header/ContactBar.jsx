import React from 'react';

const ContactBar = () => {
  return (
    <div className="contact-bar">
        <div className="contact-bar-content">
          <div className="social-section">
            <div className="social-icons">
              <a href="#" className="social-link tiktok" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="#" className="social-link youtube" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-link instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          <div className="contact-section">
            <div className="contact-info">
              <div className="support-badge">
                <span className="support-text">متاحون 24/7</span>
                <i className="fas fa-clock"></i>
              </div>
              <a href="mailto:updated@example.com" className="contact-link email-link">
                <span>updated@example.com</span>
                <i className="fas fa-envelope"></i>
              </a>
              <a href="tel:+987654321" className="contact-link phone-link">
                <span>20+ 987654321</span>
                <i className="fas fa-phone"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ContactBar; 