import React from 'react';
import { motion } from 'framer-motion';
import FooterTop from './components/FooterTop';
import FooterMiddle from './components/FooterMiddle';
import FooterBottom from './components/FooterBottom';
import './Footer.css';

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <FooterTop />
      <FooterMiddle />
      <FooterBottom />
    </motion.footer>
  );
};

export default Footer;
