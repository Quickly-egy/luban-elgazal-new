import React from 'react';
import FooterTop from './components/FooterTop';
import FooterMiddle from './components/FooterMiddle';
import FooterBottom from './components/FooterBottom';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer-parent'>
      <footer className="footer">
      <FooterTop />
      <FooterMiddle />
      <FooterBottom />
    </footer>
    </div>
  );
};

export default Footer;
