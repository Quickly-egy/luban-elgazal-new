import React from 'react';
import FooterTop from './components/FooterTop';
import FooterMiddle from './components/FooterMiddle';
import FooterBottom from './components/FooterBottom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <FooterTop />
      <FooterMiddle />
      <FooterBottom />
    </footer>
  );
};

export default Footer;
