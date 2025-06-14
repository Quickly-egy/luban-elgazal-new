import React from 'react';
import { useStore } from '../../../store/useStore';
import './Header.css';

const Header = () => {
  const getCartItemsCount = useStore((state) => state.getCartItemsCount);
  const cartItemsCount = getCartItemsCount();
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>لقمان الغزال</h2>
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li><a href="/">الرئيسية</a></li>
              <li><a href="/products">المنتجات</a></li>
              <li><a href="/about">من نحن</a></li>
              <li><a href="/contact">اتصل بنا</a></li>
              <li className="cart-link">
                <a href="/cart">
                  السلة ({cartItemsCount})
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 