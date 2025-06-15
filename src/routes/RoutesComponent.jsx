import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';

const RoutesComponent = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>

      <Footer />
    </>
  );
};

export default RoutesComponent;
