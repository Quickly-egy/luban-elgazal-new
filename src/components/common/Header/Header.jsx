import React from 'react';
import TopBanner from './TopBanner';
import MainHeader from './MainHeader';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <TopBanner />
      <MainHeader />
      <Navigation />
    </header>
  );
};

export default Header; 